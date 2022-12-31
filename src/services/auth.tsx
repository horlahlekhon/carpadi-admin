import {BehaviorSubject} from 'rxjs';
import getConfig from 'next/config';
import router from 'next/router'
import {fetchWrapper} from '../helpers/fetchWrapper';
import jwt_decode from "jwt-decode"

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/auth`;
const storedUser = process.browser && localStorage.getItem('user');
const userSubject = new BehaviorSubject(JSON.parse(storedUser));
const authSubject = new BehaviorSubject(false);


export const authService = {
    user: userSubject.asObservable(),
    isAuthenticated: authSubject.asObservable(),
    userValue: () => {
        return userSubject.value
    },
    get authValue() {
        return authSubject.value
    },
    login,
    logout,
    autoAuthenticate,
    refreshToken
};


/**
 * Authenticate a user
 * @param username Username
 * @param password Password
 */
function login(username, password) {
    return fetchWrapper.post(`${baseUrl}/login/`, {username, password})
        .then(user => {
            userSubject.next(user.user);
            authSubject.next(true);
            localStorage.setItem('user', JSON.stringify(user.user));
            localStorage.setItem('token', JSON.stringify(user.access));
            localStorage.setItem('refreshToken', JSON.stringify(user.refresh));
            return {status: true, data: user};
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

/**
 * Refresh JWT
 */
function refreshToken() {
    if (process.browser) {
        const refreshToken = JSON.parse(String(localStorage.getItem('refreshToken')));
        return fetchWrapper.post(`${baseUrl}/token-refresh/`, {refresh: refreshToken})
            .then(data => {
                authSubject.next(true);
                localStorage.setItem('token', JSON.stringify(data.access));
            })
            .catch((error) => {
                logout()
            })
    }
}

/**
 * Logs a user out
 */
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    userSubject.next(null);
    authSubject.next(false);
    router.push('/login');
}

/**
 * Tries auto authenticating user if token exists
 */
function autoAuthenticate() {
    if (process.browser) {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token)
            const currentTimestamp = Date.now();
            // @ts-ignore
            if ((decodedToken?.exp * 1000) > currentTimestamp) {
                authSubject.next(true);
            } else {
                refreshToken()
                    .then(() => {
                        
                    })
            }
        }
    }
}

