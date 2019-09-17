import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'

export function Display() {
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
            const svg = d3.select(container.current);
            const update = svg.append("g").selectAll("text").data("hello world");
            update.enter()
                .append('text')
                .attr('x', (d, i) => i * 25)
                .attr('y', 40)
                .style('font-size', 24)
                .text((d) => d);

            update.text((d: number) => d);
        }
    }, [])

    return (
        <svg
            width={400}
            height={200}
            ref={container}
        />
    )
}

export default Display