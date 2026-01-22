export const lolApi = `/api/LoL`;

export async function apiCall( url, body ) {
    const response = await fetch( url, body);
    
    if ( !response.ok ) {
        let error = new Error('Failed server call');; 

        try {
            const resData = await response.json();
            console.log( resData );
            if ( resData.message ) {
                error = new Error( resData.message );
            }
        } catch (error) { }

        throw error;
    }

    return await response.json();
}

export async function blobCall( url, body ) {
    const response = await fetch( url, body);

    if ( !response.ok ) {
        let error = new Error('Failed server call');; 

        try {
            const resData = await response.json();
            console.log( resData );
            if ( resData.message ) {
                error = new Error( resData.message );
            }
        } catch (error) { }

        throw error;
    }

    return response;
}

export function postBodyJSON( body, json ) {
    
    return {
        ...body,
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify( json )
    }
}