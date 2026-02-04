import { apiCall, blobCall } from "./main";

export async function fetchVideos( params, body ) {
    const resData = await apiCall( `/api/video/list?dirPath=${encodeURIComponent(params.url)}&videoTypes=${encodeURIComponent(params.types)}` , body);
    return resData;
}

export async function displayVideo( params, body ) {
    body = { headers: { 'Content-Type': 'video/mkv' }, ...body }
    let response =  await blobCall( `/api/video/display?videoPath=${encodeURIComponent(params.url)}`, body);
    console.log( response.url )
    return response.url;
}

export async function renameVideo( params, body ) {
    const resData = await apiCall( `/api/video/rename?dirPath=${encodeURIComponent(params.dirPath)}&oldFileName=${encodeURIComponent(params.oldFileName)}&newFileName=${encodeURIComponent(params.newFileName)}&formatName=${encodeURIComponent(params.formatName)}` , body);
    return resData;
}