'use strict';

const sql = require('mssql');

const config = {
    user: 'watchsys',
    password: 'w2qLq4T@qLq',
    server: '103.12.1.183',
    database: 'db_watchapp',
    port: 62365,
    options: {
        encrypt: false, // Set to true if you're on Azure
        enableArithAbort: true // Required for some configurations
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to MSSQL');
    
    } catch (err) {
        console.error('Error connecting to MSSQL:', err);
    }
}

// To close the pool gracefully on process exit
process.on('SIGINT', async () => {
    try {
        await sql.close();
        console.log('Database connection closed');
    } catch (err) {
        console.error('Error closing the database connection:', err);
    }
    process.exit();
});

connectToDatabase();

module.exports = {
    connectToDatabase
};
