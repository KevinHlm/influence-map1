import React from 'react';
import { Node } from './types';

interface StakeholderStatsProps {
  stakeholders: Node[];
}

export function StakeholderStats({ stakeholders }: StakeholderStatsProps) {
  const totalStakeholders = stakeholders.length;
  const avgRelationshipScore = stakeholders.reduce((sum, s) => sum + s.relationshipScore, 0) / totalStakeholders;
  const avgDecisionWeight = stakeholders.reduce((sum, s) => sum + s.decisionWeighting, 0) / totalStakeholders;
  
  const divisionBreakdown = stakeholders.reduce((acc, s) => {
    acc[s.division] = (acc[s.division] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalStakeholders = stakeholders.filter(s => 
    s.decisionWeighting > 70 && s.relationshipScore < 30
  ).length;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900">Stakeholder Statistics</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Total Stakeholders: <span className="font-medium text-gray-900">{totalStakeholders}</span>
        </p>
        <p className="text-sm text-gray-600">
          Avg Relationship Score: <span className="font-medium text-gray-900">{avgRelationshipScore.toFixed(1)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Avg Decision Weight: <span className="font-medium text-gray-900">{avgDecisionWeight.toFixed(1)}%</span>
        </p>
        <p className="text-sm text-gray-600">
          Critical Stakeholders: <span className="font-medium text-gray-900">{criticalStakeholders}</span>
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Division Breakdown:</h4>
        {Object.entries(divisionBreakdown).map(([division, count]) => (
          <p key={division} className="text-sm text-gray-600">
            {division}: <span className="font-medium text-gray-900">{count}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
