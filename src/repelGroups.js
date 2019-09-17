import * as d3 from 'd3';
import generateProcesses from './processes';

export default function generateRepelGroups() {
  let height = 500;
  let width = 500;

  function repelGroups(selection) {
    selection.each(function(data) {
      const svg = d3.select(this);
      const groupData = data.groups;
      const cx = width / 2;
      const cy = height / 2;
      groupData.forEach((group, i) => {
        group.index = i;
        group.x = cx;
        group.y = cy;
      });

      const forceSimulation = d3.forceSimulation(groupData)
        .force('center', d3.forceCenter(cx, cy))
        .force('repel', d3.forceManyBody().strength(-50))
        .force('bound', generateBoundingForce(width, height));


      svg.attr('height', height)
        .attr('width', width);


      forceSimulation.on('tick', () => {
        let groups = svg.selectAll('g.repel-group')
          .data(groupData);

        groups.exit()
          .remove();

        groups = groups.enter()
          .append('g')
          .attr('class', 'repel-group')
          .merge(groups);

        groups
          .attr('transform', (d, i) => `translate(${d.x}, ${d.y})`)
        const processes = generateProcesses()
        groups.call(processes);
      });

    });
  }

  return repelGroups;
};

function generateBoundingForce(width, height) {
  let cachedNodes;

  function boundingForce(alpha) {
    cachedNodes.forEach(function(node) {
      node.x = Math.max(100, Math.min(width - 100, node.x));
      node.y = Math.max(100, Math.min(height - 100, node.y));
    })
  }

  boundingForce.initialize = function(nodes) {
    if (nodes === undefined) {
      return cachedNodes;
    }

    cachedNodes = nodes;
    return boundingForce;
  }

  return boundingForce;
}
