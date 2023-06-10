import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveTransaction = (limit = 10, offset = 1, walletId = "") => {
    return fetchWrapper.get(`${baseUrl}/transactions?limit=${limit}&offset=${offset}&wallet=${walletId}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleTransaction = (id) => {
    return fetchWrapper.get(`${baseUrl}/transactions/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export const transactionService = {
    retrieveTransaction,
    retrieveSingleTransaction,
}