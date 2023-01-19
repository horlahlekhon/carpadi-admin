import getConfig from 'next/config';
import { fetchWrapper } from '../helpers/fetchWrapper';

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

const retrieveSingleBuying = (id) => {
    return fetchWrapper.get(`${baseUrl}/buy/${id}`)
        .then((response) => {
            return { status: true, data: response }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}


export {
    retrieveBuying,
    retrieveSingleBuying
}