import { createDB, openDB } from "@/util/sqliteUtils";
import { NextResponse } from "next/server";

export async function GET(request) {

    const db = await openDB();
    await createDB( db );

    return NextResponse.json({ message : "database created" }, { status: 200 });
}

