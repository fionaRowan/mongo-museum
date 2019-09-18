import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

const Display = (props) => {

    if (props.store) {
      console.log(props.store.getState());
    }
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
          const data = {
            groups: [
              {
                name: 'mongos',
                processes: [
                  {
                    name: 'mongos1',
                    show: true,
                    highlight: false,
                    services: [
                      {
                        name: 'ServiceEntryPointMongos',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/service_entry_point_mongos.cpp#L64",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'ClusterWriteCmd',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/commands/cluster_write_cmd.cpp#L511",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'ClusterWriter',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/write_ops/cluster_write.cpp#L66",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'BatchWriteExec',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/write_ops/batch_write_exec.cpp#L101",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'ChunkManagerTargeter',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/write_ops/chunk_manager_targeter.h#L79-L93",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'CatalogCache',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/catalog_cache.h#L157",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'AsyncRequestsSender',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/async_requests_sender.h",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'ShardRegistry',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/s/client/shard_registry.h",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'RemoteCommandTargeter',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/client/remote_command_targeter.h",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'ReplicaSetMonitor',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/client/replica_set_monitor.h",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'ThreadPoolTaskExecutor',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/executor/thread_pool_task_executor.h",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'NetworkInterfaceTL',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/executor/network_interface_tl.h",
                        show: true,
                        highlight: false,
                      },
                    ]
                  }
                ]
              },
              {
                name: 'shard',
                processes: [
                  {
                    name: 'shard.primary',
                    show: true,
                    highlight: false,
                    services: [
                       {
                        name: 'ServiceEntryPointCommon',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/db/service_entry_point_common.cpp#L1229",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'CmdInsert',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/db/commands/write_commands/write_commands.cpp#L300",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'Collection',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/db/catalog/collection_impl.cpp#L377",
                        show: true,
                        highlight: false,
                      },
                      {
                        name: 'RecordStore',
                        github: "https://github.com/mongodb/mongo/blob/r4.2.0/src/mongo/db/catalog/collection_impl.cpp#L534",
                        show: true,
                        highlight: false,
                      },
                    ],
                  },
                  {
                    name: 'shard.secondary1',
                    show: true,
                    highlight: false,
                  },
                  {
                    name: 'shard.secondary2',
                    show: true,
                    highlight: false,
                  }
                ]
              },
              {
                name: 'config',
                processes: [
                  {
                    name: 'config.primary',
                    show: true,
                    highlight: false,
                  },
                  {
                    name: 'config.secondary1',
                    show: true,
                    highlight: false,
                  },
                  {
                    name: 'config.secondary2',
                    show: true,
                    highlight: false,
                  }
               ],
              }
              ]
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
