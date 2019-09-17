import * as d3 from 'd3';

export default function generateServices() {
  function services(selection) {
    selection.each(function(data) {
      const parent = d3.select(this);
      const className = `service-of-${data.name}`;

      if (!data.services || data.services.length === 0) {
        return;
      }

      let serviceGroups = parent.selectAll(`g.${className}`)
        .data(data.services);

      serviceGroups.exit().remove();

      const enterServiceGroups = serviceGroups.enter()
        .append('g')
        .attr('class', className);

      enterServiceGroups.append('circle')
        .attr('r', 25)
        .attr('stroke', 'black')
        .attr('cx', (d, i) => 26 + 49 * i)
        .attr('cy', (d, i) => 26 + 49 * i)
        .attr('fill', 'none')
        .attr('stroke-width', 1);

      serviceGroups = serviceGroups.merge(enterServiceGroups);

      const childService = generateServices();
      serviceGroups.call(services);
    });
  }

  return services;
}
