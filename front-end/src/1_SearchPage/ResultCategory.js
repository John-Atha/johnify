import React, { useState, useEffect } from 'react';

import './styles.css';
import Album from '../3_OneCategory/Album';
import Track from '../3_OneCategory/Track';
import Error from '../0_MainPages/Error';
import ReactAudioPlayer from 'react-audio-player';

function ResultsCategory(props) {
    const [data, setData] = useState(props.data);
    const [playing, setPlaying] = useState(null);

    const updPlaying = (track) => {
        setPlaying(track);
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    return(
        <div>
            <h2 className='margin-top-small'>Famous matching {props.case}</h2>
            {props.case==='tracks' && data.length>0 &&
                <h4 className='flex-layout with-whitespace margin-top-small' style={{'color': '#8bdcfc'}}>
                    {'Now playing: '}
                    <a  style={{'color': '#8bdcfc', 'textDecoration': (playing ? 'underline' : 'none')}}
                        href={playing ? `/tracks/${playing.id}` : '#'}>
                        {playing ? playing.title : 'None'}
                    </a>
                </h4>
            }
            {props.case==='tracks' && data.length>0 &&
                <ReactAudioPlayer
                style={{'width': '350px', 'marginTop': '5px', 'marginLeft': '10px'}}
                src={playing ? playing.file : null}
                autoPlay
                controls
                />
            }
            <div className='flex-layout'>
                {data.map((value, index) => {
                        if (props.case==='albums') {
                            return(
                                <Album album={value} key={index} />
                            )
                        }
                        else {
                            return(
                                <Track track={value} 
                                       key={index}
                                       upd={updPlaying}
                                       playing={playing ? playing.id===value.id : false} />
                            )
                        }

                })}
            </div>
            {data.length===0 &&
                <Error message={`No ${props.case} found.`} />
            }
        </div>
    )
}

export default ResultsCategory;