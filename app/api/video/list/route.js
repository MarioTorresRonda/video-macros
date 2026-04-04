import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { NextResponse } from "next/server";
const fs = require('fs');
const path = require('path');
const { platform } = require('node:process');

export async function GET(request) {
    
    let oldFiles = fs.readFileSync('./public/oldVideos.data', { encoding: 'utf8', flag: 'r' });
    oldFiles = oldFiles.split("\n");
    oldFiles = oldFiles.map( oldFile => oldFile.replace("\r", "") )

    const searchParams = request.nextUrl.searchParams;

    const dirPath = searchParams.get('dirPath');
    if ( !dirPath ) {
        return NextResponse.json({ message : "dirPath invalid"  }, { status: 422 });
    }

    const formattedPath = searchParams.get('formattedPath');
    if ( !formattedPath ) {
        return NextResponse.json({ message : "formattedPath invalid"  }, { status: 422 });
    }

    const uploadPath = searchParams.get('uploadPath');
    if ( !uploadPath ) {
        return NextResponse.json({ message : "uploadPath invalid"  }, { status: 422 });
    }

    let videoTypes = searchParams.get('videoTypes');
    if ( !videoTypes ) {
        return NextResponse.json({ message : "videoTypes invalid"  }, { status: 422 });
    }
    videoTypes = videoFileType.fromString( videoTypes );

    const files = sortVideos( filterVideosTypes( fs.readdirSync(dirPath, 'utf8'), videoFileType.types.filter( type => videoTypes[type] ) ) );
    const formattedFiles = filterVideosTypes( fs.readdirSync(formattedPath, 'utf8'), [".mp4"] );
    const uploadFiles = sortVideos( filterVideosTypes( fs.readdirSync(uploadPath, 'utf8'), videoFileType.types.filter( type => videoTypes[type] ) ) );

    return NextResponse.json({ message : { videos: files, oldVideos: oldFiles, uploadVideos: uploadFiles, videosFormatted : formattedFiles  } }, { status: 200 });
}

function sortVideos( files ) {

    //Create group by date
    const fileGroups = {};
    files.forEach( fileName => {
        const fileGroupID = fileName.substring(0, 8);
        if ( fileGroups[fileGroupID] == null ) {
            fileGroups[fileGroupID] = [];
        }
        fileGroups[fileGroupID].push( { from: fileName } );
    } );

    Object.keys(fileGroups).forEach( fileGroupID => {
        fileGroups[fileGroupID].sort( sortGroupFunction );
    })

    let sortFiles = []
    Object.keys( fileGroups ).forEach( (fileGroupID) => {
        sortFiles = sortFiles.concat( fileGroups[fileGroupID] );
    })
    sortFiles = sortFiles.map( (item) => item.from )

    return sortFiles;
}

function sortGroupFunction( a, b ) {
    if ( filenameTypes.type1.isFormat( a.from ) ) {
        if ( filenameTypes.type1.isFormat( b.from ) ) {
            return filenameTypes.type1.extractNumber(a.from) - filenameTypes.type1.extractNumber(b.from);
        }
        return -1;
    }else if ( filenameTypes.type2.isFormat( a.from ) ) {
        if ( filenameTypes.type1.isFormat( b.from ) ) {
            return 1;
        }
        return -1;
    }else{
        if ( !filenameTypes.type3.isFormat( b.from ) ) {
            return 1;
        }
        return filenameTypes.type3.extractNumber( a.from ) - filenameTypes.type3.extractNumber( b.from );
    }
}

const filenameTypes = {
    type1: {
        //XXXXXXXX-01
        isFormat: (a) => { return a.indexOf("-") != -1 },
        extractNumber: (a) => { 
            let string = a.split("-")[1] ;
            string = string.substring( 0, string.indexOf(".") )
            return Number( string )
        }
    },
    type2: {
        //XXXXXXXX
        isFormat: (a) => { return a.indexOf("(") == -1 && a.indexOf("-") == -1 },
        extractNumber: (a) => { return 0; }
    },
    type3: {
        //XXXXXXXX (2)
        isFormat: (a) => { return a.indexOf("(") != -1 },
        extractNumber: (a) => { 
            let string = a.substring(9, a.indexOf(")") ).replaceAll( /([\(\)])/g , "" );
            return Number( string )
         }
    }
}

function filterVideosTypes( files, fileTypes ) {

    const filterType = []

    files.forEach( ( fileName ) => {
        const fileExtension = path.extname(fileName);
        let found = false;
        fileTypes.every( (type) => {
            if ( fileExtension == type ) {
                found = true;
                return false;
            }
            return true;
        } )
        if ( found ) {
            filterType.push( fileName );
        }
    } )

    return filterType;
}