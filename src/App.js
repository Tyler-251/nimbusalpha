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

  const handlePromptSumbit = async (e) => {
    e.preventDefault();
    if (prompt == '') return;

    const authSession = await fetchAuthSession();

    const modelClient = new BedrockRuntimeClient({region: "us-east-1", credentials: authSession.credentials});
    const payload = {
      inputText: prompt,
      textGenerationConfig: {
        maxTokenCount: 4096,
        stopSequences: [],
        temperature: 0,
        topP: 1,
      }
    }

    console.log("query pending...");
    const apiResponse = await modelClient.send(
      new InvokeModelCommand({
        contentType: 'application/json',
        body: JSON.stringify(payload),
        modelId: MODELID
      })
    );
    console.log("recieved payload, decoding...");

    const apiOutput = new TextDecoder().decode(apiResponse.body);
    const jsonOutput = JSON.parse(apiOutput);
    console.log(jsonOutput);

    setResponse(jsonOutput.results[0].outputText);
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
        
        <div>
          <h3>Prompt Area</h3>
          <form onSubmit={handlePromptSumbit}>
            <input type='text' value={prompt} onChange={e => setPrompt(e.target.value)}/>
            <button type='submit'>Submit Prompt</button>
          </form>
          <p>{response}</p>
        </div>
        <div style={{height: "100px"}}/>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
