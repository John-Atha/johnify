import axios from 'axios';
import config from './config';

axios.defaults.baseURL = config.apiUrl;

const token = localStorage.getItem('token');
const buildAuthHeader = () => {
    const headers = {
        "Authorization": "Bearer "+token,
    }
    return headers;
}

export const LoginPost = (username, password) => {
    const requestUrl = '/login';
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('username', username);
    bodyFormData.append('password', password);
    return axios.post(requestUrl, bodyFormData);
}

export const RegisterPost = (username, password, confirmation, email, is_artist) => {
    const requestUrl = '/users';
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('username', username);
    bodyFormData.append('password', password);
    bodyFormData.append('confirmation', confirmation);
    bodyFormData.append('email', email);
    return axios.post(requestUrl, bodyFormData);
}

export const isLogged = () => {
    const headers = buildAuthHeader();
    const requestUrl = '/logged';
    return axios.get(requestUrl, {headers});
}

export const getAlbumsRanking = (start, end) => {
    const params = { start, end};
    const requestUrl = '/albums/ranking';
    return axios.get(requestUrl, { params });
}

export const getTracksRanking = (start, end) => {
    const params = { start, end};
    const requestUrl = '/tracks/ranking';
    return axios.get(requestUrl, { params });
}

export const getAlbum = (id) => {
    const requestUrl = `/albums/${id}`;
    return axios.get(requestUrl);
}

export const getTrack = (id) => {
    const requestUrl = `/tracks/${id}`;
    return axios.get(requestUrl);
}

export const getAlbumTracks = (id, start=1, end=1000) => {
    const params = { start, end };
    const requestUrl = `/albums/${id}/tracks`;
    return axios.get(requestUrl, { params });
}

export const removeFavAlbum = (userId, id) => {
    const headers = buildAuthHeader();
    const requestUrl = `/users/${userId}/albums/fav/${id}`;
    return axios.delete(requestUrl, { headers });
}

export const addFavAlbum = (userId, id) => {
    const headers = buildAuthHeader();
    const requestUrl = `/users/${userId}/albums/fav`;
    var params = new FormData();
    params.append('album', id);
    return axios.post(requestUrl, params, { headers });
}

export const removeFavTrack = (userId, id) => {
    const headers = buildAuthHeader();
    const requestUrl = `/users/${userId}/tracks/fav/${id}`;
    return axios.delete(requestUrl, { headers });
}

export const addFavTrack = (userId, id) => {
    const headers = buildAuthHeader();
    const requestUrl = `/users/${userId}/tracks/fav`;
    var params = new FormData();
    params.append('track', id);
    return axios.post(requestUrl, params, { headers });
}

export const getFavAlbums = (userId, start, end) => {
    const requestUrl = `/users/${userId}/albums/fav`;
    const params = {start, end};
    return axios.get(requestUrl, { params });
}

export const getFavTracks = (userId, start, end) => {
    const requestUrl = `/users/${userId}/tracks/fav`;
    const params = { start, end };
    return axios.get(requestUrl, { params });
}

export const getKinds = () => {
    const requestUrl = '/kinds';
    return axios.get(requestUrl);
}

export const getKindTracks = (id, start, end) => {
    const params = { start, end };
    const requestUrl = `/kinds/${id}/tracks`;
    return axios.get(requestUrl, { params });
}