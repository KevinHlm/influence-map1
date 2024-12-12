import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Node } from './types';
import { calculateNodeColor } from './utils/colorUtils';
import { createTreeLayout, createHierarchy } from './utils/treeUtils';

interface InfluenceMapD3Props {
  data: Node[];
  groupByDivision?: boolean;
  onNodeClick?: (node: Node) => void;
}

export function InfluenceMapD3({ data, groupByDivision = false, onNodeClick }: InfluenceMapD3Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create container group
    const g = svg.append('g');

    // Create hierarchy
    const root = createHierarchy(data);
    if (!root) return;

    // Create tree layout
    const treeLayout = createTreeLayout(width, height);
    const nodes = treeLayout(root);

    // Draw links
    g.selectAll('path.link')
      .data(nodes.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    // Draw nodes
    const node = g.selectAll('g.node')
      .data(nodes.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onNodeClick && d.data.name !== '__virtual_root__') {
          onNodeClick(d.data);
        }
      });

    // Hide virtual root
    node.filter(d => d.data.name === '__virtual_root__')
      .style('display', 'none');

    // Add rectangles for nodes
    node.filter(d => d.data.name !== '__virtual_root__')
      .append('rect')
      .attr('width', 160)
      .attr('height', 80)
      .attr('x', -80)
      .attr('y', -40)
      .attr('rx', 8)
      .attr('fill', d => calculateNodeColor(d.data.relationshipScore, d.data.decisionWeighting))
      .attr('stroke', '#374151')
      .attr('stroke-width', 1);

    // Add text labels
    node.filter(d => d.data.name !== '__virtual_root__')
      .append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(d => {
        const name = d.data.name;
        return name.length > 20 ? name.substring(0, 17) + '...' : name;
      });

    node.filter(d => d.data.name !== '__virtual_root__')
      .append('text')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text(d => {
        const role = d.data.role;
        return role.length > 20 ? role.substring(0, 17) + '...' : role;
      });

    node.filter(d => d.data.name !== '__virtual_root__')
      .append('text')
      .attr('dy', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .text(d => {
        const division = d.data.division;
        return division.length > 20 ? division.substring(0, 17) + '...' : division;
      });

    // Add tooltips
    node.append('title')
      .text(d => `
        Name: ${d.data.name}
        Role: ${d.data.role}
        Division: ${d.data.division}
        Relationship Score: ${d.data.relationshipScore}/10
        Decision Weight: ${d.data.decisionWeighting}%
      `);

    // If grouping by division, adjust the layout
    if (groupByDivision) {
      const divisions = Array.from(new Set(data.map(d => d.division)));
      const divisionSpacing = width / (divisions.length + 1);
      
      node.attr('transform', d => {
        const divisionIndex = divisions.indexOf(d.data.division);
        const x = divisionSpacing * (divisionIndex + 1);
        return `translate(${x},${d.y})`;
      });

      // Add division labels
      g.selectAll('.division-label')
        .data(divisions)
        .join('text')
        .attr('class', 'division-label')
        .attr('x', (d, i) => divisionSpacing * (i + 1))
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .text(d => d);
    }

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Center the visualization
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const scale = 0.8;
      const dx = (width - bounds.width * scale) / 2;
      const dy = (height - bounds.height * scale) / 2;
      const transform = d3.zoomIdentity
        .translate(dx, dy)
        .scale(scale);

      svg.transition()
        .duration(750)
        .call(zoom.transform as any, transform);
    }

  }, [data, groupByDivision, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="bg-white rounded-xl"
      />
    </div>
  );
}
