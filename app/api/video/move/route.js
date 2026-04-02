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

    const newDirPath = searchParams.get('newDirPath');
    if ( !newDirPath ) {
        return NextResponse.json({ message : "newDirPath invalid"  }, { status: 422 });
    }

    let fileName = searchParams.get('fileName');
    if ( !fileName ) {
        return NextResponse.json({ message : "fileName invalid"  }, { status: 422 });
    }

    try{
        fs.renameSync(dirPath + "\\" + fileName, newDirPath + "\\" + fileName);
    }catch(e) {
        return NextResponse.json(e, { status: 422 });
    }
        
    return NextResponse.json({ message : "file moved" }, { status: 200 });
}