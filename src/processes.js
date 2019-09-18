import * as d3 from 'd3';
import generateServices from './services';
import circleRadii from './circlePacking';
import generateForceSimulation from './forceSimulation';

export default function generateProcesses() {
  let parentRadius = 50;
  let fontSize = 18;
  let strokeWidth = 1;

  function processes(selection) {
    selection.each(function(data) {
      const group = d3.select(this);
      const numProcesses = data.processes.length;
      const processRadius = circleRadii[numProcesses] * parentRadius;
      const circleRadius = processRadius - strokeWidth - fontSize;
      const forceSimulation = generateForceSimulation({
        n: numProcesses,
        cx: 0,
        cy: 0,
        itemRadius: processRadius,
        boundingRadius: parentRadius,
      });

      let processGroups = group.selectAll('g.process')
        .data(data.processes);

      processGroups.exit().remove();

      const enterProcessGroups = processGroups.enter()
        .append('g')
        .attr('class', 'process');

      enterProcessGroups.append('circle')
        .attr('r', circleRadius)
        .attr('stroke', 'lightgrey')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('stroke-width', strokeWidth);

      enterProcessGroups
        .append('text')
        .text(d => d.name)
        .attr('fill', 'lightgrey')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', -(processRadius - fontSize));

      processGroups = processGroups.merge(enterProcessGroups)
      processGroups.selectAll('circle')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'})
        .attr('fill', (d) => {return d.highlight ? 'green' : 'none'});

      processGroups.selectAll('text')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'});

      forceSimulation.on('tick', () => {
        processGroups
          .attr('transform', (d, i) => {
            const node = forceSimulation.nodes()[i];
            return `translate(${node.x}, ${node.y})`;
          })
      });

      const services = generateServices()
        .radius(circleRadius);
      processGroups.call(services);
    });

    return processes;
  }

  processes.radius = function(newRadius) {
    if (newRadius === undefined) {
      return parentRadius;
    }

    parentRadius = newRadius;
    return processes;
  }

  return processes;
}
