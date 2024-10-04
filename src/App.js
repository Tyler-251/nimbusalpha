import React, {useState, useEffect} from 'react';
import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import awsconfig from './amplifyconfiguration.json';
import logo from './logo.svg';
import EventBox from './EventBox.js';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import {CreateAgentCommand} from '@aws-sdk/client-bedrock-agent';
import {InvokeAgentCommand} from '@aws-sdk/client-bedrock-agent-runtime';
import {InvokeModelCommand, BedrockRuntimeClient} from '@aws-sdk/client-bedrock-runtime';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Main from './components/Main.js'
import AgentRuntime from './components/AgentRuntime.js';


import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

import caledarCore from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

const MODELID = 'amazon.titan-text-lite-v1';

Amplify.configure(awsconfig); 

function App() {
  var client = generateClient(); //API
  
  const [userInfo, setUserInfo] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');

  const [eventList, setEventList] = useState([]);
  const [calendarEventList, setCalendarEventList] = useState([]);

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('<Response>');
  const [sessionId, setSessionId] = useState('');

  const [reset, setReset] = useState(true); //used to reset states dependent upon reset (ie calendar events, etc)
  
  useEffect(() => {  // ON MOUNT
    const fetchUser = async () => {
      try {
        const user = await fetchUserAttributes();
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();

    setSessionId(Math.random().toString());
  }, []);


  async function handleSignOut() {
    await signOut();
  }

  return (
    <Router>
      <Routes>
        <Route index element={<Main/>}/>
        <Route path="agent" element={<AgentRuntime/>}/>
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
