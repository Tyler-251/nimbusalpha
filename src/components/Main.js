import React, {useState, useEffect} from 'react';
import { Amplify } from 'aws-amplify';
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../amplifyconfiguration.json';
import logo from '../logo.svg';
import EventBox from '../EventBox.js';
import '@aws-amplify/ui-react/styles.css';
import '../App.css';

import {CreateAgentCommand} from '@aws-sdk/client-bedrock-agent';
import {InvokeAgentCommand, BedrockAgentRuntimeClient} from '@aws-sdk/client-bedrock-agent-runtime';
import {InvokeModelCommand, BedrockRuntimeClient} from '@aws-sdk/client-bedrock-runtime';


import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';

import caledarCore from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

const MODELID = 'amazon.titan-text-lite-v1';

Amplify.configure(awsconfig); 

function Main() {
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
    const modelClient = new BedrockAgentRuntimeClient({region: "us-east-1", credentials: authSession.credentials});


    let eventData = JSON.stringify(eventList);
    const toSendPrompt = "Here is a list of events the user already has scheduled: " + eventData + "\n\nHere is the prompt to retrieve the json aligning with the user request: " + prompt;

    const payload = {
      agentId: 'QLNAQZAVCZ',
      agentAliasId: '8AJCSJASX9',
      sessionId: sessionId,
      inputText: toSendPrompt
    }

    const command = new InvokeAgentCommand(payload);
    try {
      let completion = "";
      const response = await modelClient.send(command);
  
      if (response.completion === undefined) {
        throw new Error("Completion is undefined");
      }
  
      for await (let chunkEvent of response.completion) {
        const chunk = chunkEvent.chunk;
        console.log(chunk);
        const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
        completion += decodedResponse;
      }

      let potentialJSON = {};
      let parsed = false;
      
      try {
        potentialJSON = JSON.parse(completion);
        parsed = true;
      } catch (err) {
        console.log(err);
      }

      setResponse(completion);

      if (parsed) {
        console.log(potentialJSON);

        switch (potentialJSON["queryType"]) {
          case "create":
            await AddEvents(potentialJSON);
            break;
          case "modify":
            break;
          case "delete":
            await DeleteEvents(potentialJSON);
            break;
          default:
            break;
        }

        setResponse(completion + ", successfully processed event(s)");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSignOut() {
    await signOut();
  }

  async function AddEvents(input) {
    console.log("Creating event!");

    for (const event of input["events"]) {
      let newEvent = await client.graphql({
        query: mutations.createDateEvent,
        variables: {
          input: {
            name: event["title"],
            startDate: event["startDate"],
            endDate: event["endDate"],
            username: userInfo.sub
          }
        }
      });
      let tempList = eventList;
      tempList.push(newEvent.data.createDateEvent);
      setEventList(tempList);
    }
  }

  async function ModifyEvents(input) {

  }

  async function DeleteEvents(input) {
    console.log("deleting event");
    for (const event of input["events"]) {
      let newEvent = await client.graphql({
        query: mutations.deleteDateEvent,
        variables: {
          input: {
            id: event["id"]
          }
        }
      });
    }
    setReset(!reset);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome, {userInfo.name || "..."}!
        </p>
        <button type='button' onClick={handleSignOut}>Sign Out</button>
        <a href="/agent">agent</a>
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

export default withAuthenticator(Main);
