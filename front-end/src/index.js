import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";

import ReactNotifications from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';
import reportWebVitals from './reportWebVitals';

import Home from './0_MainPages/Home';
import AlbumPage from './1_AlbumPage/AlbumPage';
import AllPage from './0_MainPages/AllPage';
import FavsPage from './0_MainPages/FavsPage';
import LoginSkeleton from './0_LoginRegister/LoginSkeleton';
import TrackPage from './1_TrackPage/TrackPage';

const FindAlbum = () => {
  const { id } = useParams();
  return <AlbumPage id={id} />;
}

const FindTrack = () => {
  const { id } = useParams();
  return <TrackPage id={id} />;
}

ReactDOM.render(
  <React.StrictMode>
    <ReactNotifications />
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/login' exact>
          <LoginSkeleton case='login' />
        </Route>
        <Route path='/register' exact>
          <LoginSkeleton case='register' />
        </Route>
        <Route path='/tracks' exact>
          <AllPage case='tracks' />
        </Route>
        <Route path='/tracks/:id' exact>
          <FindTrack />
        </Route>
        <Route path='/albums' exact>
          <AllPage case='albums' />
        </Route>
        <Route path='/albums/:id'>
          <FindAlbum />
        </Route>
        <Route path='/favs'>
          <FavsPage />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
