import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveSales = (limit = 10, offset = 0, status = 'active') => {
    
    return fetchWrapper.get(`${baseUrl}/car-products?limit=${limit}&offset=${offset}&status=${status}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleSale = (id) => {
    return fetchWrapper.get(`${baseUrl}/car-products/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const createSale = (data) => {
    return fetchWrapper.post(`${baseUrl}/car-products/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateSale = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/car-products/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const deleteSale = (id) => {
    return fetchWrapper.delete(`${baseUrl}/car-products/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


export {
    retrieveSales,
    retrieveSingleSale,
    createSale,
    updateSale,
    deleteSale
}