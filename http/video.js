import { apiCall, blobCall } from "./main";

export async function fetchVideos( params, body ) {
    const resData = await apiCall( `/api/video/list?dirPath=${encodeURIComponent(params.url)}&formattedPath=${encodeURIComponent(params.formattedUrl)}&uploadPath=${encodeURIComponent(params.uploadUrl)}&videoTypes=${encodeURIComponent(params.types)}` , body);
    return resData;
}

export async function fetchMergeVideos( params, body ) {
    const resData = await apiCall( `/api/video/mergeList` , body);
    return resData;
}

export async function displayVideo( params, body ) {
    body = { headers: { 'Content-Type': 'video/mkv' }, ...body }
    let response =  await blobCall( `/api/video/display?videoPath=${encodeURIComponent(params.url)}`, body);
    return response.url;
}

export async function renameVideo( params, body ) {
    const resData = await apiCall( `/api/video/rename?dirPath=${encodeURIComponent(params.dirPath)}&oldFileName=${encodeURIComponent(params.oldFileName)}&newFileName=${encodeURIComponent(params.newFileName)}&formatName=${encodeURIComponent(params.formatName)}&jsonFields=${encodeURIComponent(params.jsonFields)}` , body);
    return resData;
}

export async function compressVideo( params, body ) {
    const resData = await apiCall( `/api/video/compress?dirPath=${encodeURIComponent(params.mainFolder)}&fileName=${encodeURIComponent(params.fileName)}`, body);
    return resData;
}

export async function moveVideo( params, body ) {
    const resData = await apiCall( `/api/video/move?dirPath=${encodeURIComponent(params.dirPath)}&newDirPath=${encodeURIComponent(params.newDirPath)}&fileName=${encodeURIComponent(params.fileName)}` , body);
    return resData;
}

export async function comVideo( params, body ) {
    const resData = await apiCall( `/api/video/com?dirPath=${encodeURIComponent(params.mainFolder)}&fileName=${encodeURIComponent(params.fileName)}`, body);
    return resData;
}

export async function setIDVideo( params, body ) {
    const resData = await apiCall( `/api/video/setID?dirPath=${encodeURIComponent(params.mainFolder)}&fileName=${encodeURIComponent(params.fileName)}&com=${encodeURIComponent(params.com)}`, body);
    return resData;
}

export async function mergeVideo( params, body ) {

    const filesCount = params.files.length;
    const filesParams = params.files.map( ( file, index) => `file${index}=${encodeURIComponent(file)}` ).join("&")

    const resData = await apiCall( `/api/video/merge?dirPath=${encodeURIComponent(params.dirPath)}&uploadPath=${encodeURIComponent(params.uploadUrl)}&newFileName=${encodeURIComponent(params.newFileName)}&filesCount=${filesCount}&${filesParams}` , body);
    return resData;
}

export async function deleteVideo( params, body ) {
    const resData = await apiCall( `/api/video/delete?dirPath=${encodeURIComponent(params.mainFolder)}&fileName=${encodeURIComponent(params.fileName)}&com=${encodeURIComponent(params.com)}`, body);
    return resData;
}

export async function infoVideo( params, body ) {
    const resData = await apiCall( `/api/video/info?dirPath=${encodeURIComponent(params.mainFolder)}&fileName=${encodeURIComponent(params.fileName)}`, body);
    return resData;
}

export async function fetchInfoVideos( params, body ) {

    console.log( params );

    const InfoVideos = {};

    const mainVideos = params.mainVideos;
    for (let index = 0; index < mainVideos.length; index++) {
        const video = mainVideos[index];
        InfoVideos[video] = (await infoVideo( { mainFolder : params.mainFolder, fileName: video }, body )).message.format;
    }
    
    const uploadVideos = params.uploadVideos;
        for (let index = 0; index < uploadVideos.length; index++) {
        const video = uploadVideos[index];
        InfoVideos[video] = (await infoVideo( { mainFolder : params.uploadFolder, fileName: video }, body )).message.format;
    }

    return InfoVideos;
}
