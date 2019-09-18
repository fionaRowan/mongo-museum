import * as d3 from 'd3';
import generateProcesses from './processes';
import generateForceSimulation from './forceSimulation';

export default function generateRepelGroups() {
  let height = 500;
  let width = 500;
  let strokeWidth = 1;

  function repelGroups(selection) {
    selection.each(function(data) {
      const svg = d3.select(this);
      const groupData = data.groups;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(height, width) / (Math.ceil(Math.sqrt(groupData.length)) * 2) - strokeWidth;

      const forceSimulation = generateForceSimulation({
        n: groupData.length,
        cx,
        cy,
        itemRadius: r,
        boundingHeight: height,
        boundingWidth: width,
      });

      svg.attr('height', height)
        .attr('width', width);

      let groups = svg.selectAll('g.repel-group')
        .data(groupData);

      groups.exit()
        .remove();

      let groupsEnter = groups.enter()
        .append('g')
        .attr('class', 'repel-group');

      groupsEnter
        .append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', 'grey');

      groups = groupsEnter
        .merge(groups);

      forceSimulation.on('tick', () => {
        groups
          .attr('transform', (d, i) => {
            const node = forceSimulation.nodes()[i];
            return `translate(${node.x}, ${node.y})`;
          })

      });

      const processes = generateProcesses()
        .radius(r);
      groups.call(processes);
    });
  }

  return repelGroups;
};
