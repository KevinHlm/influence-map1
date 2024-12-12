import * as d3 from 'd3';

export function calculateNodeColor(relationshipScore: number, decisionWeighting: number) {
  // Normalize scores to 0-1 range
  const r = relationshipScore / 10;
  const d = decisionWeighting / 100;

  // Critical Risk: High decision weight but low relationship
  if (d > 0.7 && r < 0.3) {
    return '#dc2626'; // Red
  }

  // Potential Ally: High relationship but low decision weight
  if (r > 0.7 && d < 0.3) {
    return '#fbbf24'; // Yellow
  }

  // Ideal Position: High on both metrics
  if (r > 0.7 && d > 0.7) {
    return '#059669'; // Green
  }

  // Low Priority: Low on both metrics
  if (r < 0.3 && d < 0.3) {
    return '#6b7280'; // Gray
  }

  // Create a blended color for intermediate values
  const colorScale = d3.scaleLinear<string>()
    .domain([0, 0.5, 1])
    .range(['#dc2626', '#fbbf24', '#059669'])
    .interpolate(d3.interpolateRgb.gamma(2.2));

  // Use relationship score as primary factor, influenced by decision weight
  const blendedScore = (r * 0.7) + (d * 0.3);
  return colorScale(blendedScore);
}
