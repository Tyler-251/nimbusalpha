import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes } from '@aws-amplify/auth';
import awsconfig from './amplifyconfiguration.json';
import { withAuthenticator } from '@aws-amplify/ui-react';
import React, {useState, useEffect} from 'react';
import '@aws-amplify/ui-react/styles.css';
import logo from './logo.svg';
import './App.css';
import EventBox from './EventBox.js';
import DateEventCreateForm from './ui-components/DateEventCreateForm.jsx';

import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';
import { act } from 'react-dom/test-utils';

Amplify.configure(awsconfig); 

function App() {
  var client = generateClient(); //API
  
  const [userInfo, setUserInfo] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventList, setEventList] = useState([]);

  
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

    async function getEventList() {
      const allEvents = await client.graphql({
        query: queries.listDateEvents,
        filter: {
          name: {
            eq: 'test'
          }
        }
      });
      // const {data: allEvents, errors} = await client.models.DateEvent.list();
      console.log(allEvents);
      setEventList(allEvents.data.listDateEvents.items);
    }
    getEventList();
  }, []);
  
  const activeUser = userInfo;
  console.log(activeUser);

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    
    const dateEventDetails = {
      name: eventName,
      desc: eventDesc,
      startDate: eventDate,
      endDate: eventDate,
      username: activeUser.sub
    }
    
    const newEvent = await client.graphql({
      query: mutations.createDateEvent,
      variables: {input: dateEventDetails}
    });

    setEventName('');
    setEventDesc('');
    setEventDate('');

    setEventList(eventList);
    setEventList(eventList.sort((a,b) => a.startDate - b.startDate));
    
  }


  async function handleSignOut() {
    await signOut();
  }

  // async function addEvent() {
  //   const result = await client.graphql({
  //     query: mutations.createEvent,
  //     variables: {
  //       input: {
  //         date: '4-4-2004',
  //         usesTime: true,
  //         time: "14:00:36"
  //       }
  //     }
  //   });
  // }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome, {userInfo.name}!
        </p>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
        <div style={{display: "flex"}}>
          <form onSubmit={handleEventFormSubmit} style={{margin: "20px"}}>
            <h2>Create Event:</h2>
            <input type="text" name='name' id='name' placeholder='Event Name' value={eventName} onChange={e => setEventName(e.target.value)}/><br/>
            <input type="text" name='desc' id='desc' placeholder='Event Description' value={eventDesc} onChange={e => setEventDesc(e.target.value)}/><br/>
            <input type="date" name='date' id='date' value={eventDate} onChange={e => setEventDate(e.target.value)}/><br/>
            <button type='submit'>Submit Event</button>
          </form>
          <div style={{margin: "20px"}}>
            <h2>Current Event Details:</h2>
            <p>{eventName}<br/>{eventDesc}<br/>{eventDate}</p>
          </div>
        </div>
        <h3>My Events:</h3>
        <ul style={{display: "flex"}}>
          {
            eventList.map((event) => {
              return (<EventBox title={event.name} desc={event.desc} date={event.startDate}/>);
          })}
        </ul>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
