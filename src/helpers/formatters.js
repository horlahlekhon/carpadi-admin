import Moment from "moment";

export const formatDate = (date) => Moment(date).format('DD-MM-YYYY')

export const formatNumber = (value) => {
    if (value) {
        return Number(value).toLocaleString();
    }
}

export const trimString = (value, length = 7) => {
    if (value) {
        return String(value).substring(0, length);
    }
}