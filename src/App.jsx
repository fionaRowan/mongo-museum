import React, { useEffect, useState }  from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import Display from './Display';

function App() {
  const [groups, setGroups] = useState(0);
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
    .then(results => setGroups(results));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Night at the Cluster Museum
        </p>
        <Display groups={groups} />
        <button onClick={() => swapNode(groups, [])}>Next</button>
      </header>
    </div>
  );
}

function swapNode(tree, delta) {
  tree.groups.map((group) => {
      if (group.name === delta.name) {
          Object.assign(group, delta);
          return tree;
      }
      group.processes.map((process) => {
          if (process.name === delta.name) {
              Object.assign(process, delta);
              return tree;
          }
          process.services.map((service) => {
              if (service.name === delta.name) {
                  Object.assign(service, delta);
                  return tree;
              }
              return tree;
          })
          return tree;
      });
      return tree;
  });
}

export default App;
