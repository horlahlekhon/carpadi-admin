import getConfig from 'next/config';
import { fetchWrapper } from '../helpers/fetchWrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;


const updateUserPassword = (data) => {
    //old_password, new_password
    return fetchWrapper.post(`${baseUrl}/users/update-password/`, data)
        .then((response) => {
            return { status: true, data: response }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}
/**
 * Verify capcha
 *
 * @param {*} response
 * @return {*} 
 */
const verifyCapcha = async (response) => {
    const data = {
        response: response,
        ip: await getUserIp()
    }
    return fetch(`${baseUrl}/users/verify-captcha/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return { status: true, data: data }
        })
        .catch((error) => {
            return { status: false, data: error };
        })
}

const getUserIp = () => {
    return new Promise((resolve, reject) => {
        fetch('https://api.bigdatacloud.net/data/client-ip')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                resolve(data.ipString);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

export {
    updateUserPassword,
    verifyCapcha
}