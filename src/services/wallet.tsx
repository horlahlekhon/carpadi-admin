import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveWallets = (limit = 10, offset = 1, merchantId = "") => {
    return fetchWrapper.get(`${baseUrl}/wallets?limit=${limit}&offset=${offset}&merchant=${merchantId}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveSingleWallet = (id) => {
    return fetchWrapper.get(`${baseUrl}/wallets/${id}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export const walletService = {
    retrieveWallets,
    retrieveSingleWallet,
}