import React from 'react';

import './styles.css';
import '../generalStyles.css';
import track from '../images/track.png';
import play from '../images/play.png';

function Track(props) {
    return(
        <div className='one-album-container flex-layout'
             style={{ 'padding': !props.track.photo_url ? '5px' : '0px', 'position': 'relative'}}>
            <div className='flex-layout'>
                <img src={props.track.photo_url || track} alt='track'
                    onClick={()=>{window.location.href=`/tracks/${props.track.id}`}}
                    style={{'height': !props.track.photo_url ? '90px': '100px', 'marginTop': !props.track.photo_url ? '5px': '0px', 'borderRadius': '5px'}}/>
                <div style={{'marginLeft': '5px', 'padding': '5px'}}>
                    <div style={{'fontSize': '20px'}}
                        onClick={()=>{window.location.href=`/tracks/${props.track.id}`}}>
                        {props.track.title}</div>
                    <div  className='artist-name'>
                        {props.track.album.artist.username}
                    </div>
                    <div style={{'fontSize': '13px'}}>{props.track.date}</div>
                </div>
                {!props.playing &&
                    <img src={play}
                         style={{'height': '70px', 'position': 'absolute', 'right': '10px', 'top': '10px'}}
                         onClick={()=>{props.upd(props.track)}} 
                    />
           
                }
            </div>
        </div>
    )
}

export default Track;