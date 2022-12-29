import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveCars = (limit = 10, offset = 0, status = ['sold']) => {
    const stat = status.map(e => `status=${e}`).join("&")
    return fetchWrapper.get(`${baseUrl}/cars?limit=${limit}&offset=${offset}&${stat}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleCar = (id) => {
    return fetchWrapper.get(`${baseUrl}/cars/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const createCar = (data) => {
    return fetchWrapper.post(`${baseUrl}/cars/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateCar = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/cars/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const deleteCar = (id) => {
    return fetchWrapper.delete(`${baseUrl}/cars/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


export {
    retrieveCars,
    retrieveSingleCar,
    createCar,
    updateCar,
    deleteCar
}