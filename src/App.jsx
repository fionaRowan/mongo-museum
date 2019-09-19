import React, { useEffect, useState }  from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import Button from '@leafygreen-ui/button'
import Display from './Display';
import * as d3 from 'd3'
import generateRepelGroups from './repelGroups'

const repelGroups = generateRepelGroups();
let mongoClient;
const link = {cursor: "pointer"}

function App() {
  const [data, setData] = useState(0);
  const [stepNumber, setStepNumber] = useState(-1);
  const [childRef, setChildRef] = useState(null);
  const [currStory, setCurrStory] = useState("");
  useEffect(() => { // initialize stitch client
    const stitchClient = Stitch.initializeDefaultAppClient('mongomuseum-mbuqp');
    console.log("logging in anonymously");
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`logged in anonymously as user ${user.id}`)
    }, err => {
      console.log(err);
    });
    mongoClient = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
    setCurrStory("default");
    const db = mongoClient.db('sharding');
    const coll = db.collection('stories');
    //coll.find({_id: "Full-text search replication"}, {limit: 10})
  }, []);

  let advance = () => {
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
  }

  useEffect(() => {
    if (data && stepNumber < 0) {
      advance()
    }
  }, [data, stepNumber])

  useEffect(() => {
    if (childRef && childRef.current && data) {
      d3.select(childRef.current).data([data]).call(repelGroups);
    }
  }, [childRef, data])

  return (
    <div className="App">
      <header className="App-header">
        <div style={{height:"100%", width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div style={{display:"inline-block", width:"60%"}}>
                <p>{data && stepNumber >= 0 ? data._id : ""}</p>
                <div>
                    <Display setChildRef={setChildRef} data={data} />
                </div>
            </div>

            <div style={{display:"inline-block", width:"20%", padding:10}}>
              { currStory === "" || currStory === "default"? (
              <div id="list" style={{textAlign:"top"}}>
              <br/><br/>
                <h2>Choose a story:</h2>
                <br/><br/>
                <a style={link} onClick={() => {
                  setCurrStory("lifeOfAnInsert");
                  const db = mongoClient.db('sharding');
                  const coll = db.collection('stories');
                  //coll.find({_id: "Full-text search replication"}, {limit: 10})
                  coll.find({_id: "Life of an Insert"}, {limit: 10})
                  .toArray()
                  .then(results => {
                    setData(results[0]);
                  });
                }}>Life of an Insert</a>
                <br/><br/>
                <a style={link}>Adding a Shard</a>
                <br/><br/>
                <a style={link}>Removing a Shard</a>
                <br/><br/>
                <a style={link}>Manual Migration</a>
                <br/><br/>
                <a style={link}>Migration through Auto-Balancing</a>
                <br/><br/>
                <a style={link}>Dropping a Collection</a>
                <br/><br/>
                <a style={link} onClick={() => {
                  setCurrStory("lifeOfAnInsert");
                  const db = mongoClient.db('sharding');
                  const coll = db.collection('stories');
                  coll.find({_id: "Full-text search replication"}, {limit: 10})
                  .toArray()
                  .then(results => {
                    setData(results[0]);
                  });
                }} >Full-text Search Replication</a>
              </div>
              )
              : (
                <div style={{"whiteSpace":"pre-wrap"}}>{
                  (data && data.steps && data.steps[stepNumber]) ? data.steps[stepNumber].description : ""
                }</div>
              )
              }
              <br/>
                <Button onClick={advance} disabled={(!data || stepNumber === data.steps.length - 1)}>Next</Button>
            </div>
        </div>

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
