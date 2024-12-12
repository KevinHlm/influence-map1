import React, { useState } from 'react';
import { Node } from './types';

interface EditStakeholderModalProps {
  stakeholder: Node;
  onClose: () => void;
  onUpdate: (stakeholder: Node) => void;
  stakeholders: Node[];
}

export function EditStakeholderModal({ 
  stakeholder, 
  onClose, 
  onUpdate,
  stakeholders 
}: EditStakeholderModalProps) {
  const [editedStakeholder, setEditedStakeholder] = useState(stakeholder);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditedStakeholder(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'relationshipScore' || name === 'decisionWeighting'
        ? parseInt(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedStakeholder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Edit Stakeholder</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={editedStakeholder.name}
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
              value={editedStakeholder.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Division</label>
            <select
              name="division"
              value={editedStakeholder.division}
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
              value={editedStakeholder.reportsTo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="None">None</option>
              {stakeholders
                .filter(s => s.name !== editedStakeholder.name)
                .map((s, index) => (
                  <option key={index} value={s.name}>
                    {s.name}
                  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Relationship Score (0-10)
            </label>
            <input
              type="range"
              name="relationshipScore"
              min="0"
              max="10"
              value={editedStakeholder.relationshipScore}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
            <span className="text-sm text-gray-500">{editedStakeholder.relationshipScore}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Decision Weighting (0-100)
            </label>
            <input
              type="range"
              name="decisionWeighting"
              min="0"
              max="100"
              value={editedStakeholder.decisionWeighting}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
            <span className="text-sm text-gray-500">{editedStakeholder.decisionWeighting}%</span>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
