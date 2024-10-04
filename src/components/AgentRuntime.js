import React, {useEffect, useState} from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';

import {CreateAgentCommand} from '@aws-sdk/client-bedrock-agent';
import {InvokeAgentCommand} from '@aws-sdk/client-bedrock-agent-runtime';
import {InvokeModelCommand, BedrockRuntimeClient} from '@aws-sdk/client-bedrock-runtime';

import { BedrockAgentRuntimeClient } from '@aws-sdk/client-bedrock-agent-runtime';

const AGENT_ID = 'TDKJY8NMFP';
const ALIAS_ID = 'AFSBNEVLOE';

const containerStyles = {
    padding: "50px",
    backgroundColor: "#113344",
    height: "100vh",
    color: "white"
}

export default function AgentRuntime() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('pending response');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const modelClient = new BedrockAgentRuntimeClient({region: 'us-east-1'});

        setResponse(prompt);
    }

    return (
        <div style={containerStyles}>
            <a href="/" style={{color: "white"}}>back</a>
            <form onSubmit={handleSubmit}>
                <input type='text' value={prompt} onChange={e => setPrompt(e.target.value)}/>
                <button type='submit'>Submit</button>
            </form>
            <p>{response}</p>
        </div>
    );
}