import React from 'react';

function Error(props) {
    return(
        <div style={{'color': 'red'}} className='margin-top'>
            {props.message}
        </div>
    )
}

export default Error;