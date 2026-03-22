const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { platform } = require('node:process');

import { fromString, videoFileType } from "@/lib/utils/videoFileType";
import { fromFileNamePath } from "@/nameFormats/main";
import { NextResponse } from "next/server";

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
    spawnOptions.cwd = dirPath;

    var videoAPI = spawn('C:\\Users\\mario\\Videos\\run.bat', spawnOptions);
    videoAPI.stdout.setEncoding('utf8');

    videoAPI.stdout.on('data', function (data) {
      console.log( data );
      const rows = data.split("\n");
      if ( rows.find( (row) => { return row.indexOf("0: compress file") != -1 } ) ) {
        videoAPI.stdin.write("0\n");
      }
      const selectedRow = rows.find( (row) => { return row.indexOf(fileName) != -1 } )
      if ( selectedRow ) {
        const selectedRowId = selectedRow.substr( 1, selectedRow.indexOf("]" ) - 1 )
        console.log( selectedRowId )
        videoAPI.stdin.write( selectedRowId + "\n");
      }
    });

    videoAPI.stderr.on('data', function (data) {
      console.log(data);
    });
        
    return NextResponse.json({ message : "text" }, { status: 200 });
}

const spawnOptions = {
    shell: true,
    stdio: [
        'pipe', // StdIn.
        'pipe',    // StdOut.
        'pipe',    // StdErr.
    ],
};