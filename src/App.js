import React, { useEffect }  from 'react';
import logo from './logo.svg';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

function App() {
  useEffect( () => {
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
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
