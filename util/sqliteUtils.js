import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// you would have to import / invoke this in another file
export async function openDB() {
  return open({
    filename: '/etc/videoEncoder.db',
    driver: sqlite3.Database
  })
}

export async function readDB( db, query ) {
  return await db.all(query);
}

export async function createDB( db ) {
  
  let result;
  result = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='options';`)
  if ( result.length == 0) {
      console.log( "options table created" )
      await db.exec('CREATE TABLE options (param TEXT, value TEXT)')
      await db.exec('INSERT INTO options VALUES ("mainFolder", "C:\\Users\\mario\\Videos")')
      await db.exec('INSERT INTO options VALUES ("formattedFolder", "C:\\Users\\mario\\Videos\\F")')
      await db.exec('INSERT INTO options VALUES ("uploadFolder", "C:\\Users\\mario\\Videos\\Subir")')
  }
  
  result = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='options';`)

} 