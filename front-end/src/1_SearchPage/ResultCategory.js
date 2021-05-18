import React, { useState, useEffect } from 'react';

import './styles.css';
import Album from '../3_OneCategory/Album';
import Track from '../3_OneCategory/Track';
import Error from '../0_MainPages/Error';
import MusicPlayer from '../0_Bars/MusicPlayer';

function ResultsCategory(props) {
    const [data, setData] = useState(props.data);

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    return(
        <div>
            <h2 className='margin-top-small'>Famous matching {props.case}</h2>
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
                                       upd={props.upd}
                                       playing={props.playing ? props.playing.id===value.id : false} />
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