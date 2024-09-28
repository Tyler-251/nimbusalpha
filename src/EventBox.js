import React, {useState, useEffect} from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

let boxStyles = {
    width: "100px", 
    height: "100px", 
    "backgroundColor": "#444455", 
    "fontSize": "10px",
    margin: "5px",
    position: "relative",
};

let xButtonStyles = {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    "borderRadius": "10px",
    backgroundColor: "red",
    "fontWeight": "bold",
    color: "white"
}

const EventBox = (props) => {
    var client = generateClient();
    const event = props.event;
    const handleDeleteButtonClick = async () => {
        const deletedEvent = await client.graphql({
            query: mutations.deleteDateEvent,
            variables: {
                input: {
                    id: event.id
                }
            }
        });
        document.getElementById(event.id).hidden = true;
    }

    return (
        <div style={boxStyles} id={event.id}>
            <p><b>{event.name}</b></p>
            <p>from {event.startDate}</p>
            <p>to {event.endDate}</p>
            <button style={xButtonStyles} onClick={handleDeleteButtonClick}>X</button>
        </div>
    );
}

export default EventBox;