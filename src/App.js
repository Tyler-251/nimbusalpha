import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes } from '@aws-amplify/auth';
import awsconfig from './aws-exports.js';
import { withAuthenticator } from '@aws-amplify/ui-react';
import React, {useState, useEffect} from 'react';
import '@aws-amplify/ui-react/styles.css';
import logo from './logo.svg';
import './App.css';
import EventBox from './EventBox.js';

import { generateClient } from 'aws-amplify/api';
import {createEvent} from './graphql/mutations.js';




Amplify.configure(awsconfig);

function App() {
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserAttributes();
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);


  async function handleSignOut() {
    await signOut();
  }

  async function addEvent() {
    const client = generateClient();

    const result = await client.graphql({
      query: createEvent,
      variables: {
        input: {
          id: 'someId',
          date: '4-4-2004',
          usesTime: true,
          time: "14:00:36"
        }
      }
    });
  }

  const myUser = userInfo;
  console.log(myUser);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome, {myUser.name}!
        </p>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
        <button type='button' onClick={addEvent}>Create Event</button>
        <EventBox title="titlebox" date="yo mama o clock"/>
        <EventBox title="titlebox" date="yo mama o clock"/>
        <EventBox title="titlebox" date="yo mama o clgggggggggock"/>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
