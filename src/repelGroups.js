import * as d3 from 'd3';
import generateProcesses from './processes';
import generateForceSimulation from './forceSimulation';

export default function generateRepelGroups() {
  let height = 800;
  let width = 800;
  let fontSize = 26;
  let strokeWidth = 1;
  let forceSimulations = {};
  const processes = {};

  function repelGroups(selection) {
    selection.each(function(data) {
      const svg = d3.select(this);
      const groupData = data.groups;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(height, width) / (Math.ceil(Math.sqrt(groupData.length)) * 2);
      const circleRadius = Math.max(r - strokeWidth - fontSize, 1);

      svg.attr('height', height)
        .attr('width', width)
        .call(d3.zoom().on("zoom", function () {
           svg.attr("transform", d3.event.transform)
        }))
        .append("g")

      let groups = svg.selectAll('g.repel-group')
        .data(groupData, d => d.name);

      if (!processes[data.name]) {
        processes[data.name] = generateProcesses();
      }

      if (!forceSimulations[data.name] || groups.enter().size() > 0 || groups.exit().size() > 0) {
        forceSimulations[data.name] = generateForceSimulation({
          n: groupData.length,
          cx,
          cy,
          itemRadius: r,
          boundingHeight: height,
          boundingWidth: width,
        });

        forceSimulations[data.name].on('tick', () => {
          groups
            .attr('transform', (d, i) => {
              const node = forceSimulations[data.name].nodes()[i];
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

      groups.selectAll('circle')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'})
        .attr('fill', (d) => (d.highlight && d.highlight !== "None") ? d.highlight : "transparent");

      groups.selectAll('text')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'});

      processes[data.name].radius(circleRadius);
      groups.call(processes[data.name]);
    });
  }

  return repelGroups;
};
