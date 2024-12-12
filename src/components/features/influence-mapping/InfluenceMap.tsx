import React, { useState, useCallback } from 'react';
import { useAnalysisStore } from '../../../store/analysisStore';
import { InfluenceMapD3 } from './InfluenceMapD3';
import { EditStakeholderModal } from './EditStakeholderModal';
import { SearchBar } from './SearchBar';
import { StakeholderStats } from './StakeholderStats';
import { Node } from './types';
import { useHistory } from './hooks/useHistory';

export function InfluenceMap() {
  const [stakeholders, setStakeholders] = useState<Node[]>([]);
  const [editingStakeholder, setEditingStakeholder] = useState<Node | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupByDivision, setGroupByDivision] = useState(false);
  
  const { undo, redo, addToHistory, canUndo, canRedo } = useHistory<Node[]>(stakeholders);

  const [formData, setFormData] = useState<Node>({
    name: '',
    role: '',
    division: '',
    reportsTo: 'None',
    relationshipScore: 5,
    decisionWeighting: 50
  });

  const { setCurrentInfluenceMap, saveInfluenceMap } = useAnalysisStore();

  const checkCircularDependency = useCallback((name: string, reportsTo: string): boolean => {
    let current = reportsTo;
    const visited = new Set();
    while (current !== 'None') {
      if (current === name) return true;
      if (visited.has(current)) return true;
      visited.add(current);
      current = stakeholders.find(s => s.name === current)?.reportsTo || 'None';
    }
    return false;
  }, [stakeholders]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkCircularDependency(formData.name, formData.reportsTo)) {
      alert('Circular reporting structure detected. Please choose a different reporting relationship.');
      return;
    }

    const updatedStakeholders = [...stakeholders, formData];
    addToHistory(updatedStakeholders);
    setStakeholders(updatedStakeholders);
    setCurrentInfluenceMap(updatedStakeholders);
    await saveInfluenceMap();

    setFormData({
      name: '',
      role: '',
      division: '',
      reportsTo: 'None',
      relationshipScore: 5,
      decisionWeighting: 50
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the influence map? This will remove all stakeholders.')) {
      const emptyStakeholders: Node[] = [];
      addToHistory(emptyStakeholders);
      setStakeholders(emptyStakeholders);
      setCurrentInfluenceMap(emptyStakeholders);
      setFormData({
        name: '',
        role: '',
        division: '',
        reportsTo: 'None',
        relationshipScore: 5,
        decisionWeighting: 50
      });
    }
  };

  const handleUpdateStakeholder = async (updatedStakeholder: Node) => {
    if (checkCircularDependency(updatedStakeholder.name, updatedStakeholder.reportsTo)) {
      alert('Circular reporting structure detected. Please choose a different reporting relationship.');
      return;
    }

    const updatedStakeholders = stakeholders.map(s => 
      s.name === updatedStakeholder.name ? updatedStakeholder : s
    );
    addToHistory(updatedStakeholders);
    setStakeholders(updatedStakeholders);
    setCurrentInfluenceMap(updatedStakeholders);
    await saveInfluenceMap();
    setEditingStakeholder(null);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(stakeholders, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'influence-map.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedStakeholders = JSON.parse(e.target?.result as string);
          addToHistory(importedStakeholders);
          setStakeholders(importedStakeholders);
          setCurrentInfluenceMap(importedStakeholders);
        } catch (error) {
          alert('Error importing file. Please ensure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredStakeholders = stakeholders.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-[400px,1fr] h-full">
      <div className="p-6 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="mb-6 space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => undo()}
              disabled={!canUndo}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={() => redo()}
              disabled={!canRedo}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Redo
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={exportData}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg"
            >
              Export
            </button>
            <label className="px-3 py-1 bg-blue-600 text-white rounded-lg cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          <SearchBar 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="groupByDivision"
              checked={groupByDivision}
              onChange={(e) => setGroupByDivision(e.target.checked)}
            />
            <label htmlFor="groupByDivision">Group by Division</label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Division</label>
            <select
              name="division"
              value={formData.division}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="">Select Division</option>
              <option value="Executive">Executive</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Technology">Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reports To</label>
            <select
              name="reportsTo"
              value={formData.reportsTo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="None">None</option>
              {stakeholders.map((stakeholder, index) => (
                <option key={index} value={stakeholder.name}>
                  {stakeholder.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Relationship Score (0-10): {formData.relationshipScore}
            </label>
            <input
              type="range"
              name="relationshipScore"
              min="0"
              max="10"
              value={formData.relationshipScore}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Decision Weighting (0-100): {formData.decisionWeighting}%
            </label>
            <input
              type="range"
              name="decisionWeighting"
              min="0"
              max="100"
              value={formData.decisionWeighting}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Stakeholder
          </button>
        </form>

        {stakeholders.length > 0 && (
          <div className="mt-6">
            <StakeholderStats stakeholders={stakeholders} />
          </div>
        )}
      </div>

      <div className="relative bg-gray-50 p-6">
        <div className="absolute inset-6">
          <InfluenceMapD3 
            data={filteredStakeholders}
            groupByDivision={groupByDivision}
            onNodeClick={setEditingStakeholder}
          />
        </div>
        
        {stakeholders.length > 0 && (
          <button
            onClick={handleReset}
            className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset Map
          </button>
        )}
      </div>

      {editingStakeholder && (
        <EditStakeholderModal
          stakeholder={editingStakeholder}
          onClose={() => setEditingStakeholder(null)}
          onUpdate={handleUpdateStakeholder}
          stakeholders={stakeholders}
        />
      )}
    </div>
  );
}
