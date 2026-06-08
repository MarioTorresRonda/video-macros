import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { openDB, readDB } from "@/util/sqliteUtils";
import { NextResponse } from "next/server";
const fs = require('fs');
const path = require('path');
const { platform } = require('node:process');

export async function GET(request) {

    const mergeFiles = await getMergeFiles();

    return NextResponse.json({ message : { mergeFiles: mergeFiles  } }, { status: 200 });
}


async function getMergeFiles()  {
    const db = await openDB();
    const result = await readDB( db, 'SELECT m.mergeID, m.videoID, v.fullName FROM merge m, videos v where m.videoID = v.id;');
    const mergeFiles = {};
    result.forEach( (row) => {
        if ( mergeFiles[row.mergeID] )  {
            mergeFiles[row.mergeID].push( { videoID: row.videoID, fullName : row.fullName } )
        }else{
            mergeFiles[row.mergeID] = [ { videoID: row.videoID, fullName : row.fullName } ]
        }
    });
    return mergeFiles;
}