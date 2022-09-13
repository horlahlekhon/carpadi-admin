import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveCarDocuments = (car = '', limit = 20, offset = 0) => {
    return fetchWrapper.get(`${baseUrl}/car-documents?limit=${limit}&offset=${offset}&car=${car}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const createCarDocument = (data) => {
    return fetchWrapper.post(`${baseUrl}/car-documents/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateCarDocument = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/car-documents/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const deleteCarDocument = (id) => {
    return fetchWrapper.delete(`${baseUrl}/car-documents/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


export {
    retrieveCarDocuments,
    createCarDocument,
    updateCarDocument,
    deleteCarDocument
}