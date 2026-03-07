import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// import { line } from "strip-comments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FOLDER = path.resolve(__dirname, "./db");
const DB_PATH = path.join(DB_FOLDER, "database.sqlite");
const SCHEMA_FILE = path.join(__dirname, "game.sql");

export class GameState {
    constructor() {
        this.id = 0;
        this.waitingMatch = false;
        this.intour = false;
        this.now = Date.now();
        this.last = Date.now();
        this.P1_Id = null;
        this.P2_Id = null;
        this.P3_Id = null;
        this.P4_Id = null;
        this.gameStatus = "PENDING";
        this.T_Id = null;
        this.count_players = 1;
        this.mode = 2;
        this.Ball_x = 400;
        this.Ball_y = 300;
        this.Ball_dx = 2;
        this.Ball_dy = 2;
        this.ball_radius = 8;
        this.sizePaddle_width = 15;
        this.sizePaddle_height = 100;
        this.width = 800;
        this.height = 600;
        this.Player1_x = 20;
        this.Player1_y = 250;
        this.Player2_x = 765;
        this.Player2_y = 250;
        this.Player3_x = 60;
        this.Player3_y = 250;
        this.Player4_x = 725;
        this.Player4_y = 250;
        this.Winner_Id = null;
        this.score1 = 0;
        this.score2 = 0;
        this.player1Name = null;
        this.player2Name = null;
        this.player3Name = null;
        this.player4Name = null;
        this.p1UPkey = false;
        this.p1Downkey = false;
        this.p2UPkey = false;
        this.p2Downkey = false;
        this.p3UPkey = false;
        this.p3Downkey = false;
        this.p4UPkey = false;
        this.p4Downkey = false;
    }
}

export class Match {
    constructor() {
        this.id = 0;
        this.P1_Id = null;
        this.P2_Id = null;
        this.P3_Id = null;
        this.P4_Id = null;
        this.score1 = 0;
        this.score2 = 0;
        this.mode = 2;
        this.count_players = 1;
        this.CreatedAt = new Date();
        this.gameStatus = "PENDING";
        this.Winner_Id = null;
        this.T_Id = null;
    }
}

export class SQLiteDB {

    constructor() {
        this.db = null;
    }
    async connect() {
        try {
            if (!fs.existsSync(DB_FOLDER)) {
                fs.mkdirSync(DB_FOLDER, { recursive: true });
                console.log(`[DB] Created folder: ${DB_FOLDER}`);
            }
            this.db = await open({
                filename: DB_PATH,
                driver: sqlite3.Database,
            });
            const tables = await this.db.all(`SELECT name FROM sqlite_master WHERE type='table';`);
            if (!tables.length) {
                console.log("[DB] No tables found. Initializing schema...");
                const schema = fs.readFileSync(SCHEMA_FILE, "utf8");
                await this.db.exec(schema);
                console.log("[DB] Schema created!");
            } else {
                console.log("[DB] Tables already exist:", tables.map(t => t.name).join(", "));
            }
            this.db.on("trace", sql => {
                // console.log("[SQL]:", sql);
            });

            console.log(`[DB] Connected successfully at ${DB_PATH}`);

        } catch (err) {
            console.error("[DB] Failed to initialize database:", err);
            throw err;
        }
    }

    async createVIPMatch(m) {
        const result = await this.db.run(`INSERT INTO Match (P1_Id,P2_Id,count_players,T_Id) VALUES (?, ?,?,?);`, [m.P1_Id, m.P2_Id,2,m.T_Id]);
        return result.lastID;
    }
    async createMatch(m) {
        const result = await this.db.run(`INSERT INTO Match (P1_Id, T_Id, mode) VALUES (?, ?, ?);`, [m.P1_Id, m.T_Id, m.mode]);
        return result.lastID;
    }
    async createMatch_not(m) {
        const result = await this.db.run(`INSERT INTO Match (P1_Id, mode) VALUES (?, ?);`, [m.P1_Id, m.mode]);
        return result.lastID;
    }

    async getPlayerMatches(id) {
        return this.db.all(`SELECT * FROM Match  WHERE gameStatus != 'PENDING' AND (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [id, id, id, id]);
    }
    async getMatchById(id) {
        return this.db.get(`SELECT * FROM Match WHERE id = ?;`, [id]);
    }
    async getOpenRoom(mode) {
        return this.db.get(`SELECT * FROM Match   
                            WHERE mode = ? and   
                            count_players <  mode   and 
                            gameStatus = 'PENDING'  
                            LIMIT 1;`, [mode]);
    }
    async deletePendingMatchByPlayerID(id) {
        let x = -1;
        let matchid = await this.db.get(`select id from 
        Match 
        where (P1_Id = ? or  P2_Id = ? or  P3_Id = ? or  P4_Id = ? )
        AND 
        gameStatus = 'PENDING';`, [id,id,id,id]);
        if (matchid)
            x = matchid.id;
        await this.db.get(`UPDATE
        Match 
        SET P1_Id = NULL , count_players = count_players - 1
        WHERE (P1_Id = ?)
        AND 
        gameStatus = 'PENDING';`, [id]);
        await this.db.get(`UPDATE
        Match 
        SET P2_Id = NULL , count_players = count_players - 1
        WHERE P2_Id = ?
        AND 
        gameStatus = 'PENDING';`, [id]);
        await this.db.get(`UPDATE
        Match 
        SET P3_Id = NULL, count_players = count_players - 1
        WHERE P3_Id = ?
        AND 
        gameStatus = 'PENDING';`, [id]);
        await this.db.get(`UPDATE
        Match 
        SET P4_Id = NULL, count_players = count_players - 1
        WHERE P4_Id = ?
        AND 
        gameStatus = 'PENDING';`, [id]);
        await this.db.get(`DELETE FROM Match WHERE count_players <= 0;`);
        return this.db.get(`select * from Match where id  = ?;`, [x]);
    }
    
    async getOngoingMatch(id) {
        return this.db.get(`SELECT *
        FROM Match
        WHERE (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?) and 
        gameStatus != 'FINISHED' 
        ORDER BY CreatedAt DESC
        LIMIT 1;
        `, [id, id, id, id]);
    }

    async getLasttMatchByPlayerID(id) {
        return this.db.get(`SELECT *
        FROM Match
        WHERE (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?) 
        ORDER BY CreatedAt DESC
        LIMIT 1;
        `, [id, id, id, id]);
    }

    async updateMatch(m) {
        await this.db.run(`
            UPDATE Match SET
                P1_Id=?, P2_Id=?, P3_Id=?, P4_Id=?,
                score1=?, score2=?,
                gameStatus=?, Winner_Id=?, T_Id=?, 
                count_players=?
            WHERE id = ?
        `,
            [m.P1_Id, m.P2_Id, m.P3_Id, m.P4_Id,
            m.score1, m.score2,
            m.gameStatus, m.Winner_Id, m.T_Id,
            m.count_players,
            m.id]
        );
    }
    async getcurrentmatch(id)
    {
        return await  this.db.get(`SELECT * FROM Match WHERE gameStatus = 'PLAYING' and (P1_Id = ? OR P3_Id = ? OR P2_Id = ? OR P4_Id = ?)`, [id,id,id,id]);
    }
    
    async endmatch(id)
    {
        let m = await  this.db.get(`SELECT * FROM Match WHERE gameStatus = 'PLAYING' and (P1_Id = ? OR P3_Id = ? OR P2_Id = ? OR P4_Id = ?)`, [id,id,id,id]);
        await this.db.run(`update 
        Match
        set score1 = 5, score2 = 0, gameStatus = 'FINISHED'
        WHERE
        (P1_Id = ? OR P3_Id = ?);`, [id,id]);

        await this.db.run(`update 
        Match
        set score2 = 5, score1 = 0, gameStatus = 'FINISHED'
        WHERE
        ( P2_Id = ? OR P4_Id = ?);`, [id,id]);

        return m;
    }
    async getAvaiable(id)
    {
        return await this.db.get(`SELECT *
        FROM Match
        WHERE  gameStatus = 'PLAYING' and 
        (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [id,id,id,id]);
    }

    async UserCountWins_ayoub(id) {
        return await this.db.get(`SELECT count(*) as Winned  FROM  Match 
        Where (((P1_Id = ?  OR P3_Id = ?) and score1 >= score2 ) OR ((P2_Id = ?  OR P4_Id = ?)and score2 >= score1))  and gameStatus = 'FINISHED';`,[id,id,id,id]);
    }
    
    async UserCountTournWins_ayoub(id) {
        return await this.db.get(`SELECT count(*) as Winned  FROM  Match 
        Where (((P1_Id = ?  OR P3_Id = ?) and score1 >= score2 ) OR ((P2_Id = ?  OR P4_Id = ?)and score2 >= score1))  and gameStatus = 'FINISHED';`,[id,id,id,id]);
    }

    async UserCountTournParticipation_ayoub(id) {
        return 0;
    }
    
    async UserCountMatches_ayoub(id) {
        return await this.db.run(`SELECT count(*) as Played  FROM  Match 
        Where (P1_Id = ?  OR P2_Id = ?  OR P3_Id = ?  OR P4_Id = ?);`, [id,id,id,id]);
    }


    async getLasttMatchByPlayerID_ayoub(id) {
        return this.db.get(`SELECT *
        FROM Match
        WHERE (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?) 
        ORDER BY CreatedAt DESC
        LIMIT 1;
        `, [id, id, id, id]);
    }
}

