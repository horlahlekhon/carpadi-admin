import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;


const createMaintenance = (data) => {
    return fetchWrapper.post(`${baseUrl}/maintenances/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateMaintenance = (data, id) => {
    return fetchWrapper.patch(`${baseUrl}/maintenances/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveMaintenances = (limit = 10, offset = 0, id = '') => {
    return fetchWrapper.get(`${baseUrl}/maintenances?limit=${limit}&offset=${offset}&car=${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleMaintenance = (id) => {
    return fetchWrapper.get(`${baseUrl}/maintenances/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export {
    createMaintenance,
    retrieveSingleMaintenance,
    retrieveMaintenances,
    updateMaintenance
}