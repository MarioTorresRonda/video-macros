import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { fromFileNamePath } from "@/nameFormats/main";
import { decodeBase62, encodeBase62 } from "@/util/base62";
import { openDB, readDB } from "@/util/sqliteUtils";
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
    let oldName = oldFileName.substr(0, oldFileName.lastIndexOf(".") );


    let newFileName = searchParams.get('newFileName');
    let formatName = searchParams.get('formatName');
    if ( !newFileName ) {
        return NextResponse.json({ message : "newFileName invalid"  }, { status: 422 });
    }
    let newName = newFileName.substr(0, newFileName.lastIndexOf(".") );
    let newType = newFileName.substr( newFileName.lastIndexOf(".") );

    let jsonFields = searchParams.get('jsonFields');
    if ( !jsonFields ) {
        return NextResponse.json({ message : "jsonFields invalid"  }, { status: 422 });
    }

    const db = await openDB();

    let id = 0;
    if ( oldName.indexOf("›") != -1 ) {
        id = decodeBase62( oldName.substr( oldName.indexOf("›") + 1 ) );
        console.log( "video with id in fileName");

    }else{
        const result = await readDB( db, 'SELECT max(id) FROM videos;')
        id = result[0]["max(id)"] ? Number( result[0]["max(id)"] ) + 1 : 0;
        console.log( "video without id in fileName");
    }
    
    newFileName = `${newName}›${encodeBase62(id)}${newType}`

    const result = await readDB( db, `SELECT id FROM videos where id = ${id};`)
    if ( result.length == 1 ) {
        console.log( "Updated video data");
        await db.exec(`UPDATE videos SET format = '${formatName}', fields = '${jsonFields}', fullName = '${newFileName}' where id = '${id}' `)
    }else{
        const query = `INSERT INTO videos (id, format, fields, fullName) VALUES ( '${id}', '${formatName}', '${jsonFields}', '${newFileName}' )`
        console.log( "Inserted video data: " + query);
        await db.exec(query)
    }

    try{
        fs.renameSync(dirPath + "\\" + oldFileName,  `${dirPath}\\${newFileName}`);
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