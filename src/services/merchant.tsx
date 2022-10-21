import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveMerchants = (limit = 10, offset = 1, tradeStatus = "", user = "", status = "", is_approved = "") => {
    return fetchWrapper.get(`${baseUrl}/merchants?limit=${limit}&offset=${offset}&trading_status=${tradeStatus}&user=${user}&status=${status}&is_approved=${is_approved}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleMerchant = (id) => {
    return fetchWrapper.get(`${baseUrl}/merchants/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveMerchantStats = () => {
    return fetchWrapper.get(`${baseUrl}/dashboards/merchants`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateSingleMerchant = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/merchants/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


const deleteSingleTrade = (id) => {
    return fetchWrapper.delete(`${baseUrl}/merchants/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export const merchantService = {
    retrieveMerchants,
    retrieveSingleMerchant,
    retrieveMerchantStats,
    updateSingleMerchant,
    deleteSingleTrade
}