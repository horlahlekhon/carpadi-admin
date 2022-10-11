import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const searchResults = (limit = 10, offset = 0, type = '', query = '') => {
    if (type === 'sales') {
        return fetchWrapper.get(`${baseUrl}/car-products?limit=${limit}&offset=${offset}&search=${query}`)
            .then((response) => {
                return {status: true, data: response}
            })
            .catch((error) => {
                return {status: false, data: error};
            })
    } else if (type === 'inventory') {
        return fetchWrapper.get(`${baseUrl}/cars?limit=${limit}&offset=${offset}&search=${query}`)
            .then((response) => {
                return {status: true, data: response}
            })
            .catch((error) => {
                return {status: false, data: error};
            })
    } else if (type === 'users') {
        return fetchWrapper.get(`${baseUrl}/merchants?limit=${limit}&offset=${offset}&search=${query}`)
            .then((response) => {
                return {status: true, data: response}
            })
            .catch((error) => {
                return {status: false, data: error};
            })
    } else if (type === 'trade') {
        return fetchWrapper.get(`${baseUrl}/trades?limit=${limit}&offset=${offset}&search=${query}`)
            .then((response) => {
                return {status: true, data: response}
            })
            .catch((error) => {
                return {status: false, data: error};
            })
    } else {
        return new Promise(() => {
            return {status: false, data: 'Invalid module'}
        })
    }
}


export {
    searchResults,
}