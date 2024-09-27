import React, {useState, useEffect} from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

let boxStyles = {
    width: "100px", 
    height: "100px", 
    "background-color": "#444455", 
    "font-size": "10px",
    margin: "5px",
    position: "relative"
};

let xButtonStyles = {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    "border-radius": "10px",
    backgroundColor: "red",
    "font-weight": "bold",
    color: "white"
    
}



const EventBox = (props) => {
    var client = generateClient();

    const handleDeleteButtonClick = async () => {
        const deletedEvent = await client.graphql({
            query: mutations.deleteDateEvent,
            variables: {
                input: {
                    id: props.id
                }
            }
        });
        document.getElementById(props.id).hidden = true;
    }

    return (
        <div style={boxStyles} id={props.id}>
            <p>{props.title}</p>
            <p>{props.desc}</p>
            <p>{props.date}</p>
            <button style={xButtonStyles} onClick={handleDeleteButtonClick}>X</button>
        </div>
    );
}

export default EventBox;