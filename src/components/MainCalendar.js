import React, {useState, useEffect} from 'react';
import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../amplifyconfiguration.json';
import EventBox from './EventBox.js';
import '@aws-amplify/ui-react/styles.css';
import '../styles/MainCalendar.css';

import {InvokeAgentCommand, BedrockAgentRuntimeClient} from '@aws-sdk/client-bedrock-agent-runtime';

import AgentInterface from "./AgentInterface.js"

import * as mutations from '../graphql/mutations.js';
import * as queries from '../graphql/queries.js';

import caledarCore from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

const MODELID = 'amazon.titan-text-lite-v1';

Amplify.configure(awsconfig); 

function MainCalendar() {
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
  }, [eventList]);


  async function handleSignOut() {
    await signOut();
  }


  return (
    <div className='calendar-body'>
      <div style={{display: "flex"}}>
        <h1>
          Welcome, {userInfo.name || "..."}!
        </h1>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
      </div>
        
      <FullCalendar 
        plugins={[dayGrid]}
        initialView='dayGridMonth'
        events={calendarEventList}
        />
      <AgentInterface events={eventList} callback={()=>setReset(!reset)}/>
      <h3>My Events:</h3>
      <div style={{color: "white", display: "flex", backgroundColor: "#333333", padding: "10px", width: "100%", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center"}}>
        {
          eventList.map((event) => {
            return (<EventBox event={event} key={event.id} onDelete={()=>{setReset(!reset);}}/>);
        })}
      </div>
      <div className='ad-div'>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5524320471332797" crossorigin="anonymous"></script>
        {/* Basic Ad */}
        <ins class="adsbygoogle"
            styles={{display:"block"}}
            data-ad-client="ca-pub-5524320471332797"
            data-ad-slot="1727885410"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    </div>
  );
}

export default withAuthenticator(MainCalendar);
