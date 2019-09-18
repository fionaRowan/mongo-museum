import * as d3 from 'd3';
import generateProcesses from './processes';
import generateForceSimulation from './forceSimulation';

export default function generateRepelGroups() {
  let height = 800;
  let width = 800;
  let fontSize = 26;
  let strokeWidth = 1;
  let forceSimulation;
  const processes = generateProcesses();

  function repelGroups(selection) {
    selection.each(function(data) {
      const svg = d3.select(this);
      const groupData = data.groups;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(height, width) / (Math.ceil(Math.sqrt(groupData.length)) * 2);
      const circleRadius = Math.max(r - strokeWidth - fontSize, 1);

      svg.attr('height', height)
        .attr('width', width);

      let groups = svg.selectAll('g.repel-group')
        .data(groupData, d => d.name);

      if (!forceSimulation || groups.enter().size() > 0 || groups.exit().size() > 0) {
        forceSimulation = generateForceSimulation({
          n: groupData.length,
          cx,
          cy,
          itemRadius: r,
          boundingHeight: height,
          boundingWidth: width,
        });

        forceSimulation.on('tick', () => {
          groups
            .attr('transform', (d, i) => {
              const node = forceSimulation.nodes()[i];
              return `translate(${node.x}, ${node.y})`;
            })
        });
      }

      groups.exit()
        .remove();

      let groupsEnter = groups.enter()
        .append('g')
        .attr('class', 'repel-group');

      groupsEnter
        .append('circle')
        .attr('r', circleRadius)
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', 'grey');

      groupsEnter
        .append('text')
        .text(d => d.label || d.name)
        .attr('fill', 'grey')
        .attr('font-size', fontSize)
        .attr('text-anchor', 'middle')
        .attr('y', -(r - fontSize));

      groups = groupsEnter
        .merge(groups);


      processes.radius(circleRadius);
      groups.call(processes);
    });
  }

  return repelGroups;
};
