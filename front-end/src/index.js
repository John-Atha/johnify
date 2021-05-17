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

const FindAlbum = () => {
  const {id} = useParams();
  return <AlbumPage id={id} />
}

ReactDOM.render(
  <React.StrictMode>
    <ReactNotifications />
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/tracks' exact>
          <AllPage case='tracks' />
        </Route>
        <Route path='/albums' exact>
          <AllPage case='albums' />
        </Route>        <Route path='/albums/:id'>
          <FindAlbum />
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
