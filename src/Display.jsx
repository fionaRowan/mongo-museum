import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

const Display = (props) => {
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
          if (props.groups) {
            const repelGroups = generateRepelGroups();
            d3.select(container.current).data([props.groups[0]]).call(repelGroups);
          }
        }
    }, [props.groups])

    return (
        <svg
            ref={container}
        />
    )
}

export default Display
