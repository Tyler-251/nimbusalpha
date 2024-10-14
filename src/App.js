import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainCalendar from './components/MainCalendar.js'
import Header from './components/Header.js'

Amplify.configure(awsconfig); 

function App() {

  return (

    <Router>
      <Header/>
      <Routes>
        <Route index element={<MainCalendar/>}/>
        
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
