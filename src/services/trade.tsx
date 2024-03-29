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

const retrieveSingleTradeX = (id) => {
    return fetchWrapper.get(`${baseUrl}/trades?car=${id}`)
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
    return fetchWrapper.patch(`${baseUrl}/trades/${id}/`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const disburseTradeROT = (id, data) => {
    return fetchWrapper.post(`${baseUrl}/trades/disburse-rots/?trade=${id}`, data)
        .then((response) => {
            return {status: true, data: response}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const rollbackTrade = (id, data) => {
    return fetchWrapper.post(`${baseUrl}/trades/rollback-trade/?trade=${id}`, data)
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

const retrieveUserTrades = (merchantId, status = 'active') => {
    const activityStatusMap = {
        active: ['purchased', 'ongoing'],
        sold: ['completed'],
        closed: ['closed', 'expired']
    }
    const parsed = activityStatusMap[status].map(e => `trade_status=${e}`).join('&')
    return fetchWrapper.get(`${baseUrl}/trade-units?limit=${50}&offset=${0}&merchant=${merchantId}&${parsed}`)
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
    retrieveUserTrades,
    disburseTradeROT,
    rollbackTrade,
    retrieveSingleTradeX
}
