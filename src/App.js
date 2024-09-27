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
  }, []);

  useEffect(() => {
    async function getEventList() {
      const allEvents = await client.graphql({
        query: queries.listDateEvents,
        variables: {
          filter: {
            username: {
              eq: userInfo.sub
            }
          }
        }
      });
      // const {data: allEvents, errors} = await client.models.DateEvent.list();
      console.log(allEvents);
      setEventList(allEvents.data.listDateEvents.items);
    }
    getEventList();
  }, [userInfo]);

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();

    if (eventName == '' || eventDesc == '' || eventDate == '') {
      return null;
    }
    
    const dateEventDetails = {
      name: eventName,
      desc: eventDesc,
      startDate: eventDate,
      endDate: eventDate,
      username: userInfo.sub
    }
    
    const newEvent = await client.graphql({
      query: mutations.createDateEvent,
      variables: {input: dateEventDetails}
    });

    console.log(newEvent);
    let tempList = eventList;
    tempList.push(newEvent.data.createDateEvent);
    setEventList(tempList);

    setEventName('');
    setEventDesc('');
    setEventDate('');
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome, {userInfo.name}!
        </p>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
        <div style={{display: "flex"}}>

          <form onSubmit={handleEventFormSubmit} style={{padding: "20px", margin: "20px", backgroundColor: "darkblue"}}>
            <h2>Create Event:</h2>
            <input type="text" name='name' id='name' placeholder='Event Name' value={eventName} onChange={e => setEventName(e.target.value)}/><br/>
            <input type="text" name='desc' id='desc' placeholder='Event Description' value={eventDesc} onChange={e => setEventDesc(e.target.value)}/><br/>
            <input type="date" name='date' id='date' value={eventDate} onChange={e => setEventDate(e.target.value)}/><br/>
            <button type='submit'>Submit Event</button>
          </form>

          <div style={{padding: "20px", margin: "20px", backgroundColor: "darkred"}}>
            <h2>Current Event Details:</h2>
            <p>{eventName}<br/>{eventDesc}<br/>{eventDate}</p>
          </div>

        </div>
        <h3>My Events:</h3>
        <ul style={{display: "flex"}}>
          {
            eventList.map((event) => {
              return (<EventBox title={event.name} desc={event.desc} date={event.startDate} id={event.id}/>);
          })}
        </ul>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
