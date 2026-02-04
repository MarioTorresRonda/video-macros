import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { fromFileNamePath } from "@/nameFormats/main";
import { NextResponse } from "next/server";
const fs = require('fs');
const path = require('path');
const { platform } = require('node:process');

export async function GET(request) {
  
    const searchParams = request.nextUrl.searchParams;

    const dirPath = searchParams.get('dirPath');
    if ( !dirPath ) {
        return NextResponse.json({ message : "dirPath invalid"  }, { status: 422 });
    }

    let oldFileName = searchParams.get('oldFileName');
    if ( !oldFileName ) {
        return NextResponse.json({ message : "oldFileName invalid"  }, { status: 422 });
    }

    let newFileName = searchParams.get('newFileName');
    let formatName = searchParams.get('formatName');
    if ( !newFileName ) {
        return NextResponse.json({ message : "newFileName invalid"  }, { status: 422 });
    }

    try{
        fs.renameSync(dirPath + "\\" + oldFileName, dirPath + "\\" + newFileName);
    }catch(e) {
        return NextResponse.json(e, { status: 422 });
    }

    let oldFiles = fs.readFileSync('./public/oldVideos.data', { encoding: 'utf8', flag: 'r' });
    oldFiles = oldFiles.split("\n");

    const index = oldFiles.map( file => file.substr(0, file.indexOf("■") == -1 ? file.length : file.indexOf("■") ) ).findIndex( (oldFile) => oldFile == fromFileNamePath(oldFileName) );
    if ( index != -1 ) {
        oldFiles[index] = `${fromFileNamePath(newFileName)}■${formatName}`;
    }else{
        oldFiles.push( `${fromFileNamePath(newFileName)}■${formatName}`  )
    }
    fs.writeFileSync( './public/oldVideos.data', oldFiles.join("\n") );
        
    return NextResponse.json({ message : "file renamed" }, { status: 200 });
}