import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

const Display = (props) => {
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
          if (props.data) {
            const repelGroups = generateRepelGroups();
            d3.select(container.current).data([props.data]).call(repelGroups);
          }
        }
    }, [props.data])

    return (
        <svg
            ref={container}
        />
    )
}

export default Display
