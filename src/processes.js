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


      enterProcessGroups.append('circle')
        .attr('r', 50)
        .attr('stroke', 'white')
        .attr('cx', 50)
        .attr('cy', 50)
        .attr('fill', (d) => {return d.highlight ? 'green' : 'none'})
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'})
        .attr('stroke-width', 1);

      processGroups = processGroups.merge(enterProcessGroups);
      const services = generateServices();
      processGroups.call(services);
    });
    return processes;
  }

  return processes;
}
