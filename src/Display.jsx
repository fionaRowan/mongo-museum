import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

export function Display() {
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
          const data = {
            groups: [
              {
                name: 'shard1',
                processes: [
                  {
                    name: 'primary',
                  }
                ]
              },
              {
                name: 'config',
                processes: [
                  {
                    name: 'primary',
                  }
                ]
              },
              {
                name: 'mongos1',
                processes: [
                  {
                    name: 'mongos',
                    services: [
                      {
                        name: 'CatalogCache',
                      },
                      {
                        name: 'AsyncRequestsSender'
                      }
                    ]
                  }
                ]
              },
            ],
          };

          const repelGroups = generateRepelGroups();
          d3.select(container.current).data([data]).call(repelGroups);
        }
    }, [])

    return (
        <svg
            ref={container}
        />
    )
}

export default Display
