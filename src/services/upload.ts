import getConfig from 'next/config';
import {UploadTypes} from "../lib/enums";
import {randomString} from "../helpers/condeGenerators";
import Resizer from "react-image-file-resizer";
import AWS from 'aws-sdk'


const {publicRuntimeConfig} = getConfig();

AWS.config.update({
    accessKeyId: publicRuntimeConfig.accessKeyId,
    secretAccessKey: publicRuntimeConfig.secretAccessKey
})

const myBucket = new AWS.S3({
    params: {Bucket: publicRuntimeConfig.bucket},
    region: publicRuntimeConfig.region,
})

/**
 * Upload file to cloudinary
 * @param uploadType
 * @param resourceId
 * @param actionName
 * @param file [Required]
 */
const uploadFile = async (file, uploadType = UploadTypes.ANY, resourceId = '', actionName = 'image/upload') => {
    const rand = randomString();
    const fileExtension = file.name.split('.').pop()
    const params = {
        Body: file,
        Bucket: publicRuntimeConfig.bucket,
        Key: `assets/${uploadType}/${resourceId}_${rand}.${fileExtension}`
    };
    const res = await myBucket.upload(params).promise()
    return !!res ? {
        data: {
            secure_url: `${publicRuntimeConfig.cloudfront}/${uploadType}/${resourceId}_${rand}.${fileExtension}`
        }, status: true
    } : {status: false, data: "image upload failed"}
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

const applyTransformation = (url: string, width: number, height: number) => {
    if (url) {
        const splitUrl = url.split('upload/')
        if (splitUrl.length == 2) {
            return `${splitUrl[0]}upload/w_${width},h_${height}/${splitUrl[1]}`
        }
        return url;
    }
    return url
}

export {
    uploadFile,
    deleteUpload,
    resizeFile,
    applyTransformation
}