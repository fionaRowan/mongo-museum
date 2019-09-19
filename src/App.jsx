import React, { useEffect, useState }  from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import Button from '@leafygreen-ui/button'
import Display from './Display';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

const repelGroups = generateRepelGroups();

function App() {
  const [data, setData] = useState(0);
  const [stepNumber, setStepNumber] = useState(-1);
  const [childRef, setChildRef] = useState(null);
  useEffect(() => { // initialize stitch client
    const stitchClient = Stitch.initializeDefaultAppClient('mongomuseum-mbuqp');
    console.log("logging in anonymously");
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`logged in anonymously as user ${user.id}`)
    }, err => {
      console.log(err);
    });
    const mongoClient = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
    const db = mongoClient.db('sharding');
    const coll = db.collection('stories');
    //coll.find({_id: "Full-text search replication"}, {limit: 10})
    coll.find({_id: "Life of an Insert"}, {limit: 10})
    .toArray()
    .then(results => {
      setData(results[0]);
    });
  }, []);

  useEffect(() => {
    if (childRef && childRef.current && data) {
      d3.select(childRef.current).data([data]).call(repelGroups);
    }
  }, [childRef, data])

  return (
    <div className="App">
      <header className="App-header">
        <div style={{height:"100%", width:"100%"}}>
            <div style={{display:"inline-block", width:"60%"}}>
                <p>{data && stepNumber >= 0 ? data._id : ""}</p>
                <div>
                    <Display setChildRef={setChildRef} data={data} />
                </div>
            </div>

            <div style={{display:"inline-block", width:"20%", padding:10}}>
                <div style={{"white-space":"pre-wrap"}}>{data && stepNumber >= 0 ? (data.steps[stepNumber].description + "\n\n\n\n\n\n\n\n\n\n") : getStoryList()}</div>

                <Button onClick={() => {
                  if (!data || stepNumber >= data.steps.length - 1) {
                    return;
                  }
                  setStepNumber(stepNumber+1)
                  const newData = swapNode(data, data.steps[stepNumber+1]);
                  console.log(newData);
                  setData(newData);
                  if (childRef.current) {
                    d3.select(childRef.current).data([newData]).call(repelGroups);
                  }
                }} disabled={data && stepNumber === data.steps.length - 1}>Next</Button>
            </div>
        </div>

      </header>
    </div>
  );
}

function getStoryList() {
    return "Choose a story:\n\nLife of an Insert\n\nAdding a Shard\n\nRemoving a Shard\n\nManual Migration\n\nMigration through Auto-Balancing\n\nDropping a Collection\n\n\n\n";
}

function swapNode(tree, step) {
  for (let deltaIdx in step.deltas) {
    let delta = step.deltas[deltaIdx];
    for (let groupIdx in tree.groups) {
      let group = tree.groups[groupIdx];
      if (group.name === delta.name) {
        Object.assign(group, delta);

        // Skip iterating the rest of the elements because we already found the
        // element with the name for this delta.
        continue;
      }
      if (group.processes) {
        for (let processIdx in group.processes) {
          let process = group.processes[processIdx];
          if (process.name === delta.name) {
            Object.assign(process, delta);

            // Skip iterating the rest of the elements because we already found
            // the element with the name for this delta.
            continue;
          }
          swapNodeRecursiveForServices(process.services, delta);
        }
      }
    }
  }
  return tree;
}

function swapNodeRecursiveForServices(services, delta) {
  console.log("in recursive call");
  console.log(services);
  if (services) {
    for (let serviceIdx in services) {
      let service = services[serviceIdx];
      if (service.name === delta.name) {
        Object.assign(service, delta);
      }
      swapNodeRecursiveForServices(service.services, delta);
    }
  }
}


export default App;
