import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { fromFileNamePath } from "@/nameFormats/main";
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

    const optionsObj = {
        "mainFolder" : mainFolder,
        "formattedFolder" : formattedFolder
    }

    fs.writeFileSync( './public/options.json', JSON.stringify(optionsObj)  );
        
    return NextResponse.json({ message : "options updated" }, { status: 200 });
}