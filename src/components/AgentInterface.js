import { withAuthenticator } from "@aws-amplify/ui-react"
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import {InvokeAgentCommand, BedrockAgentRuntimeClient} from '@aws-sdk/client-bedrock-agent-runtime';
import "../styles/AgentInterface.css"
import { useEffect, useState, useRef } from "react";
import loadingImage from "../img/loadingdots.gif"

import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { generateClient } from "aws-amplify/api";

const AGENT_ID = "QLNAQZAVCZ"; // Dont touch
const ALIAS_ID = "RTU9FGSVGP"; // Update this with your alias id

const UserMessageBox = ({text}) => {
    return(
        <div className="userMessageBox" key={text}>
            {text}
        </div>
    );
}

const AgentMessageBox = ({text}) => {
    return(
        <div className="agentMessageBox" key={text}>
            {text}
        </div>
    );
}



const minimizedStyle = {right: "-380px"}
const minimizedButtonStyle = {transform: "translate(-40px, 30px)"}


function AgentInterface(props) {
    const [messageList, setMessageList] = useState([<AgentMessageBox text="Hello, how can I help you today?"/>]);
    const [input, setInput] = useState(""); //chatbox input
    const [client, setClient] = useState(); //agent client
    const [userInfo, setUserInfo] = useState();
    const [chatEnabled, setChatEnabled] = useState(true);
    const [loadingSign, setLoadingSign] = useState(false);
    const [sessionId, setSessionId] = useState();

    const [overrideChatStyle, setOverrideChatStyle] = useState({});
    const [minimized, setMinimized] = useState(false);
    const [minimizedIcon, setMinimizedIcon] = useState(">");
    const [overrideButtonStyle, setOverrideButtonStyle] = useState({});

    const scrollRef = useRef(null); //manage scrolldown on new message
    const chatRef = useRef(null); //manage focus textarea on agent response

//#region useEffect
    useEffect(()=>{
        const generateClient = async () => {
            const authSession = await fetchAuthSession();
            setClient(new BedrockAgentRuntimeClient({region: "us-east-1", credentials: authSession.credentials}));
        }
        const fetchUser = async () => {
            try {
                const user = await fetchUserAttributes();
                setUserInfo(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        generateClient();
        fetchUser();
        setSessionId(Math.random().toString());
    },[]);

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
        chatRef.current?.focus();
        chatRef.current?.setSelectionRange(0,0);
    }, [messageList])

    useEffect(() => {
        if (minimized) {
            setOverrideChatStyle(minimizedStyle);
            setOverrideButtonStyle(minimizedButtonStyle);
            setMinimizedIcon("<");
        } else {
            setOverrideChatStyle({});
            setOverrideButtonStyle({});
            setMinimizedIcon(">");
        }
    }, [minimized])
//#endregion
//#region messages
    function AddAgentMessage(text) {
        let messageObject = {
            "author": "agent",
            "text": text
        }
        setMessageList((prevItems) => [...prevItems, <AgentMessageBox text={text} key={messageList.length}/>]);
    }
    function AddUserMessage(text) {
        let messageObject = {
            "author": "user",
            "text": text
        }
        setMessageList((prevItems) => [...prevItems, <UserMessageBox text={text} key={messageList.length}/>]);
    }
    function AddCreateEventConfirmations(events) {
        for (const event of events) {
            setMessageList((prevItems) => [...prevItems, <CreateConfirmBox event={event} key={messageList.length}/>]);
        }
    }
    function RemoveMessage(indexKey) {
        let newMessageList = messageList.filter((message) => message.key != indexKey);
        setMessageList(newMessageList);
    }
    const CreateConfirmBox = ({event, key}) => {
        const [pendingTitle, setPendingTitle] = useState("");
        const [pendingStartDate, setPendingStartDate] = useState("");
        const [startTime, setStartTime] = useState("");
        const [pendingEndDate, setPendingEndDate] = useState("");
        const [pendingDesc, setPendingDesc] = useState("");
        const [endTime, setEndTime] = useState();
        const [allDay, setAllDay] = useState(false);
        const [usesEndDate, setUsesEndDate] = useState(false);
        const descRef = useRef(null);
        const descButtonRef = useRef(null);
        const startTimeRef = useRef(null);
        const endDateRef = useRef(null);
        const endTimeRef = useRef(null);
        
        useEffect(()=> {
            if (event) {
                let eventStartDate = "";
                let eventStartTime = "";
                let eventEndDate = "";
                let eventEndTime = "";

                if ("title" in event) {
                    setPendingTitle(event["title"]);
                }
                if ("startDateTime" in event) {
                    eventStartDate = event["startDateTime"].split("T")[0];
                    eventStartTime = event["startDateTime"].split("T")[1];
    
                    setPendingStartDate(eventStartDate);
                    setStartTime(eventStartTime);
                }
                if ("endDateTime" in event) {
                    eventEndDate = event["endDateTime"].split("T")[0];
                    eventEndTime = event["endDateTime"].split("T")[1];
    
                    setPendingEndDate(eventEndDate);
                    setEndTime(eventEndTime);
                }
                console.log("start" + startTime);
                console.log(endTime);

                descButtonRef.current.style.display = "block";
                descRef.current.style.display = "none";
                if ("desc" in event) {
                    setPendingDesc(event["desc"]);
                }
                
                if (eventStartDate == eventEndDate) {
                    setUsesEndDate(false);
                } else {
                    setUsesEndDate(true);
                }

                if (eventStartTime == "00:00" && eventEndTime == "23:59") {
                    setAllDay(true);
                } else {
                    setAllDay(false);
                }
            }
        }, []); //initialize state with event data

        useEffect(()=>{
            if (pendingDesc != "") {
                AddDescription();
            }
        }, [pendingDesc]); //auto-add description if it exists

        useEffect(()=>{
            if (allDay) {
                startTimeRef.current.style.display = "none";
                endTimeRef.current.style.display = "none";
            } else {
                startTimeRef.current.style.display = "block";
                endTimeRef.current.style.display = "block";
            }
            if (!usesEndDate) {
                endDateRef.current.disabled = true;
            } else {
                endDateRef.current.disabled = false;
            }
        }, [allDay, usesEndDate]); //toggles display of time inputs

        function AddDescription() {
            descButtonRef.current.style.display = "none";
            descRef.current.style.display = "block";
        }

        function RemoveDescription() {
            descButtonRef.current.style.display = "block";
            descRef.current.style.display = "none";
        }

        async function ConfirmEvent() {
            if (pendingTitle == "" || pendingStartDate == "") return;
            let workingStartDate = pendingStartDate;
            let workingEndDate = pendingEndDate;
            let workingStartTime = startTime;
            let workingEndTime = endTime;

            if (allDay) {
                workingStartTime = "00:00";
                workingEndTime = "23:59";
            }
            if (!usesEndDate) {
                workingEndDate = workingStartDate;
            }

            let newEvent = await graphQLClient.graphql({
                query: mutations.createDateEvent,
                variables: {
                    input: {
                        name: pendingTitle,
                        startDateTime: workingStartDate + "T" + workingStartTime + "Z",
                        endDateTime: workingEndDate + "T" + workingEndTime + "Z",
                        desc: pendingDesc,
                        username: userInfo.sub
                    }
                }
            });
            props.callback();
        }
        function CancelEvent() {
            RemoveMessage(key);
        }
        return(
            <div className="createConfirmBox" key={key}>
                <div className="confirmContent">
                    <h3>Title:</h3>
                    <input type="text" value={pendingTitle} onChange={(e) => setPendingTitle(e.target.value)}/>
                    <h3>Date:</h3>
                    <div className="checks" style={{display: "flex"}}>
                        <p>All Day:</p>
                        <input type="checkbox" checked={allDay} onChange={(e)=> setAllDay(e.target.checked)}/>
                        <p>Multiple Days:</p>
                        <input type="checkbox" checked={usesEndDate} onChange={(e)=> setUsesEndDate(e.target.checked)}/>
                    </div>
                    <div className="startDateTimeDiv">
                        <input className="startDateInput" type="date" value={pendingStartDate} onChange={(e) => setPendingStartDate(e.target.value)}/>
                        <input className="startTimeInput" type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} ref={startTimeRef}/>
                    </div>
                    <div className="endDateTimeDiv">
                        <input className="endDateInput" type="date" value={pendingEndDate} onChange={(e) => setPendingEndDate(e.target.value)} ref={endDateRef}/>
                        <div ref={endTimeRef} className="endTimeDiv">
                            <input className="endTimeInput" type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)}/>
                        </div>
                    </div>
                    <button className="addDescButton" ref={descButtonRef} onClick={AddDescription} >Add Description</button>
                    <textarea className="descTextArea" value={pendingDesc} onChange={(e)=>{
                        if (e.target.value == "") {
                            RemoveDescription();
                        }
                        setPendingDesc(e.target.value);
                    }} ref={descRef}/>
                </div>
                <div className="buttons">
                    <button id="confirm-button" onClick={ConfirmEvent}>Confirm</button>
                    <button id="cancel-button" onClick={()=>{CancelEvent(key)}}>Cancel</button>
                </div>
            </div>
        );
    }
//#endregion
//#region graphql

    const graphQLClient = generateClient();
    async function AddEvents(input) {
        console.log("Creating event!");
    
        for (const event of input["events"]) {
          let newEvent = await graphQLClient.graphql({
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
        }
        // props.callback();
    }
    
    async function ModifyEvents(input) {
    
    }
    
    async function DeleteEvents(input) {
        console.log("deleting event");
        for (const event of input["events"]) {
          let newEvent = await graphQLClient.graphql({
            query: mutations.deleteDateEvent,
            variables: {
              input: {
                id: event["id"]
              }
            }
          });
        }
        // props.callback();
    }
//#endregion 
    async function HandleChatSubmit(event) {
        event.preventDefault();
        if (input == "") return;

        let userInput = input;
        setInput("");
        AddUserMessage(userInput);
        setChatEnabled(false);
        setLoadingSign(true);

        const today = new Date();
        let dayName = "";
        switch (today.getDay()) {
            case "0":
                dayName = "Monday";
                break;
            case "1":
                dayName = "Tuesday";
                break;
            case "2":
                dayName = "Wednesday";
                break;
            case "3":
                dayName = "Thursday";
                break;
            case "4":
                dayName = "Friday";
                break;
            case "5":
                dayName = "Saturday";
                break;
            case "6":
                dayName = "Sunday";
                break;
            default:
                break;
        }

        let prompt = "Today's date: " + today + ", " + dayName + "\n\n a list of user's events: " + JSON.stringify(props.events) + "\n\nUser input: " + userInput;

        const payload = {
            agentId: AGENT_ID,
            agentAliasId: ALIAS_ID,
            sessionId: sessionId,
            inputText: prompt
        }

        const command = new InvokeAgentCommand(payload);
        try { //send client message
            let completion = "";
            const response = await client.send(command);
            for await (let chunkEvent of response.completion) {
                const chunk = chunkEvent.chunk;
                const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                completion += decodedResponse;
            }
            try { // attempt to parse a json response
                let multipleResponses = completion.split("```");
                for (const response of multipleResponses) {
                    let potentialJson = JSON.parse(response);
                    console.log(potentialJson);
                    switch (potentialJson["queryType"]) {
                        case "create":
                            AddCreateEventConfirmations(potentialJson["events"]);
                            break;
                        case "delete":
                            DeleteEvents(potentialJson);
                            break;
                        default:
                            break;
                    }
                }
            } catch (err) { // return response if not a json
                AddAgentMessage(completion);
            }
        } catch (err) { // failsafe TODO
            AddAgentMessage(err.message);
        }
        setChatEnabled(true);
        setLoadingSign(false);

    } //TODO lambda function to get days of week for a year
    
    return(
        <div className="chatBoxContainer" style={overrideChatStyle}>
            <h2>Nimbus Chat</h2>
            <div className="chatBox">
                {messageList}
                <img src={loadingImage} hidden={!loadingSign}/>
                <div ref={scrollRef}/>
            </div>
            <form className="form" onSubmit={HandleChatSubmit}>
                <textarea ref={chatRef} placeholder="Message" value={input} disabled={!chatEnabled} onKeyDown={async (e)=>{
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        HandleChatSubmit(e);
                    }
                }} 
                onChange={(e) => setInput(e.target.value)}/>
                <button type="submit">CHAT</button>
            </form>
        </div>
    );
}

export default withAuthenticator(AgentInterface)