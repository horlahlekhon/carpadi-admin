import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
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
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', ...authHeader(url)},
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
    const token = String(localStorage.getItem('token'))
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    if (isApiUrl) {
        return {Authorization: `Bearer ${token}`};
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}