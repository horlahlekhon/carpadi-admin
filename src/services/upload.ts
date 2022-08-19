import getConfig from 'next/config';
import {UploadTypes} from "../lib/enums";
import {randomString} from "../helpers/condeGenerators";


const {publicRuntimeConfig} = getConfig();
const baseUrl = `https://api.Cloudinary.com/v1_1/${publicRuntimeConfig.cloudinaryCloudName}`;
const cloudName = `${publicRuntimeConfig.cloudinaryCloudName}`;
const preset = `${publicRuntimeConfig.cloudinaryPreset}`;

/**
 * Upload file to cloudinary
 * @param uploadType
 * @param resourceId
 * @param actionName
 * @param file [Required]
 */
const uploadFile = (file, uploadType = UploadTypes.ANY, resourceId = '', actionName = 'image/upload',) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    formData.append('public_id', `${uploadType}_${resourceId}_${randomString()}`);
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