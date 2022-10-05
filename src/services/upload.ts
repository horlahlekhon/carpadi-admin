import getConfig from 'next/config';
import {UploadTypes} from "../lib/enums";
import {randomString} from "../helpers/condeGenerators";
import Resizer from "react-image-file-resizer";


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
const uploadFile = (file, uploadType = UploadTypes.ANY, resourceId = '', actionName = 'image/upload') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    formData.append('public_id', `${uploadType}_${resourceId}_${randomString()}`);
    // formData.append('transformation', 'w_600,h_410');
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

const resizeFile = (file, {width = 300, height = 300, format = "JPEG"}) => {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            width,
            height,
            format,
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });
}

export {
    uploadFile,
    deleteUpload,
    resizeFile
}