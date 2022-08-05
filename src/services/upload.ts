import getConfig from 'next/config';
import {fetchWrapper} from '../helpers/fetchWrapper';

const {publicRuntimeConfig} = getConfig();
const baseUrl = `https://api.Cloudinary.com/v1_1/${publicRuntimeConfig.cloudinaryCloudName}`;
const cloudName = `${publicRuntimeConfig.cloudinaryCloudName}`;
const preset = `${publicRuntimeConfig.cloudinaryPreset}`;

/**
 * Upload file to cloudinary
 * @param actionName
 * @param file
 */
const uploadFile = (file, actionName = 'image/upload') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    return fetch(`${baseUrl}/${actionName}`, {method: 'POST', body: formData})
        .then(async (response) => {
            let res = await response.json()
            return {status: true, data: res}
        })
        .catch((error) => {
            return {status: false, data: error};
        })
}

const deleteUpload = (id) => {
    console.log(id)
}

export {
    uploadFile,
    deleteUpload
}