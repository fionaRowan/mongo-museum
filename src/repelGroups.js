import * as d3 from 'd3';
import generateProcesses from './processes';

export default function generateRepelGroups() {
  let height = 500;
  let width = 500;

  function repelGroups(selection) {
    selection.each(function(data) {
      const svg = d3.select(this);

      svg.attr('height', height)
        .attr('width', width);

      let groups = svg.selectAll('g.repel-group')
        .data(data.groups);

      groups.exit()
        .remove();

      groups = groups.enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${1 + 105 * i}, 0)`)
        .attr('class', 'repel-group')
        .merge(groups);


      const processes = generateProcesses()
      groups.call(processes);
    });
  }

  return repelGroups;
};
