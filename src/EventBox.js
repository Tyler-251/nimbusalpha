import React from 'react';


let styles = {
    width: "100px", 
    height: "100px", 
    "background-color": "red", 
    "font-size": "10px",
    margin: "5px"
};

const EventBox = (props) => {
    return (
        <div style={styles}>
            <p>{props.title}</p>
            <p>{props.date}</p>
        </div>
    );
}

export default EventBox;