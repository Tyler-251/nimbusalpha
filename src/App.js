import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { fetchUserAttributes } from '@aws-amplify/auth';
import awsconfig from './amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainCalendar from './components/MainCalendar.js'
import Header from './components/Header.js'
import AgentInterface from './components/AgentInterface.js';

import * as queries from './graphql/queries.js';
// import * as mutations from './graphql/mutations.js';
// import * as subscriptions from './graphql/subscriptions.js';

Amplify.configure(awsconfig); 

function App() {
  const graphqlClient = generateClient();
  const [eventList, setEventList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [reset, setReset] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      const user = await fetchUserAttributes();
      setUserInfo(user);
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
    async function getEventList() {
      if (!userInfo) return;
      const allEvents = await graphqlClient.graphql({
        query: queries.listDateEvents,
        variables: {
          filter: {
            username: {
              eq: userInfo.sub
            }
          }
        }
      });
      setEventList(allEvents.data.listDateEvents.items);
    }
    getEventList();
  }, [reset, userInfo]);
  
  const handleReset = () => {
    console.log("resetting event list: ", reset);
    setReset(prevReset => !prevReset);
  }

  return (
    <div>
      <Header/>
      <div className="app-content">
        <MainCalendar clientEvents={eventList}/>
        <AgentInterface events={eventList} callback={handleReset}/>
      </div>
    </div>
  
  );
}

export default withAuthenticator(App);
