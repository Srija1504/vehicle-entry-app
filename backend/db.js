const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./vehicle.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        vehicleNumber TEXT,
        fitnessDate TEXT,
        insuranceDate TEXT,
        permitDate TEXT,
        taxDate TEXT,
        mobile TEXT,
        owner TEXT
    )`);
});

module.exports = db;
