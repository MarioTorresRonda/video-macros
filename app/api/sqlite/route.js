import { createDB, openDB } from "@/util/sqliteUtils";
import { NextResponse } from "next/server";

export async function GET(request) {

    try{

        const db = await openDB();
        await createDB( db );
        
        return NextResponse.json({ message : "database created" }, { status: 200 });
    }catch(e) {
        return NextResponse.json({ message : "error: " + e }, { status: 402 });
    }
}