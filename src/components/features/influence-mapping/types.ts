export interface Node {
  name: string;
  role: string;
  division: string;
  reportsTo: string;
  relationshipScore: number;
  decisionWeighting: number;
}

export interface Link {
  source: string;
  target: string;
}
