import React, { useEffect, useState }  from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import Display from './Display';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

function App() {
  const [data, setData] = useState(0);
  const [stepNumber, setStepNumber] = useState(0);
  const [childRef, setChildRef] = useState(null);
  const repelGroups = generateRepelGroups();
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
    coll.find({}, {limit: 10})
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
        <p>
          Night at the Cluster Museum
        </p>
        <Display setChildRef={setChildRef} data={data} />
        <button onClick={() => {
        setStepNumber(stepNumber+1)
        const newData = swapNode(data, data.steps[stepNumber+1]);
        console.log(newData);
        setData(newData);
        if (childRef.current) {
          d3.select(childRef.current).data([newData]).call(repelGroups);
        }
        }}>Next</button>
      </header>
    </div>
  );
}


function swapNode(tree, step) {
  for (let deltaIdx in step.deltas) {
    let delta = step.deltas[deltaIdx];
    for (let groupIdx in tree.groups) {
      let group = tree.groups[groupIdx];
      if (group.name === delta.name) {
        Object.assign(group, delta);
        return tree;
      }
      if (group.processes) {
        for (let processIdx in group.processes) {
          let process = group.processes[processIdx];
          if (process.name === delta.name) {
            Object.assign(process, delta);
            return tree;
          }
          if (process.services) {
            for (let serviceIdx in process.services) {
              let service = process.services[serviceIdx];
              if (service.name === delta.name) {
                Object.assign(service, delta);
                return tree;
              }
            }
          }
        }
      }
    }
  }
  return tree;
}

export default App;
