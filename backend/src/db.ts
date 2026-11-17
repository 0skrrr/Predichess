
// Stanovení spojení

import mariadb from "mariadb";




export const pool = mariadb.createPool({
    host: 	"db.dw321.endora.cz",
    port: 3306,
    user: "predichess_cz1",
    password: "ad:RKpQ28",
    database: "predichess_database",
    connectionLimit: 5
});



// External
/*
export const pool = mariadb.createPool({
    host: 	"db.dw321.endora.cz",
    port: 3306,
    user: "predichess_cz1",
    password: "ad:RKpQ28",
    database: "predichess_database",
    connectionLimit: 5
});
 */




// Local
/*
export const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'predichess_database',
    connectionLimit: 5
});

 */