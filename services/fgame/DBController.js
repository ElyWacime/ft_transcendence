import { open } from "sqlite";
import fs from "fs";
import sqlite3 from "sqlite3";

export class Users {
    constructor() {
        this.id = "email@email.email";
        this.email = "email@email.email";
        this.User_name = "User_name";
        this.User_password = "qwerty";
        this.loggedIn = true;
        this.Auto_Match = true;
        this.isOnline = true;
        this.avatar = 'https://www.gravatar.com/avatar/';
        this.CreatedAt = new Date();
        // this.UpdatedAt = new Date();
    }
}

export class Tournament {
    constructor() {
        this.id = 0;
        this.Label = "";
        this.CreatedAt = new Date();
        this.count_players = 0;
        this.max_players = 8;
        this.result = "WIN";
        this.Winner_Id = null;
    }
}

export class Participate_Tournament {
    constructor() {
        this.id = 0;
        this.P_Id = 0;
        this.T_Id = 0;
        this.CreatedAt = new Date();
    }
}

export class GameState {
    constructor() {
        this.id_Match = 0;
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
        this.Ball_dx = 1;
        this.Ball_dy = 1;
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
        this.round = 1;
        this.CreatedAt = new Date();
        this.gameStatus = "PENDING";
        this.Winner_Id = null;
        this.T_Id = null;
        this.player1Name = null;
        this.player2Name = null;
        this.player3Name = null;
        this.player4Name = null;
    }
}

export class SQLiteDB {

    constructor() {
        this.db = null;
    }
    async connect() {
        // Ensure container FS is writable for DB file and directory
        try {
            fs.mkdirSync("/app", { recursive: true });
            try { fs.accessSync("/app", fs.constants.W_OK); } catch { fs.chmodSync("/app", 0o777); }
        } catch (e) {
            console.warn("/app permission check failed:", e?.message || e);
        }

        this.db = await open({ 
            filename: "/app/database.sqlite", 
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
        });
        const schema = fs.readFileSync("game.sql", "utf8");
        // Apply base schema. Some legacy DBs may lack new columns; indexes requiring
        // them will be created after runtime migrations below.
        await this.db.exec(schema);
        //  Log every SQL statement executed
        // this.db.on("trace", (sql) => console.log("[SQL]", sql));
        console.log("Database connected and table created!");

        // Improve concurrency and avoid locking surprises
        try {
            await this.db.exec(`PRAGMA journal_mode=WAL;`);
            await this.db.exec(`PRAGMA synchronous=NORMAL;`);
            await this.db.exec(`PRAGMA busy_timeout=5000;`);
        } catch (e) {
            console.warn("SQLite pragmas failed:", e?.message || e);
        }

        // Sanity write test to catch readonly mounts early
        try {
            await this.db.exec(`CREATE TABLE IF NOT EXISTS __rw_probe(id INTEGER);`);
        } catch (e) {
            console.error("SQLite write probe failed:", e?.message || e);
            throw e;
        }

        // Runtime migration: ensure 'round' column exists on Match
        const cols = await this.db.all(`PRAGMA table_info('Match')`);
        const hasRound = cols.some(c => c.name === 'round');
        if (!hasRound) {
            await this.db.run(`ALTER TABLE Match ADD COLUMN round INTEGER NOT NULL DEFAULT 1`);
            console.log("Added 'round' column to Match table");
        }
        // Create composite index on (T_Id, round) once the column is guaranteed.
        try {
            await this.db.run(`CREATE INDEX IF NOT EXISTS idx_match_tournament_round ON Match(T_Id, round)`);
        } catch (e) {
            console.warn("Skipping idx_match_tournament_round creation:", e?.message || e);
        }
    }

    // -------------------------------
    // Tournament CRUD
    // -------------------------------
    async createTournament(t) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");//toISOString()
        const result = await this.db.run(`INSERT INTO Tournament (Label, CreatedAt, result, Winner_Id)
             VALUES (?, ?, ?, NULL)`, [t.Label, nowf, t.result]);
        return result.lastID;
    }
    async getTournaments() {
        return this.db.all(`SELECT * FROM Tournament`);
    }
    async getTournamentById(id) {
        return this.db.get(`SELECT * FROM Tournament WHERE id = ?`, [id]);
    }
    async updateTournament(id, t) {
        await this.db.run(`UPDATE Tournament 
             SET Label=?, count_players=?, result=?, Winner_Id=? 
             WHERE id = ?`, [t.Label, t.count_players, t.result, t.Winner_Id, id]);
    }
    async deleteTournament(id) {
        await this.db.run(`DELETE FROM Tournament WHERE id = ?`, [id]);
    }

    // -------------------------------
    // Match CRUD
    // -------------------------------
    async createMatch(m) {
        const result = await this.db.run(`INSERT INTO Match (P1_Id, T_Id, mode, round) VALUES (?, ?, ?, ?)`, [m.P1_Id, m.T_Id, m.mode, m.round ?? 1]);
        return result.lastID;
    }
    async createMatch_not(m) {
        const result = await this.db.run(`INSERT INTO Match (P1_Id, mode, round) VALUES (?, ?, ?)`, [m.P1_Id, m.mode, m.round ?? 1]);
        return result.lastID;
    }
    async getMatches() {
        return this.db.all(`SELECT * FROM Match`);
    }
    async getMatchById(id) {
        return this.db.get(`SELECT * FROM Match WHERE id = ?`, [id]);
    }
    async getMatchPlayerCanJoin(mode) {
        // console.log("*****************   CALLED    ******************");
        return this.db.get(`SELECT * FROM Match   
                            WHERE mode = ? and   
                            count_players <  mode   and 
                            gameStatus = 'PENDING'  
                            LIMIT 1;`, [mode]);
    }
    async getTournamentOpenMatch(tId) {
        return this.db.get(`SELECT * FROM Match
                            WHERE T_Id = ? AND mode = 2 AND count_players < mode AND gameStatus = 'PENDING'
                            ORDER BY round ASC, CreatedAt ASC
                            LIMIT 1;`, [tId]);
    }
    async getMatchesByTournamentAndRound(tId, round) {
        return this.db.all(`SELECT * FROM Match WHERE T_Id = ? AND round = ? ORDER BY id ASC`, [tId, round]);
    }
    async getTournamentMatches(tId) {
        return this.db.all(`SELECT * FROM Match WHERE T_Id = ? ORDER BY round ASC, id ASC`, [tId]);
    }
    async deletePendingMatchByPlayerID(id) {
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
        return await this.db.get(`DELETE FROM Match WHERE count_players <= 0;`);
    }

    async deleteOngoingMatchByPlayerID(id) {
        await this.db.get(`UPDATE
        Match SET  gameStatus = 'FINISHED'
        WHERE (P1_Id = ?)
        AND 
        gameStatus != 'FINISHED';`, [id]);
        await this.db.get(`UPDATE
        Match SET  gameStatus = 'FINISHED'
        WHERE (P2_Id = ?)
        AND 
        gameStatus != 'FINISHED';`, [id]);
        await this.db.get(`UPDATE
        Match SET  gameStatus = 'FINISHED'
        WHERE (P3_Id = ?)
        AND 
        gameStatus != 'FINISHED';`, [id]);
        return await this.db.get(`UPDATE
        Match SET  gameStatus = 'FINISHED'
        WHERE (P4_Id = ?)
        AND 
        gameStatus != 'FINISHED';`, [id]);
    }


    async getCurrentMatchByPlayerID(id) {
        return this.db.get(`SELECT *
        FROM Match
        WHERE (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?) and 
        gameStatus != 'FINISHED'
        ORDER BY CreatedAt DESC
        LIMIT 1;
        `, [id, id, id, id]);
    }
    async getOngoingMatchByPlayerID(id) {
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
    async getFinishedMatchByPlayerID(id) {
        return this.db.get(`SELECT *
        FROM Match
        WHERE  gameStatus = 'FINISHED' and 
        (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?)
        ORDER BY CreatedAt DESC
        LIMIT 1;
        `, [id, id, id, id]);
    }
    async updateMatch(m) {
        await this.db.run(`
            UPDATE Match SET
                P1_Id=?, P2_Id=?, P3_Id=?, P4_Id=?,
                score1=?, score2=?,
                gameStatus=?, Winner_Id=?, T_Id=?, round=?,
                count_players=?
            WHERE id = ?
        `,
            [m.P1_Id, m.P2_Id, m.P3_Id, m.P4_Id,
            m.score1, m.score2,
            m.gameStatus, m.Winner_Id, m.T_Id, m.round ?? 1,
            m.count_players,
            m.id]
        );
    }

    async deleteMatch(id) {
        await this.db.run(`DELETE FROM Match WHERE id = ?`, [id]);
    }

    // -------------------------------
    // Participate_Tournament CRUD
    // -------------------------------
    async createParticipate(p) {
        const result = await this.db.run(`INSERT INTO Participate_Tournament (P_Id, T_Id)
             VALUES (?, ?)`, [p.P_Id, p.T_Id]);
        return result.lastID;
    }
    async getParticipations() {
        return this.db.all(`SELECT * FROM Participate_Tournament`);
    }
    async getParticipationById(id) {
        return this.db.get(`SELECT * FROM Participate_Tournament WHERE id = ?`, [id]);
    }
    async getParticipantsByTournamentId(tId) {
        return this.db.all(`SELECT U.* FROM Participate_Tournament PT INNER JOIN Users U ON U.id = PT.P_Id WHERE PT.T_Id = ? ORDER BY PT.CreatedAt ASC`, [tId]);
    }
    async updateParticipation(id, p) {
        await this.db.run(`UPDATE Participate_Tournament SET 
                P_Id=?, T_Id=?
             WHERE id = ?`, [p.P_Id, p.T_Id, id]);
    }
    async deleteParticipation(id) {
        await this.db.run(`DELETE FROM Participate_Tournament WHERE id = ?`, [id]);
    }

    // -------------------------------
    // Users CRUD
    // -------------------------------
    
    async updateUsers(u) {
        await this.db.run(`UPDATE Users 
             SET 
             email = ? , User_name = ?,User_password = ?, loggedIn = ?,Auto_Match = ?,isOnline = ?,avatar = ? 
             WHERE id = ?`, [u.email, u.User_name, u.User_password, u.loggedIn, u.Auto_Match, u.isOnline, u.avatar, u.id]);
    }
    

    async createUsers(t) {
        // let a = await this.db.get(`SELECT * FROM Users WHERE User_name = ? OR email = ? or id = ? `, [t.User_name, t.email, t.id]);
        // update based on id only.
        let a = await this.db.get(`SELECT * FROM Users WHERE  id = ? `, [t.id]);
        if (a)
            return await this.db.run(`UPDATE Users 
            SET 
            email = ? , User_name = ?,User_password = ?, loggedIn = ?,Auto_Match = ?,isOnline = ?,avatar = ? 
            WHERE id = ?`, [t.email, t.User_name, t.User_password, t.loggedIn, t.Auto_Match, t.isOnline, t.avatar, t.id]);
        else
            return await this.db.run(`INSERT INTO Users (id, email, User_name,User_password, Auto_Match,avatar)
            VALUES (?,?, ?, ?, ?, ?)`, [t.id, t.email, t.User_name, t.User_password, 1 , t.avatar]);
    }

    // async createUsers(t) {
    //     let a = await this.db.get(`SELECT * FROM Users WHERE User_name = ? OR email = ? or id = ? `, [t.User_name, t.email, t.id]);
    //     // let a = await this.db.get(`SELECT * FROM Users WHERE User_name = ? OR email = ? or id = ? `, [t.User_name, t.email, t.id]);
    //     if (!a)
    //         return await this.db.run(`INSERT INTO Users (id, email, User_name,User_password, loggedIn,Auto_Match,isOnline,avatar)
    //         VALUES (?,?, ?, ?, ?, ?, ?, ?)`, [t.id, t.email, t.User_name, t.User_password, t.loggedIn, t.Auto_Match, t.isOnline, t.avatar]);
    // }
    async getUserss() {
        return this.db.all(`SELECT * FROM Users`);
    }
    async getUserById(id) {
        return this.db.get(`SELECT * FROM Users WHERE id = ?`, [id]);
    }
    async getUserByEmail(email) {
        return this.db.get(`SELECT * FROM Users WHERE email =  ?`, [email]);
    }
    async updateUsers(id, u) {
        await this.db.run(`UPDATE Users 
             SET 
             email = ? , User_name = ?,User_password = ?, loggedIn = ?,Auto_Match = ?,isOnline = ?,avatar = ? 
             WHERE id = ?`, [u.email, u.User_name, u.User_password, u.loggedIn, u.Auto_Match, u.isOnline, u.avatar, u.id]);
    }
    async deleteUsers(id) {
        await this.db.run(`DELETE FROM Users WHERE id = ?`, [id]);
    }


    async UserCountMatches(id) {
        await this.db.run(`SELECT count(*) as Played  FROM  Match 
        Where (P1_Id = ?  OR P2_Id = ?  OR P3_Id = ?  OR P4_Id = ?);`, [id,id,id,id]);
    }

    async UserCountWins(id) {
        await this.db.run(`SELECT count(*) as Winned  FROM  Match 
        Where (((P1_Id = ?  OR P3_Id = ?) and score1 >= score2 ) OR ((P2_Id = ?  OR P4_Id = ?)and score2 >= score1))  and gameStatus = 'FINISHED';`,[id,id,id,id]);
    }

    async UserCountTournWins(id) {
        await this.db.run(`SELECT count(*) as Winned  FROM  Match 
        Where (((P1_Id = ?  OR P3_Id = ?) and score1 >= score2 ) OR ((P2_Id = ?  OR P4_Id = ?)and score2 >= score1))  and gameStatus = 'FINISHED';`,[id,id,id,id]);
    }

    async UserCountTournParticipation(id) {
        await this.db.run(`SELECT count(*) as Participate  FROM  Participate_Tournament   Where P_Id = ?;`,[id]);
    }

        ///////////ayoubbb1////////////////////
        async UserCountWins_ayoub(id) {
            return await this.db.get(`SELECT count(*) as Winned  FROM  Match 
            Where (((P1_Id = ?  OR P3_Id = ?) and score1 >= score2 ) OR ((P2_Id = ?  OR P4_Id = ?)and score2 >= score1))  and gameStatus = 'FINISHED';`,[id,id,id,id]);
        }
        
        async UserCountTournWins_ayoub(id) {
            return await this.db.get(`SELECT count(*) as Winned  FROM  Match 
            Where (((P1_Id = ?  OR P3_Id = ?) and score1 >= score2 ) OR ((P2_Id = ?  OR P4_Id = ?)and score2 >= score1))  and gameStatus = 'FINISHED';`,[id,id,id,id]);
        }
    
        async UserCountTournParticipation_ayoub(id) {
            return await this.db.get(`SELECT count(*) as Participate  FROM  Participate_Tournament   Where P_Id = ?;`,[id]);
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

