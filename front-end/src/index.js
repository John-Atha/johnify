import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";

import ReactNotifications from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Home from './0_MainPages/Home';
import LoginSkeleton from './0_LoginRegister/LoginSkeleton';

const FindAlbum = () => {
  const { id } = useParams();
  return <Home page='album' id={id} />;
}
const FindTrack = () => {
  const { id } = useParams();
  return <Home page='track' id={id} />;
}
const FindProfile = () => {
  const { id } = useParams();
  return <Home page='profile' id={id} />;
}
const FindKind = () => {
  const { id } = useParams();
  return <Home page='kind' id={id} />;
}

ReactDOM.render(
  <React.StrictMode>
    <ReactNotifications />
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          <Home page='famous' />
        </Route>
        <Route path='/login' exact>
          <LoginSkeleton case='login' />
        </Route>
        <Route path='/register' exact>
          <LoginSkeleton case='register' />
        </Route>
        <Route path='/tracks' exact>
          <Home page='all' case='tracks' />
        </Route>
        <Route path='/tracks/:id' exact>
          <FindTrack />
        </Route>
        <Route path='/albums' exact>
          <Home page='all' case='albums' />
        </Route>
        <Route path='/albums/:id' exact>
          <FindAlbum />
        </Route>
        <Route path='/favs' exact>
          <Home page='favs' />
        </Route>
        <Route path='/search' exact>
          <Home page='search' />
        </Route>
        <Route path='/users/:id' exact>
          <FindProfile />
        </Route>
        <Route path='/create' exact>
          <Home page='create' />
        </Route>
        <Route path='/kinds/:id' exact>
          <FindKind />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
