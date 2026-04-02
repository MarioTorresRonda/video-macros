const { spawn } = require('child_process');
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

    const response = await videoApiPromise( dirPath, fileName );

    return NextResponse.json({ message : response }, { status: 200 });  
}

function videoApiPromise( dirPath, fileName ) {
    
    let dataLog = [];
    const steps = {
      main: 0,
      file: 0
    }


    spawnOptions.cwd = dirPath;

    var videoAPI = spawn('C:\\Users\\mario\\Videos\\run.bat', spawnOptions);
    videoAPI.stdout.setEncoding('utf8');

    return new Promise((resolve) => {
      videoAPI.stdout.on('data', function (data) {
        console.log( data );
        dataLog.push( ...data.split("\n") );

        try{
          if ( !steps.main ) { return SelectCompress( dataLog, videoAPI, steps ) }
          if ( !steps.file ) { return SelectFile( dataLog,  videoAPI, steps, fileName ) }
          return EndAfterCompress( dataLog, steps )
        }catch(e) {
            console.log( `${e.message}, ending task...` );
            videoAPI.stdin.pause();
            videoAPI.kill();
        }        
      });

      videoAPI.stderr.on('data', function (data) {
        console.log(data);
      });

      videoAPI.stderr.on('close', function () {
        resolve( "finished" );
      });
    })
}

function SelectCompress( dataLog, videoAPI, steps ) {
  const find = "0: compress file";
  const findIndex = dataLog.findIndex( row => row.indexOf( find ) != -1 );
  if ( findIndex != -1 ) {
      videoAPI.stdin.write("0\n");
      steps.main = findIndex;
  }
}

function SelectFile( dataLog, videoAPI, steps, fileName ) {

  const find = "Select File:";

  const findIndex = dataLog.findIndex( row => row.indexOf( find ) != -1 );
  if ( findIndex != -1 ) {
    steps.file = findIndex;
    
    const selectedRow = dataLog.find( (row) => { return row.indexOf(fileName) != -1 } );
    if ( !selectedRow ) {
      throw new Error("Not found");
    }
    const selectedRowId = selectedRow.substr( 1, selectedRow.indexOf("]" ) - 1 )
    videoAPI.stdin.write( selectedRowId + "\n");
  }
}

function EndAfterCompress( dataLog, steps ) {
  const find = "0: compress file";
  const findIndex = dataLog.slice(steps.file).findIndex( row => row.indexOf( find ) != -1 );
  if ( findIndex != -1 ) {
      throw new Error("Finished");
      steps.main = findIndex;
  }
}

const spawnOptions = {
    shell: true,
    stdio: [
        'pipe', // StdIn.
        'pipe',    // StdOut.
        'pipe',    // StdErr.
    ],
};