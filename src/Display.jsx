import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

const Display = (props) => {

    const [groups, setGroups] = useState(0);
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
          if (props.store) {
            console.log(props.store.getState());
            setGroups(props.store.getState());
          }
          if (groups) {
            const repelGroups = generateRepelGroups();
            d3.select(container.current).data([groups[0]]).call(repelGroups);
          }
        }
    }, [groups, props.store])

    return (
        <svg
            ref={container}
        />
    )
}

export default Display
