import React, {useState, useEffect} from 'react';
import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../amplifyconfiguration.json';
import EventBox from './EventBox.js';
import ParseDate from '../ParseDate.js';
import '@aws-amplify/ui-react/styles.css';
import '../styles/MainCalendar.css';

// import caledarCore from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

Amplify.configure(awsconfig); 

const MainCalendar = (props) => {
  var client = generateClient(); //API
  
  const [userInfo, setUserInfo] = useState('');

  const [eventList, setEventList] = useState([]);
  const [calendarEventList, setCalendarEventList] = useState([]);
  const [calendarMode, setCalendarMode] = useState('dayGridMonth');

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
    setEventList(props.clientEvents);
  }, [props.clientEvents]);

  useEffect(() => {
    let events = [];
    eventList.map((event) => {
      try {
        let start = ParseDate(event.startDateTime);
        let end = ParseDate(event.endDateTime);
        let allDay = start.getHours() === 0 && start.getMinutes() === 0 && end.getHours() === 23 && end.getMinutes() === 59;
        events.push({
          start: start,
          end: end,
          title: event.name,
          allDay: allDay,
          id: event.id,
          key: event.id
        });
      } catch (error) {
        console.error('Error parsing event:', error);
      }
    });
    setCalendarEventList(events);
    //console.log(events);
  }, [eventList]);


  async function handleSignOut() {
    await signOut();
  }


  return (
    <div className='calendar-body'>
      <FullCalendar 
        plugins={[dayGrid, timeGridPlugin]}
        initialView={calendarMode}
        events={calendarEventList}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        />
      {/* <h3>My Events:</h3>
      <div style={{color: "white", display: "flex", backgroundColor: "#333333", padding: "10px", width: "100%", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center"}}>
        {
          eventList.map((event) => {
            return (<EventBox event={event} key={event.id} onDelete={()=>{setReset(!reset);}}/>);
        })}
      </div> */}
    </div>
  );
}

export default withAuthenticator(MainCalendar);
