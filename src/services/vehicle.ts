import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveVehicles = (limit = 10, offset = 0) => {
    return fetchWrapper.get(`${baseUrl}/vehicles?limit=${limit}&offset=${offset}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleVehicle = (id) => {
    return fetchWrapper.get(`${baseUrl}/vehicles/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveVINDetails = (vin, data) => {
    return fetchWrapper.post(`${baseUrl}/vehicles/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateVehicle = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/vehicles/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const createVehicle = (data) => {
    return fetchWrapper.post(`${baseUrl}/vehicles/create-vehicle/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error}
        })

}

export {
    retrieveVehicles,
    retrieveSingleVehicle,
    retrieveVINDetails,
    updateVehicle,
    createVehicle
}