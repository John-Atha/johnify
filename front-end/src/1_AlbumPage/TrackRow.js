import React, { useState, useEffect } from 'react';

import './styles.css';
import like from '../images/fav.png';
import liked_icon from '../images/fav-checked.png';
import track_icon from '../images/track.png';

import { createNotification } from '../createNotification';
import { removeFavTrack, addFavTrack } from '../api/api';

function TrackRow(props) {
    const [userId, setUserId] = useState(props.userId);
    const [liked, setLiked] = useState(false);
    const [track, setTrack] = useState(props.value);

    const checkLiked = () => {
        //console.log('check liked with');
        //console.log(`user: ${props.userId}`);
        //console.log('fans:');
        console.log(props.value.fans);
        setLiked(props.userId ? props.value.fans.includes(parseInt(props.userId)) : false);
    }

    const updateFavs = (data) => {
        console.log(data);
        const newFans = data;
        const newTrack = track;
        newTrack['fans'] = newFans;
        setTrack(newTrack);
        setTimeout(()=>{checkLiked();}, 100);
    }

    const updLike = () => {
        if (!userId) {
            createNotification('danger', 'Sorry', 'You cannot do this without an account')
        }
        else {
            if (liked) {
                removeFavTrack(userId, track.id)
                .then(response => {
                    updateFavs(response.data.fans);
                })
                .catch(err => {
                    setLiked(false);
                })
            }
            else {
                addFavTrack(userId, track.id)
                .then(response => {
                    updateFavs(response.data.fans);
                })
                .catch(err => {
                    setLiked(true);
                })    
            }
        }
    }
    
    useEffect(() => {
        setUserId(props.userId);
        setTimeout(()=>{checkLiked();}, 100);
    }, [props.userId])

    useEffect(() => {
        setTrack(props.value);
        setTimeout(()=>{checkLiked();}, 100);
    }, [props.value])

    return(
        <tr key={props.index}
            className= { (props.index%2===0) ? 'track-row-even' : 'track-row-odd' }>
            <td key={props.index+0.2} style={{'width':'50px'}}>{props.index+1}</td>
            <td key={props.index+0.3} style={{'width':'300px'}} className='flex-layout'>
                <img style={{'height': '40px', 'width': '50px'}}
                     src={track.photo_url || track_icon} />
                <div style={{'marginLeft': '15px'}}>
                    {track.title}
                </div>
            </td>
            <td key={props.index+0.4} style={{'width':'50px'}}>{track.date}</td>
            <td key={props.index+0.5} style={{'width':'50px'}}>
                <input type='image' 
                       style={{'height': '40px'}}
                       src= {liked ? liked_icon : like}
                       onClick={updLike}
                />            
            </td>
        </tr>
    )
    
}

export default TrackRow;