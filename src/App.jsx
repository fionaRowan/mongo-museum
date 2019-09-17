import React, { useEffect }  from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import { createStore } from 'redux';
import Display from './Display';

function App() {
  let store;
  useEffect(() => { // initialize stitch client
    const stitchClient = Stitch.initializeDefaultAppClient('mongomuseum-mbuqp');
    console.log("logging in anonymously");
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`logged in anonymously as user ${user.id}`)
    }, err => {
      console.log(err);
    });
    const mongoClient = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
    const db = mongoClient.db('foo');
    const coll = db.collection('bar')
    coll.find({}, {limit: 10})
      .toArray()
      .then(results => console.log('Results:', results));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Night at the Cluster Museum
        </p>
        <Display/>
      </header>
    </div>
  );
}

export default App;
