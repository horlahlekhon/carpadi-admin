import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`;

const retrieveActivities = ({limit = 10, offset = 0, activityType = ''}) => {
    return fetchWrapper.get(`${baseUrl}/activities?limit=${limit}&offset=${offset}` + `${activityType === '' ? '' : ('&activity_type=' + activityType)}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const retrieveUserActivities = (merchantId) => {
    return fetchWrapper.get(`${baseUrl}/activities?limit=${50}&offset=${0}&merchant=${merchantId}&activity_type=${'trade_unit'}`)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

export {
    retrieveActivities,
    retrieveUserActivities
}