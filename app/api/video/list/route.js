import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { NextResponse } from "next/server";
const fs = require('fs');
const path = require('path');
const { platform } = require('node:process');

export async function GET(request) {
  
    const searchParams = request.nextUrl.searchParams;

    const dirPath = searchParams.get('dirPath');
    console.log( dirPath );
    if ( !dirPath ) {
        return NextResponse.json({ message : "dirPath invalid"  }, { status: 422 });
    }

    let videoTypes = searchParams.get('videoTypes');
    if ( !videoTypes ) {
        return NextResponse.json({ message : "videoTypes invalid"  }, { status: 422 });
    }
    videoTypes = videoFileType.fromString( videoTypes );

    const files = fs.readdirSync(dirPath, 'utf8');
    const filterType = []
    files.forEach( ( fileName ) => {
        const fileExtension = path.extname(fileName);
        let found = false;
        videoFileType.types.every( (type, index) => {
            if ( videoTypes[type] && fileExtension == type ) {
                found = true;
                return false;
            }
            return true;
        } )
        if ( found ) {
            filterType.push( fileName );
        }
    } )


    return NextResponse.json({ message : filterType }, { status: 200 });
}