import * as d3 from 'd3';
import generateForceSimulation from './forceSimulation';
import circleRadii from './circlePacking';

export default function generateServices() {
  let parentRadius = 10;
  function services(selection) {
    selection.each(function(data) {
      const parent = d3.select(this);
      const className = `service-of-${data.name}`;
      const numServices = data.services && data.services.length;
      const serviceRadius = circleRadii[numServices] * parentRadius;

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
        .attr('r', serviceRadius)
        .attr('stroke', 'white')
        .attr('fill', 'none')
        .attr('stroke-width', 1);

      serviceGroups = serviceGroups.merge(enterServiceGroups);

      serviceGroups.selectAll('circle')
        .attr('fill', (d) => {return d.highlight ? "yellow" : "none"})
        .attr('visibility', (d) => {return d.show ? 'visible' : 'hidden'})

      forceSimulation.on('tick', () => {
        serviceGroups
          .attr('transform', (d, i) => {
            const node = forceSimulation.nodes()[i];
            return `translate(${node.x}, ${node.y})`;
          })
      });


      const childService = generateServices()
        .radius(serviceRadius);
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
