
import getConfig from 'next/config';
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveCarBrands = (limit = 10, offset = 0) => {
    return fetchWrapper.get(`${baseUrl}/car-brands?limit=${limit}&offset=${offset}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleCarBrand = (id) => {
    return fetchWrapper.get(`${baseUrl}/car-brands/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const createCarBrand = (data) => {
    return fetchWrapper.post(`${baseUrl}/car-brands/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateCarBrand = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/car-brands/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const deleteCarBrand = (id) => {
    return fetchWrapper.delete(`${baseUrl}/car-brands/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


export {
    retrieveCarBrands,
    retrieveSingleCarBrand,
    createCarBrand,
    updateCarBrand,
    deleteCarBrand
}