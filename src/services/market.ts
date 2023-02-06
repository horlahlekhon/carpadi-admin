import getConfig from 'next/config';
import { fetchWrapper } from '../helpers/fetchWrapper';
import { BuyingStates } from '../lib/enums';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/market`;

const retrieveBuying = (limit = 10, offset = 0, status = 'active') => {

    return fetchWrapper.get(`${baseUrl}/buy?limit=${limit}&offset=${offset}&status=${status}`)
        .then((response) => {
            return { status: true, data: response }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}

const retrieveSell = (limit = 10, offset = 0, status = 'active') => {

    return fetchWrapper.get(`${baseUrl}/sell?limit=${limit}&offset=${offset}&status=${status}`)
        .then((response) => {
            return { status: true, data: response }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}

const retrieveSingleBuying = (id) => {
    return fetchWrapper.get(`${baseUrl}/buy/${id}`)
        .then((response) => {
            return { status: true, data: response }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}

const retrieveSingleSell = (id) => {
    return fetchWrapper.get(`${baseUrl}/sell/${id}`)
        .then((response) => {
            return { status: true, data: response }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}

const rejectSale = (id, reason) => {
    return fetchWrapper.patch(`${baseUrl}/sell/${id}/`, {status: BuyingStates.Rejected, decline_reason: reason})
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const acceptSale = (id) => {
    return fetchWrapper.patch(`${baseUrl}/sell/${id}/`, {status: BuyingStates.Accepted})
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


export {
    retrieveBuying,
    retrieveSingleBuying,
    retrieveSell,
    retrieveSingleSell,
    acceptSale,
    rejectSale
}