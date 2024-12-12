import * as d3 from 'd3';
import { Node } from '../types';

export function createTreeLayout(width: number, height: number) {
  return d3.tree<Node>()
    .size([width * 0.8, height * 0.8])
    .nodeSize([180, 120])
    .separation((a, b) => {
      return a.parent === b.parent ? 1.5 : 2.5;
    });
}

export function createHierarchy(data: Node[]) {
  if (!data.length) return null;

  // Create a virtual root for floating nodes
  const rootNodes = data.filter(d => d.reportsTo === 'None');
  if (rootNodes.length > 1) {
    const virtualRoot: Node = {
      name: '__virtual_root__',
      role: '',
      division: '',
      reportsTo: '',
      relationshipScore: 0,
      decisionWeighting: 0
    };

    const dataWithVirtualRoot = [
      virtualRoot,
      ...data.map(node => ({
        ...node,
        reportsTo: node.reportsTo === 'None' ? '__virtual_root__' : node.reportsTo
      }))
    ];

    const stratify = d3.stratify<Node>()
      .id(d => d.name)
      .parentId(d => d.reportsTo);

    try {
      return stratify(dataWithVirtualRoot);
    } catch (error) {
      console.error('Error creating hierarchy:', error);
      return null;
    }
  }

  const stratify = d3.stratify<Node>()
    .id(d => d.name)
    .parentId(d => d.reportsTo === 'None' ? null : d.reportsTo);

  try {
    return stratify(data);
  } catch (error) {
    console.error('Error creating hierarchy:', error);
    return null;
  }
}
