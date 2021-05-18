import React, { useState, useEffect } from 'react';

import './styles.css';
import Error from '../0_MainPages/Error';
import Track from '../3_OneCategory/Track';
import Button from 'react-bootstrap/Button';

import { getKindTracks } from '../api/api';


function OneKind(props) {
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(5);
    const [tracks, setTracks] = useState([]);
    const [noMore, setNoMore] = useState(true);
    const [showMore, setShowMore] = useState(false);

    const getTracks = (how='') => {
        if (props.current) {
            getKindTracks(props.current, start, end)
            .then(response => {
                console.log(`I am asking tracks with kind ${props.current}`);
                console.log(response);
                if (how==='restart') setTracks(response.data);
                else setTracks(tracks.concat(response.data));
                setNoMore(!response.data.length);
                setShowMore(response.data.length===5);
            })
            .catch(err => {
                setNoMore(true);
                setShowMore(false);
            })    
        }
    }
    
    useEffect(() => {
        setTimeout(()=>{getTracks('restart')}, 100);
    }, [props.current])

    return(
        <div>
            {noMore &&
                <Error message={`No ${tracks.length!==0 ? 'more' : ''} tracks of this category were found.`} />
            }

            {!noMore &&
                <div className='flex-layout'>
                    {tracks.map((value, index) => {
                        return(
                            <Track key={index}
                                   track={value}
                                   upd={props.upd}
                                   playing={props.playing ? props.playing.id===value.id : false} />
                    )
                    })}
                </div>
            }
            {!noMore && showMore &&
                <Button variant='warning'
                onClick={()=>{setStart(start+5);setEnd(end+5);getTracks()}}>
                    See more
                </Button>
            }
        </div>
    )   
}

export default OneKind;