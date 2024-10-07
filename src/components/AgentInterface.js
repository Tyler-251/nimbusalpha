import { withAuthenticator } from "@aws-amplify/ui-react"
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import {InvokeAgentCommand, BedrockAgentRuntimeClient} from '@aws-sdk/client-bedrock-agent-runtime';
import "../styles/AgentInterface.css"
import { useEffect, useState, useRef } from "react";
import loadingImage from "../img/loadingdots.gif"

import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { generateClient } from "aws-amplify/api";

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


function AgentInterface(props) {
    const [messageList, setMessageList] = useState([<AgentMessageBox text="Hello, how can I help you today?"/>]);
    const [input, setInput] = useState("");
    const [client, setClient] = useState();
    const [userInfo, setUserInfo] = useState();
    const [chatEnabled, setChatEnabled] = useState(true);
    const [loadingSign, setLoadingSign] = useState(false);
    const [sessionId, setSessionId] = useState();
    const [overrideChatStyle, setOverrideChatStyle] = useState({});
    const [minimized, setMinimized] = useState(false);
    const [minimizedIcon, setMinimizedIcon] = useState(">");
    const [overrideButtonStyle, setOverrideButtonStyle] = useState({});
    const scrollRef = useRef(null);

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
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
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
        setMessageList((prevItems) => [...prevItems, <AgentMessageBox text={text}/>]);
    }
    function AddUserMessage(text) {
        let messageObject = {
            "author": "user",
            "text": text
        }
        setMessageList((prevItems) => [...prevItems, <UserMessageBox text={text}/>]);
    }
    function AddCreateEventConfirmation(event) {

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
        props.callback();
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
        props.callback();
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

        let prompt = "a list of user's events: " + JSON.stringify(props.events) + "\n\nUser input: " + userInput;

        const payload = {
            agentId: 'QLNAQZAVCZ',
            agentAliasId: '8AJCSJASX9',
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
                    switch (potentialJson["queryType"]) {
                        case "create":
                            AddEvents(potentialJson);
                            break;
                        case "delete":
                            DeleteEvents(potentialJson);
                            break;
                        default:
                            break;
                    }
                    AddAgentMessage("json identified: " + JSON.stringify(potentialJson));
                }
            } catch { // return response if not a json
                AddAgentMessage(completion);
            }
        } catch (err) { // failsafe TODO
            AddAgentMessage(err.message);
        }
        setChatEnabled(true);
        setLoadingSign(false);
    }
    
    return(
        <div className="chatBoxContainer" style={overrideChatStyle}>
            <button className="minimize" onClick={(e) => setMinimized(!minimized)} style={overrideButtonStyle}>{minimizedIcon}</button>
            <h2>Nimbus Chat</h2>
            <div className="chatBox">
                {messageList}
                <img src={loadingImage} hidden={!loadingSign}/>
                <div ref={scrollRef}/>
            </div>
            <form className="form" onSubmit={HandleChatSubmit}>
                <textarea placeholder="Message" value={input} disabled={!chatEnabled} onKeyDown={async (e)=>{
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