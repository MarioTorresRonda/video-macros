import { apiCall, blobCall } from "./main";

export async function readOptions( params, body ) {
    const resData = await apiCall( `/api/options/read` , body);
    return resData;
}

export async function updateOptions( params, body ) {
    const resData = await apiCall( `/api/options/update?mainFolder=${encodeURIComponent(params.mainFolder)}&formattedFolder=${encodeURIComponent(params.formattedFolder)}`, body);
    return resData;
}

