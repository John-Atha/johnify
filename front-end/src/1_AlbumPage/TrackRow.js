import React, { useState, useEffect } from 'react';

import './styles.css';
import like from '../images/fav.png';
import liked_icon from '../images/fav-checked.png';
import track_icon from '../images/track.png';

function TrackRow(props) {
    const [userId, setUserId] = useState(props.userId);
    const [liked, setLiked] = useState(false);

    const checkLiked = () => {
        setLiked(userId ? props.value.fans.includes(userId) : false);
    }
    
    useEffect(() => {
        setUserId(props.userId);
        setTimeout(()=>{checkLiked();}, 0);
    }, [props.userId])

    return(
        <tr key={props.index}
            className= { (props.index%2===0) ? 'track-row-even' : 'track-row-odd' }>
            <td key={props.index+0.2} style={{'width':'50px'}}>{props.index+1}</td>
            <td key={props.index+0.3} style={{'width':'300px'}} className='flex-layout'>
                <img style={{'height': '40px', 'width': '50px'}}
                     src={props.value.photo_url || track_icon} />
                <div style={{'marginLeft': '15px'}}>
                    {props.value.title}
                </div>
            </td>
            <td key={props.index+0.4} style={{'width':'50px'}}>{props.value.date}</td>
            <td key={props.index+0.5} style={{'width':'50px'}}>
                {liked &&
                    <img src={liked_icon} style={{'height': '40px'}} />
                }
                {!liked &&
                    <img src={like} style={{'height': '40px'}} />
                }
            
            </td>
        </tr>
    )
    
}

export default TrackRow;