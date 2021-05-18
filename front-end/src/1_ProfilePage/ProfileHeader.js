import React, { useState, useEffect } from 'react';

import './styles.css';
import Card from 'react-bootstrap/Card';
import user_icon from '../images/user.png';
import Error from '../0_MainPages/Error';

import { isLogged, getUser } from '../api/api';

function Profile(props) {
    const [user, setUser] = useState(props.user);

    useEffect(() => {
        setUser(props.user);
    }, [props.user])

    if (user) {
        return(
            <Card className="bg-dark text-white"
                style={{'width': '100%', 'height': '300px'}}>
                <Card.Img 
                    style={{'height': 'inherit', 'width': '100%', 'objectFit': 'cover', 'opacity': '50%'}}
                    src={user ? (user.photo_url || user_icon) : user_icon}
                    alt="User" />
                <Card.ImgOverlay>
                    <Card.Title style={{'fontSize': '50px'}}>{user ? user.username : ''}</Card.Title>
                    <Card.Text style={{'fontSize': '35px'}} className='with-whitespace flex-layout'>
                        <i>Artist: </i> 
                        <i>{user.is_artist ? 'Yes' : 'No'}</i>
                    </Card.Text>
                </Card.ImgOverlay>
            </Card>
        )    
    }
    else{
        return(
            null
        )
    }
}

export default Profile;