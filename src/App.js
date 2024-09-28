import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes, getCurrentUser } from '@aws-amplify/auth';
import awsconfig from './amplifyconfiguration.json';
import { withAuthenticator } from '@aws-amplify/ui-react';
import React, {useState, useEffect} from 'react';
import '@aws-amplify/ui-react/styles.css';
import logo from './logo.svg';
import './App.css';
import EventBox from './EventBox.js';

import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

import caledarCore from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

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

  const [reset, setReset] = useState(true);
  
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
      if (!userInfo) return;
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
      setEventList(allEvents.data.listDateEvents.items);
    }
    getEventList();
  }, [userInfo, reset]);

  useEffect(() => {
    let events = [];
    eventList.map((event) => {
      events.push({
        start: event.startDate,
        end: event.endDate,
        title: event.name,
        allDay: true,
        id: event.id,
        key: event.id
      });
    });
    setCalendarEventList(events);
    console.log("Set Calendar events");
  }, [eventList, reset]);

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();

    if (eventName == '' || eventStartDate == '') {
      return null;
    }
    
    const dateEventDetails = {
      name: eventName,
      desc: eventDesc,
      startDate: eventStartDate,
      endDate: eventEndDate || eventStartDate,
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
    setEventStartDate('');

    setReset(!reset);
  }

  const handleEndDateCheckBox = (e) => {
    var endDateInput = document.getElementById("end-date-input");
    endDateInput.disabled = !e.target.value;
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome, {userInfo.name || "..."}!
        </p>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
          <FullCalendar 
            plugins={[dayGrid]}
            initialView='dayGridMonth'
            events={calendarEventList}
          />
        <div style={{display: "flex"}}>

          <form onSubmit={handleEventFormSubmit} style={{padding: "20px", margin: "20px", backgroundColor: "darkblue"}}>
            <h2>Create Event:</h2>
            <strong>Title:</strong> <input type="text" name='name' id='name' placeholder='Event Name' value={eventName} onChange={e => setEventName(e.target.value)}/><br/>
            <strong>Start Date:</strong> <input type="date" name='date' id='date' value={eventStartDate} onChange={e => setEventStartDate(e.target.value)}/><br/>
            <strong>End Date:</strong> <input type="checkbox" onChange={handleEndDateCheckBox}/><input id="end-date-input" type="date" name='date' value={eventEndDate} onChange={e => setEventEndDate(e.target.value)} disabled/><br/>
            <button type='submit'>Submit Event</button>
          </form>

          <div style={{padding: "20px", margin: "20px", backgroundColor: "darkred"}}>
            <h2>Current Event Details:</h2>
            <p>{eventName}<br/>{eventStartDate} <br/> {eventEndDate}</p>
          </div>
        </div>
        <h3>My Events:</h3>
        <div style={{display: "flex", backgroundColor: "#44ff44", padding: "10px", width: "70%", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center"}}>
          {
            eventList.map((event) => {
              return (<EventBox event={event} key={event.id} onDelete={()=>{setReset(!reset);}}/>);
          })}
        </div>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
