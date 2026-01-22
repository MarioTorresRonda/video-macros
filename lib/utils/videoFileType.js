const defaultObj = {
    ".mkv" : true,
    ".avi" : true,
    ".mp4" : true,
}

const types = Object.keys( defaultObj );

function fromString( string ) { 
    const newObj = {}
    types.forEach( (type,index) => {
        newObj[type] = string[index] == "1"
    });
    return newObj;
}

function toString( obj ) { 
    let string = ""
    types.forEach( (type,index) => {
        string += obj[type] ? 1 : 0;
    });
    return string;
}

export const videoFileType = {
    defaultObj,
    types,
    fromString,
    toString
}