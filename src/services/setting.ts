import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const settingsSubject = new BehaviorSubject(null);
const settings = settingsSubject.asObservable()


const retrieveSettings = () => {
    return fetchWrapper.get(`${baseUrl}/settings`)
        .then((response) => {
            if (response?.results.length > 0) {
                settingsSubject.next(response.results[0])
            }
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const updateSetting = (id, data) => {
    return fetchWrapper.patch(`${baseUrl}/settings/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}


export {
    retrieveSettings,
    updateSetting,
    settings
}