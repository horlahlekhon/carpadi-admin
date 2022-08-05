import Moment from "moment";

export const formatDate = (date) => Moment(date).format('DD-MM-YYYY')

export const humanReadableDate = (date) => Moment(date).format('dddd, MMMM Do YYYY')

export const formatNumber = (value) => {
    if (value) {
        return Number(value).toLocaleString();
    } else {
        return value
    }
}

export const trimString = (value, length = 7) => {
    if (value) {
        return String(value).substring(0, length);
    }
}