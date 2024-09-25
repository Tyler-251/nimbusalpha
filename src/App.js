import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut } from '@aws-amplify/auth';
import awsconfig from './aws-exports.js';
import { withAuthenticator } from '@aws-amplify/ui-react';
import React, {useState, useEffect} from 'react';
import '@aws-amplify/ui-react/styles.css';
import logo from './logo.svg';
import './App.css';

Amplify.configure(awsconfig);

function App() {
  const [userInfo, setUserInfo] = useState({ username: '', userId: '', signInDetails: {} });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
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

  const {myUser} = userInfo;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. {}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
