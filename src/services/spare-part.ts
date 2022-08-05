import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;


const createSparePart = (data) => {
    return fetchWrapper.post(`${baseUrl}/spare-parts/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSPareParts = (limit = 10, offset = 0) => {
    return fetchWrapper.get(`${baseUrl}/spare-parts?limit=${limit}&offset=${offset}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleSparePart = (id) => {
    return fetchWrapper.get(`${baseUrl}/spare-parts/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export {
    createSparePart,
    retrieveSingleSparePart,
    retrieveSPareParts
}