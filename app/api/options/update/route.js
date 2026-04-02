import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { fromFileNamePath } from "@/nameFormats/main";
import { openDB } from "@/util/sqliteUtils";
import { NextResponse } from "next/server";
const fs = require('fs');
const path = require('path');
const { platform } = require('node:process');

export async function GET(request) {
  
    const searchParams = request.nextUrl.searchParams;

    const mainFolder = searchParams.get('mainFolder');
    if ( !mainFolder ) {
        return NextResponse.json({ message : "mainFolder invalid"  }, { status: 422 });
    }

    const formattedFolder = searchParams.get('formattedFolder');
    if ( !formattedFolder ) {
        return NextResponse.json({ message : "formattedFolder invalid"  }, { status: 422 });
    }

    const uploadFolder = searchParams.get('uploadFolder');
    if ( !uploadFolder ) {
        return NextResponse.json({ message : "uploadFolder invalid"  }, { status: 422 });
    }
    
    const db = await openDB();
    await db.exec(`INSERT INTO options VALUES ("mainFolder", ${mainFolder})`)
    await db.exec(`INSERT INTO options VALUES ("formattedFolder", ${formattedFolder})`)
    await db.exec(`INSERT INTO options VALUES ("uploadFolder", ${uploadFolder})`)
        
    return NextResponse.json({ message : "options updated" }, { status: 200 });
}