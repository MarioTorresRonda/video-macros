
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

import { NextResponse } from "next/server";


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

    const response = await commandFFProbe( dirPath, fileName )
    return NextResponse.json({ message : response }, { status: 200 });
}

async function commandFFProbe( dirPath, fileName ) {
    const { stdout } = await execAsync(`ffprobe -v error -print_format json -show_format "${dirPath}\\${fileName}"`);
    return JSON.parse( stdout );
}