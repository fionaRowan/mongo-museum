import * as d3 from 'd3';
import generateForceSimulation from './forceSimulation';
import circleRadii from './circlePacking';

export default function generateServices() {
  let parentRadius = 10;
  let strokeWidth = 1;
  let fontSize = 10;
  let forceSimulations = [];
  let childService = [];

  function services(selection) {
    selection.each(function(data, datai) {
      const parent = d3.select(this);
      const className = `service-of-${data.name}`;
      const numServices = data.services && data.services.length;
      const serviceRadius = circleRadii[numServices] * parentRadius;
      const circleRadius = Math.max(serviceRadius - strokeWidth - fontSize, 1);

      if (!numServices) {
        return;
      }

      if (!childService[datai]) {
        childService[datai] = generateServices();
      }

      let serviceGroups = parent.selectAll(`g.${className}`)
        .data(data.services, d => d.name);

      if (!forceSimulations[datai] || serviceGroups.enter().size() > 0 || serviceGroups.exit().size() > 0) {
        forceSimulations[datai] = generateForceSimulation({
          n: numServices,
          cx: 0,
          cy: 0,
          itemRadius: serviceRadius,
          boundingRadius: parentRadius,
        });

        forceSimulations[datai].on('tick', () => {
          serviceGroups
            .attr('transform', (d, i) => {
              const node = forceSimulations[datai].nodes()[i];
              if (!node) return;
              return `translate(${node.x}, ${node.y})`;
            })
        });
      }


      serviceGroups.exit().remove();

      const enterServiceGroups = serviceGroups.enter()
        .append('g')
        .attr('class', className)
        .on('mouseover', () => { d3.select(this).style("cursor", "pointer"); })
        .on('mouseout', () => { d3.select(this).style("cursor", "default"); })
        .on('click', (d) => {
          window.open(d.github, "_blank");
          d3.event.stopPropagation();
        });

      enterServiceGroups.append('circle')
        .attr('r', circleRadius)
        .attr('stroke', 'white')
        .attr('fill', 'transparent')
        .attr('stroke-width', strokeWidth)

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
        .attr('fill', (d) => (d.highlight && d.highlight !== "None") ? d.highlight : "transparent");

      serviceGroups.selectAll('text')
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'});

      childService[datai].radius(circleRadius);
      serviceGroups.call(childService[datai]);
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
