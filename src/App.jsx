import React, { useEffect, useState }  from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import { createStore } from 'redux';
import Display from './Display';
import MongoMuseum from './reducers/reducers';

function App() {
  const [store, setStore] = useState(0);
  useEffect(() => { // initialize stitch client
    const stitchClient = Stitch.initializeDefaultAppClient('mongomuseum-mbuqp');
    console.log("logging in anonymously");
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`logged in anonymously as user ${user.id}`)
    }, err => {
      console.log(err);
    });
    const mongoClient = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
    const db = mongoClient.db('fts');
    const coll = db.collection('stories')
    coll.find({}, {limit: 10})
    .toArray()
    .then(results => setStore(createStore(MongoMuseum, results)));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Night at the Cluster Museum
        </p>
        <Display store={store}/>
      </header>
    </div>
  );
}

export default App;
