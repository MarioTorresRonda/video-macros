import { fromFileNamePath } from "@/nameFormats/main";
import { encodeBase62 } from "@/util/base62";
import { openDB, readDB } from "@/util/sqliteUtils";
import { NextResponse } from "next/server";
const fs = require('fs');

export async function GET(request) {
  
    const searchParams = request.nextUrl.searchParams;

    const dirPath = searchParams.get('dirPath');
    if ( !dirPath ) {
        return NextResponse.json({ message : "dirPath invalid"  }, { status: 422 });
    }

    let fileName = searchParams.get('fileName');
    if ( !fileName ) {
        return NextResponse.json({ message : "newFileName invalid"  }, { status: 422 });
    }
    let newName = fileName.substr(0, fileName.lastIndexOf(".") );
    let newType = fileName.substr( fileName.lastIndexOf(".") );
    let oldFileName = fileName;

    const com = searchParams.get('com') == 1;
    let oldFileNameCOM = `${newName}_COM${newType}`;

    const db = await openDB();

    let id = 0;
    const maxIdResult = await readDB( db, 'SELECT max(id) FROM videos;')
    id = maxIdResult[0]["max(id)"] ? Number( maxIdResult[0]["max(id)"] ) + 1 : 0;
    console.log( "next id is: " + id);

    fileName = `${newName}›${encodeBase62(id)}${newType}`
    let fileNameCOM = `${newName}›${encodeBase62(id)}_COM${newType}`;

    const query = `INSERT INTO videos (id, format, fields, fullName) VALUES ( '${id}', '', '[]', '${fileName}' )`
    await db.exec(query)
    console.log( "Inserted video data: " + query);

    try{
        console.log( `Renaming files: ${dirPath + "\\" + oldFileName} to ${dirPath}\\${fileName} ${ com ? `AND ${dirPath + "\\" + oldFileNameCOM} to ${dirPath}\\${fileNameCOM} ` : "" }.  ` )
        fs.renameSync(dirPath + "\\" + oldFileName,  `${dirPath}\\${fileName}`);
        if ( com ) {
            fs.renameSync(dirPath + "\\" + oldFileNameCOM,  `${dirPath}\\${fileNameCOM}`);
        }
    }catch(e) {
        return NextResponse.json(e, { status: 422 });
    }

    let oldFiles = fs.readFileSync('./public/oldVideos.data', { encoding: 'utf8', flag: 'r' });
    oldFiles = oldFiles.split("\n");

    const index = oldFiles.map( file => file.substr(0, file.indexOf("■") == -1 ? file.length : file.indexOf("■") ) ).findIndex( (oldFile) => oldFile == fromFileNamePath(oldFileName) );
    if ( index != -1 ) {
        const oldFormat = oldFiles[index].substr( oldFiles[index].indexOf("■") + 1,  oldFiles[index].length - ( oldFiles[index].indexOf("■") + 1 ) )
        oldFiles[index] = `${fromFileNamePath(fileName)}■${oldFormat}`;
    }
    fs.writeFileSync( './public/oldVideos.data', oldFiles.join("\n") );
        
    return NextResponse.json({ message : "file renamed" }, { status: 200 });
}