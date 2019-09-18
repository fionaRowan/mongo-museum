import * as d3 from 'd3';
import generateForceSimulation from './forceSimulation';
import circleRadii from './circlePacking';

export default function generateServices() {
  let parentRadius = 10;
  let strokeWidth = 1;
  let fontSize = 10;
  function services(selection) {
    selection.each(function(data) {
      const parent = d3.select(this);
      const className = `service-of-${data.name}`;
      const numServices = data.services && data.services.length;
      const serviceRadius = circleRadii[numServices] * parentRadius;
      const circleRadius = Math.max(serviceRadius - strokeWidth - fontSize, 1);

      if (!numServices) {
        return;
      }

      const forceSimulation = generateForceSimulation({
        n: numServices,
        cx: 0,
        cy: 0,
        itemRadius: serviceRadius,
        boundingRadius: parentRadius,
      });

      let serviceGroups = parent.selectAll(`g.${className}`)
        .data(data.services);

      serviceGroups.exit().remove();

      const enterServiceGroups = serviceGroups.enter()
        .append('g')
        .attr('class', className);

      enterServiceGroups.append('circle')
        .attr('r', circleRadius)
        .attr('stroke', 'white')
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .on('mouseover', () => { d3.select(this).style("cursor", "pointer"); })
        .on('mouseout', () => { d3.select(this).style("cursor", "default"); })
        .on('click', (d) => {
          window.open(d.github, "_blank");
        })

      enterServiceGroups
        .append('text')
        .text(d => d.label || d.name)
        .attr('fill', 'lightgrey')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', fontSize - serviceRadius);

      serviceGroups = serviceGroups.merge(enterServiceGroups);

      serviceGroups.selectAll('circle')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'})
        .attr('fill', (d) => d.highlight || 'none');

      serviceGroups.selectAll('text')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'});

      forceSimulation.on('tick', () => {
        serviceGroups
          .attr('transform', (d, i) => {
            const node = forceSimulation.nodes()[i];
            return `translate(${node.x}, ${node.y})`;
          })
      });


      const childService = generateServices()
        .radius(circleRadius);
      serviceGroups.call(childService);
    });
  }

  services.radius = function(newRadius) {
    if (newRadius === undefined) {
      return parentRadius;
    }

    parentRadius = newRadius;
    return services;
  }


  return services;
}
