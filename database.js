const sqlite3 = require("sqlite3").verbose();

// Create and connect to the database
const db = new sqlite3.Database("./groups.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to the database.");
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      group_id INTEGER,
      FOREIGN KEY (group_id) REFERENCES groups (id)
    )
  `);

  // Insert sample data
  db.run(`INSERT INTO groups (name) VALUES ('Trip to Paris')`);
  db.run(`INSERT INTO friends (name, group_id) VALUES 
    ('Alice', 1), 
    ('Bob', 1), 
    ('Charlie', 1)
  `);
});

module.exports = db;
