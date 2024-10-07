import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainCalendar from './components/MainCalendar.js'
import AgentRuntime from './components/AgentRuntime.js';

Amplify.configure(awsconfig); 

function App() {

  return (
    <Router>
      <Routes>
        <Route index element={<MainCalendar/>}/>
        <Route path="agent" element={<AgentRuntime/>}/>
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
