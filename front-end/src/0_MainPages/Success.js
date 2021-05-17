import React from 'react';

function Error(props) {
    return(
        <div style={{'color': 'green'}} className='margin-top'>
            {props.message}
        </div>
    )
}

export default Error;