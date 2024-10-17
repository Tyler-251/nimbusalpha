import { withAuthenticator } from "@aws-amplify/ui-react"
import { fetchUserAttributes, fetchAuthSession } from '@aws-amplify/auth';
import {InvokeAgentCommand, BedrockAgentRuntimeClient} from '@aws-sdk/client-bedrock-agent-runtime';
import "../styles/AgentInterface.css"
import { useEffect, useState, useRef } from "react";
import loadingImage from "../img/loadingdots.gif"

import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { generateClient } from "aws-amplify/api";

const AGENT_ID = "QLNAQZAVCZ"; // Dont touch
const ALIAS_ID = "A9AKOR9L97"; // Update this with your alias id

const UserMessageBox = ({text}) => {
    return(
        <div className="userMessageBox">
            {text}
        </div>
    );
}

const AgentMessageBox = ({text}) => {
    return(
        <div className="agentMessageBox">
            {text}
        </div>
    );
}

const minimizedStyle = {right: "-380px"}
const minimizedButtonStyle = {transform: "translate(-40px, 30px)"}


const AgentInterface = (props) => {
    const [messageList, setMessageList] = useState([<AgentMessageBox text="Hello, how can I help you today?"/>]);
    const [input, setInput] = useState(""); //chatbox input
    const [client, setClient] = useState(); //agent client
    const [userInfo, setUserInfo] = useState();
    const [chatEnabled, setChatEnabled] = useState(true);
    const [loadingSign, setLoadingSign] = useState(false);
    const [sessionId, setSessionId] = useState();
    
    const scrollRef = useRef(null); //manage scrolldown on new message
    const chatRef = useRef(null); //manage focus textarea on agent response
    const graphQLClient = generateClient();

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
    function RemoveMessage(id) {
        console.log("removing message with id: " + id);
        setMessageList(prevMessageList => prevMessageList.filter((message) => message.props.id !== id));
    }
    function AddConfirmCreateTabs(events) {
        for (const event of events) {
            let uniqueKey = Math.random().toString();
            setMessageList((prevItems) => [...prevItems, <ConfirmCreateTab event={event} id={uniqueKey}/>]);
        }
    }

    function AddConfirmDeleteTabs(events) {
        for (const event of events) {
            let uniqueKey = Math.random().toString();
            setMessageList((prevItems) => [...prevItems, <ConfirmDeleteTab event={event} id={uniqueKey}/>]);
        }
    }
    
    function AddConfirmModifyTab(event) {
        let uniqueKey = Math.random().toString();
        setMessageList((prevItems) => [...prevItems, <ConfirmModifyTab event={event} id={uniqueKey}/>]);
    }
    
    const ConfirmCreateTab = (confirmProps) => {
        const event = confirmProps.event;
        const id = confirmProps.id;
        let startDatePT = event["startDateTime"].replace("T", " ");
        let endDatePT = event["endDateTime"].replace("T", " ");
        let desc = "";

        if ("desc" in event) {
            desc = event["desc"];
        }

        const buttonRef = useRef(null);
        async function ConfirmEvent() {
            buttonRef.current.disabled = true;
            buttonRef.current.textContent = "Creating Event...";
            let newEvent = await graphQLClient.graphql({
                query: mutations.createDateEvent,
                variables: {
                    input: {
                        name: event["title"],
                        startDateTime: event["startDateTime"],
                        endDateTime: event["endDateTime"],
                        desc: desc,
                        username: userInfo.sub
                    }
                }
            });
            buttonRef.current.textContent = "Success!";
            props.callback();
        }
        console.log(event);
        return (
            <div className="confirmCreateTab">
                <h1>{event["title"]}</h1>
                <div className="dateDiv">
                    <h2>{startDatePT}</h2>
                    <p>to</p>
                    <h2>{endDatePT}</h2>
                </div>
                <p>{event["desc"]}</p>
                <div className="buttons">
                    <button onClick={ConfirmEvent} ref={buttonRef}>Confirm</button>
                    <button onClick={()=>RemoveMessage(id)}>Cancel</button>
                </div>
            </div>
        );
    }

    const ConfirmDeleteTab = (confirmProps) => {
        const event = confirmProps.event;
        const id = confirmProps.id;
        const buttonRef = useRef(null);
        async function ConfirmDelete() {
            console.log("confirming delete");
            buttonRef.current.disabled = true;
            buttonRef.current.textContent = "Deleting Event...";
            let newEvent = await graphQLClient.graphql({
                query: mutations.deleteDateEvent,
                variables: {
                    input: {
                        id: event["id"]
                    }
                }
            });
            buttonRef.current.textContent = "Success!";
            props.callback();
        }
        const [name, setName] = useState("...");
        useEffect(()=>{
            async function fetchName() {
                let response = await graphQLClient.graphql({
                    query: queries.getDateEvent,
                    variables: {
                        id: event["id"]
                    }
                });
                setName(response.data.getDateEvent.name);
            }
            fetchName();
        }, []);
        return (
            <div className="confirmDeleteTab">
                <h1>Delete {name}</h1>
                <div className="buttons">
                    <button onClick={ConfirmDelete} ref={buttonRef}>Confirm</button>
                    <button onClick={()=>RemoveMessage(id)}>Cancel</button>
                </div>
            </div>
        );
    }

    const ConfirmModifyTab = (confirmProps) => {
        const event = confirmProps.event;
        const id = confirmProps.id;

        const buttonRef = useRef(null);
        async function ConfirmModify() {
            console.log("confirming modify");
            buttonRef.current.disabled = true;
            buttonRef.current.textContent = "Modifying Event...";
            let newEvent = await graphQLClient.graphql({
                query: mutations.updateDateEvent,
                variables: {
                    input: event
                }
            });
            buttonRef.current.textContent = "Success!";
            props.callback();
        }
        let changeList = [];
        if ("name" in event) {
            changeList.push(<h1 key={id + "t"}>Title: {event["name"]}</h1>);
        }
        if ("startDateTime" in event) {
            changeList.push(<h2 key={id + "sd"}>Start Date: {event["startDateTime"]}</h2>);
        }
        if ("endDateTime" in event) {
            changeList.push(<h2 key={id + "ed"}>End Date: {event["endDateTime"]}</h2>);
        }
        if ("desc" in event) {
            changeList.push(<p key={id + "d"}>Description: {event["desc"]}</p>);
        }
        return (
            <div className="confirmModifyTab">
                <h1>Modify Event</h1>
                {changeList}
                <div className="buttons">
                    <button onClick={ConfirmModify} ref={buttonRef}>Confirm</button>
                    <button onClick={()=>RemoveMessage(id)}>Cancel</button>
                </div>
            </div>
        );
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
                    if ("response" in potentialJson && potentialJson["response"] != "") {
                        AddAgentMessage(potentialJson["response"]);
                    }
                    switch (potentialJson["queryType"]) {
                        case "create":
                            AddConfirmCreateTabs(potentialJson["events"]);
                            break;
                        case "delete":
                            AddConfirmDeleteTabs(potentialJson["events"]);
                            break;
                        case "modify":
                            if ("event" in potentialJson) {
                                AddConfirmModifyTab(potentialJson["event"]);
                            } else {
                                for (const event of potentialJson["events"]) {
                                    AddConfirmModifyTab(event);
                                }
                            }
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

    } 

    function addNewEvent() {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localTime = new Date(today.getTime() - (offset * 60000));
        let todayString = localTime.toISOString().split("T")[0];
        const start = todayString + "T00:00Z";
        const end = todayString + "T23:59Z";
        
        AddConfirmCreateTabs([{"title": "New Event", "startDateTime": start, "endDateTime": end}]);
    }
    
    return(
        <div className="chatBoxContainer">
            <div className="title-area">
                <h2>Nimbus Chat</h2>
                <button onClick={addNewEvent}>+</button>
            </div>
            <div className="chatBox">
                {messageList.map((message) => {
                    let index = messageList.indexOf(message);
                    return (
                        <div key={index}>
                            {message}
                        </div>
                    );
                })}
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