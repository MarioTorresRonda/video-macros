import { openDB } from "@/util/sqliteUtils";
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

    const db = await openDB();
    const query = `INSERT INTO compress (dirPath, fileName) VALUES ( '${dirPath}', '${fileName}' )`
    console.log( "Inserted compress file: " + query);
    await db.exec(query)

    return NextResponse.json({ message : true }, { status: 200 });  
}