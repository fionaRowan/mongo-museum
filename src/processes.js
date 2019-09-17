import * as d3 from 'd3';
import generateServices from './services';

export default function generateProcesses() {
  function processes(selection) {
    selection.each(function(data) {
      const group = d3.select(this);

      let processGroups = group.selectAll('g.process')
        .data(data.processes);

      processGroups.exit().remove();

      const enterProcessGroups = processGroups.enter()
        .append('g')
        .attr('class', 'process');

      enterProcessGroups.append('rect')
        .attr('height', 100)
        .attr('width', 100)
        .attr('stroke', 'black')
        .attr('x', 1)
        .attr('y', 1)
        .attr('fill', 'none')
        .attr('stroke-width', 1);

      processGroups = processGroups.merge(enterProcessGroups);
      const services = generateServices();
      processGroups.call(services);
    });
    return processes;
  }

  return processes;
}
