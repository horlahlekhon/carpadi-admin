import getConfig from 'next/config';
import {fetchWrapper} from '../helpers/fetchWrapper';
const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveTrades = (limit = 10, offset = 1, tradeStatus = "purchased") => {
    return fetchWrapper.get(`${baseUrl}/trades?limit=${limit}&offset=${offset}&trade_status=${tradeStatus}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleTrade = (id) => {
    return fetchWrapper.get(`${baseUrl}/trades/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveTradeStats = () => {
    return fetchWrapper.get(`${baseUrl}/dashboards/trades`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveTradeUnits = (id) => {
    return fetchWrapper.get(`${baseUrl}/trade-units?trade=${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateSingleTrade = (id, data) => {
    return fetchWrapper.put(`${baseUrl}/trades/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const createSingleTrade = (data) => {
    return fetchWrapper.post(`${baseUrl}/trades/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


const deleteSingleTrade = (id) => {
    return fetchWrapper.delete(`${baseUrl}/trades/${id}/`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveUserTrades = (merchantId, status = 'purchased') => {
    return fetchWrapper.get(`${baseUrl}/trade-units?limit=${50}&offset=${0}&merchant=${merchantId}&trade_status=${status}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export const tradeService = {
    retrieveTrades,
    retrieveSingleTrade,
    retrieveTradeStats,
    retrieveTradeUnits,
    updateSingleTrade,
    deleteSingleTrade,
    createSingleTrade,
    retrieveUserTrades
}