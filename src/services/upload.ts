import getConfig from 'next/config';
import {UploadTypes} from "../lib/enums";
import {randomString} from "../helpers/condeGenerators";
import Resizer from "react-image-file-resizer";
import S3FileUpload from '../lib/aws-s3/lib/ReactS3'


const {publicRuntimeConfig} = getConfig();

const config = {
    bucketName: publicRuntimeConfig.bucket,
    dirName: `assets/${UploadTypes.ANY}`,
    region: publicRuntimeConfig.region,
    accessKeyId: publicRuntimeConfig.accessKeyId,
    secretAccessKey: publicRuntimeConfig.secretAccessKey,
}

/**
 * Upload file to cloudinary
 * @param uploadType
 * @param resourceId
 * @param actionName
 * @param file [Required]
 */
const uploadFile = async (file, uploadType = UploadTypes.ANY, resourceId = '', actionName = 'image/upload') : Promise<{ status: boolean, data: any }> => {
    const rand = randomString();
    const fileExtension = file?.name ? file.name.split('.').pop() : 'webp'
    const fileName = `${resourceId}_${rand}.${fileExtension}`

    const res = await S3FileUpload
        .uploadFile(file, {...config, dirName: `assets/${uploadType}`}, fileName, fileExtension)
    
    return !!res ? {
        data: {
            secure_url: `${publicRuntimeConfig.cloudfront}/${uploadType}/${fileName}`
        }, status: true
    } : {status: false, data: "image upload failed"}
}

const deleteUpload = async (fileName, uploadType = UploadTypes.ANY,) => {
    return await S3FileUpload.deleteFile(fileName, {...config, dirName: `assets/${uploadType}`})

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
            "file"
        );
    });
}

const convertToWebp = (file) => {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            file.width,
            file.height,
            'WEBP',
            50,
            0,
            (uri) => {
                resolve(uri);
            },
            "file"
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
    applyTransformation,
    convertToWebp
}