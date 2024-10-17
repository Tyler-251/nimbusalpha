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

function DateToString(input) {
  let date = input.split('T')[0];
  let time = input.split('T')[1].split('.')[0];
  time = time.slice(0, -1);
  return date + ' ' + time;
}


const MainCalendar = (props) => {
  var client = generateClient(); //API
  
  const [userInfo, setUserInfo] = useState('');
  
  const [eventList, setEventList] = useState([]);
  const [calendarEventList, setCalendarEventList] = useState([]);
  
  const [popUpDiv, setPopUpDiv] = useState(<></>);
  
  const PopUp = (popProps) => {
    const id = popProps.event.id;
    let listedEvent = eventList.find((event) => event.id === id);

    const description = listedEvent.desc;
    let descDiv = <></>;
    if (description) {
      descDiv = <textarea readOnly="true">{description}</textarea>;
    }

    const startDateString = DateToString(listedEvent.startDateTime);
    const endDateString = DateToString(listedEvent.endDateTime);

    const leftStyle = {
      "transform": "translate(0, 0)",
    }

    return (
      <div className="popup" style={leftStyle}>
        <button onClick={()=>setPopUpDiv(<></>)}></button>
        <h1>{listedEvent.name}</h1>
        <div className='dates'>
          <p>{startDateString}</p>
          <p> to </p>
          <p>{endDateString}</p>
        </div>
        {descDiv}
      </div>
    );
  }

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
          key: event.id,
          color: "orangered"
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
    <>
      <div className='calendar-body'>
        <FullCalendar 
          plugins={[dayGrid, timeGridPlugin]}
          initialView='dayGridMonth'
          events={calendarEventList}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          eventClick={(info) => {
            console.log(info);
            setPopUpDiv(<PopUp event={info.event}/>);
          }}
          />
      </div>
      {popUpDiv}  
    </>
  );
}

export default MainCalendar;
