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
      await db.exec('CREATE TABLE options (param TEXT, value TEXT)')
      await db.exec('INSERT INTO options VALUES ("mainFolder", "C:\\Users\\mario\\Videos")')
      await db.exec('INSERT INTO options VALUES ("formattedFolder", "C:\\Users\\mario\\Videos\\F")')
      await db.exec('INSERT INTO options VALUES ("uploadFolder", "C:\\Users\\mario\\Videos\\Subir")')
  }
  
  result = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='videos';`)
  if ( result.length == 0) {
      await db.exec('CREATE TABLE videos (id TEXT, format TEXT, fields TEXT, fullName TEXT )')
  }

  result = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='compress';`)
  if ( result.length == 0) {
      await db.exec('CREATE TABLE compress ( dirPath TEXT, fileName TEXT )')
  }

    result = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='merge';`)
  if ( result.length == 0) {
      await db.exec('CREATE TABLE merge ( mergeID TEXT, videoID TEXT )')
  }
} 