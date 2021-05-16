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