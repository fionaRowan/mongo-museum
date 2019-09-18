import * as d3 from 'd3';
import generateBoundingForce from './boundingForce';

export default function generateForceSimulation({ n, cx, cy, itemRadius, boundingWidth, boundingHeight, boundingRadius }) {
  let numItems = n;
  let items = [];
  for (let i = 0; i < numItems; i++) {
    items.push({
      index: i,
      cx,
      cy
    });
  }

  const forceSimulation = d3.forceSimulation(items)
    .force('center', d3.forceCenter(cx, cy))
    .force('repel', d3.forceManyBody().strength(-30))
    .force('collision', d3.forceCollide(itemRadius))
    .force('bound', generateBoundingForce({ boundingWidth, boundingHeight, itemRadius, boundingRadius }));

  return forceSimulation;
}
