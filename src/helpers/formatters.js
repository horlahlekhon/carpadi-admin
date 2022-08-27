import Moment from "moment";

export const formatDate = (date) => {
    if (date) {
        return Moment(date).format('DD-MM-YYYY')
    } else {
        return date
    }
}

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
        return String(value).slice(length * -1);
    }
}