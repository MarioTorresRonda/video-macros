const { spawn } = require('child_process');
import { NextResponse } from "next/server";
import { extractsAllCOMS } from "../list/route";

export async function GET(request) {
  
    const searchParams = request.nextUrl.searchParams;

    const dirPath = searchParams.get('dirPath');
    if ( !dirPath ) {
        return NextResponse.json({ message : "dirPath invalid"  }, { status: 422 });
    }

    const uploadPath = searchParams.get('uploadPath');
    if ( !uploadPath ) {
        return NextResponse.json({ message : "uploadPath invalid"  }, { status: 422 });
    }

    const newFileName = searchParams.get('newFileName');
    if ( !newFileName ) {
        return NextResponse.json({ message : "newFileName invalid"  }, { status: 422 });
    }

    const filesCount = searchParams.get('filesCount');
    if ( !filesCount ) {
        return NextResponse.json({ message : "filesCount invalid"  }, { status: 422 });
    }

    let files = new Array(filesCount);
    for (let index = 0; index < filesCount; index++) {
      const file = searchParams.get(`file${index}`);
      if ( !file ) {
          return NextResponse.json({ message : `file ${index} invalid`  }, { status: 422 });
      }
      files[index] = file;
    }

    const response = await videoApiPromise( dirPath, newFileName, files );
    
    const allComs = extractsAllCOMS( uploadPath )
    const filteredComs = allComs.filter( comFile =>  {
      console.log( comFile );
      return files.findIndex( file => { 
        const fileName =  file.split(".").slice(0, file.split(".").length - 1 ).join("")
        return comFile.indexOf( fileName ) != -1 
      } ) != -1
    } )

      const response2 = await videoApiPromise( dirPath, newFileName + "_COM", filteredComs );

    console.log(  );
    return NextResponse.json({ message : response }, { status: 200 });  
}

function videoApiPromise( dirPath, newFileName, files ) {
    
    let dataLog = [];
    const steps = {
      main: 0,
      file: 0,
      name: 0
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
          if ( !steps.file ) { return SelectFile( dataLog, videoAPI, steps, files ) }
          if ( !steps.name ) { return NameFile( dataLog, videoAPI, steps, newFileName ) }
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
  const find = "4: Merge videos";
  const findIndex = dataLog.findIndex( row => row.indexOf( find ) != -1 );
  if ( findIndex != -1 ) {
      videoAPI.stdin.write("4\n");
      steps.main = findIndex;
  }
}

function SelectFile( dataLog, videoAPI, steps, files ) {

  const find = "Select File:";

  const findIndex = dataLog.findIndex( row => row.indexOf( find ) != -1 );
  if ( findIndex != -1 ) {
    steps.file = findIndex;
    
    const selectedRowIds = [];
    files.forEach( fileName => {
      const selectedRow = dataLog.find( (row) => { return row.indexOf(fileName) != -1 } );
      if ( !selectedRow ) {
        throw new Error("Not found");
      }
      const selectedRowId = selectedRow.substr( 1, selectedRow.indexOf("]" ) - 1 )
      selectedRowIds.push( selectedRowId )
    } )


    videoAPI.stdin.write( selectedRowIds.join(" ") + "\n");
  }
}

function NameFile( dataLog, videoAPI, steps, newFileName ) {

  const find = "File name";

  const findIndex = dataLog.findIndex( row => row.indexOf( find ) != -1 );
  if ( findIndex != -1 ) {
    steps.name = findIndex;
    videoAPI.stdin.write( newFileName + "\n");
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