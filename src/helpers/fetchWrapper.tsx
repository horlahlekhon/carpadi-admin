import getConfig from 'next/config';
import router from 'next/router'

const {publicRuntimeConfig} = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
    patch,
    delete: _delete
};

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body, contentType = 'application/json') {
    const requestOptions = {
        crossDomain: true,
        method: 'POST',
        headers: {'Content-Type': contentType, ...authHeader(url)},
        body: contentType === 'application/json' ? JSON.stringify(body) : body,
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body, contentType = 'application/json') {
    const requestOptions = {
        crossDomain: true,
        method: 'PUT',
        headers: {'Content-Type': contentType, ...authHeader(url)},
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function patch(url, body, contentType = 'application/json') {
    const requestOptions = {
        crossDomain: true,
        method: 'PATCH',
        headers: {'Content-Type': contentType, ...authHeader(url)},
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
    // return auth header with basic auth credentials if user is logged in and request is to the api url
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    if (isApiUrl && process.browser) {
        const token = JSON.parse(localStorage.getItem('token'))
        return {Authorization: `Bearer ${token}`};
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.detail) || (data && data.error) || (data && data.messages && data.messages[0]) || (data && data.car && data.car[0]) || (data && data.vin && (typeof data.vin === 'string' ? data.vin : data.vin[0])) || response.statusText;
            if (response.status === 404) {
                router.push('/errors/not-found')
            }
            if (response.status > 499) {
                router.push('/errors/server-error')
            }
            return Promise.reject(error);
        }
        return data;
    });
}