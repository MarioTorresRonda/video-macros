import { createDB, openDB, readDB } from "@/util/sqliteUtils";
import { NextResponse } from "next/server";

export async function GET(request) {

    const db = await openDB();
    const result = await readDB( db, 'SELECT * FROM options;');
    const options = {};
    result.forEach( (row) => {
        options[row.param] = row.value;
    });

    return NextResponse.json({ message : JSON.stringify( options ) }, { status: 200 });
}

