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

    let fileName = searchParams.get('fileName');
    if ( !fileName ) {
        return NextResponse.json({ message : "fileName invalid"  }, { status: 422 });
    }

    let com = searchParams.get('com');

    try{
        fs.rmSync(dirPath + "\\" + fileName);
        if ( com == 1 ) {
            const fileNameSplit = fileName.split(".");
            const file = fileNameSplit.slice(0, fileNameSplit.length - 1 ).join("."); 
            const type = fileNameSplit[ fileNameSplit.length - 1 ]; 
            fs.rmSync(dirPath + "\\" + file+"_COM."+type);
        }
    }catch(e) {
        return NextResponse.json(e, { status: 422 });
    }

        
    return NextResponse.json({ message : "file renamed" }, { status: 200 });
}