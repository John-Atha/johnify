import React, { useState, useEffect } from 'react';

import './styles.css';
import Card from 'react-bootstrap/Card';
import user_icon from '../images/user.png';
import Error from '../0_MainPages/Error';

import { isLogged, getUser } from '../api/api';

function Profile(props) {
    const [id, setId] = useState(props.id);
    const [user, setUser] = useState(null);
    const [myId, setMyId] = useState(null);

    const checkLogged = () => {
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response=> {
                setMyId(response.data.id);
            })
            .catch(err => {
                setMyId(null);
            })
        }
    }

    const getProfile = () => {
        getUser(id)
        .then(response => {
            setUser(response.data);
        })
        .catch(err => {
            ;
        })
    }

    useEffect(() => {
        getProfile();
        checkLogged();
    }, [])


    if (user) {
        return(
            <div className='famous-skeleton'>
                <Card className="bg-dark text-white"
                    style={{'width': '100%', 'height': '300px'}}>
                    <Card.Img 
                        style={{'height': 'inherit', 'width': '100%', 'objectFit': 'cover', 'opacity': '50%'}}
                        src={user ? (user.photo_url || user_icon) : user_icon}
                        alt="User" />
                    <Card.ImgOverlay>
                        <Card.Title style={{'fontSize': '50px'}}>{user ? user.username : null}</Card.Title>
                        <Card.Text style={{'fontSize': '35px'}} className='with-whitespace flex-layout'>
                            <i>Artist: </i> 
                            <i>{user.is_artist ? 'Yes' : 'No'}</i>
                        </Card.Text>
                    </Card.ImgOverlay>
                </Card>
            </div>
        )    
    }
    else{
        return(
            <Error message='Oops, user not found.' />
        )
    }
}

export default Profile;