import { fromString, videoFileType } from "@/lib/utils/videoFileType";
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
    if ( !newFileName ) {
        return NextResponse.json({ message : "newFileName invalid"  }, { status: 422 });
    }

    try{
        fs.renameSync(dirPath + "\\" + oldFileName, dirPath + "\\" + newFileName);
    }catch(e) {
        return NextResponse.json(e, { status: 422 });
    }
        
    return NextResponse.json({ message : "file renamed" }, { status: 200 });
}