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
        this.player1Name = "";
        this.player2Name = "";
        this.player3Name = "";
        this.player4Name = "";
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
        this.db = await open({ filename: "database.sqlite", driver: sqlite3.Database, });
        const schema = fs.readFileSync("game.sql", "utf8");
        await this.db.exec(schema);
        //  Log every SQL statement executed
        // this.db.on("trace", (sql) => console.log("[SQL]", sql));
        console.log("Database connected and table created!");
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
        const result = await this.db.run(`INSERT INTO Match (P1_Id, T_Id, mode) VALUES (?, ?, ?)`, [m.P1_Id, m.T_Id, m.mode]);
        return result.lastID;
    }
    async createMatch_not(m) {
        const result = await this.db.run(`INSERT INTO Match (P1_Id, mode) VALUES (?, ?)`, [m.P1_Id, m.mode]);
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

    async deleteMatch(id) {
        await this.db.run(`DELETE FROM Match WHERE id = ?`, [id]);
    }

    // -------------------------------
    // Participate_Tournament CRUD
    // -------------------------------
    async createParticipate(p) {
        const result = await this.db.run(`INSERT INTO Participate_Tournament (P_Id, T_Id)
             VALUES (?, ?)`, p.P_Id, p.T_Id);
        return result.lastID;
    }
    async getParticipations() {
        return this.db.all(`SELECT * FROM Participate_Tournament`);
    }
    async getParticipationById(id) {
        return this.db.get(`SELECT * FROM Participate_Tournament WHERE id = ?`, [id]);
    }
    async updateParticipation(id, p) {
        await this.db.run(`UPDATE Participate_Tournament SET 
                P_Id=?, T_Id=?
             WHERE id = ?`, p.P_Id, p.T_Id, id);
    }
    async deleteParticipation(id) {
        await this.db.run(`DELETE FROM Participate_Tournament WHERE id = ?`, [id]);
    }

    // -------------------------------
    // Users CRUD
    // -------------------------------

    async createUsers(t) {
        let a = await this.db.get(`SELECT * FROM Users WHERE User_name = ? OR email = ? or id = ? `, [t.User_name, t.email, t.id]);
        if (!a)
            return await this.db.run(`INSERT INTO Users (id, email, User_name,User_password, loggedIn,Auto_Match,isOnline,avatar)
            VALUES (?,?, ?, ?, ?, ?, ?, ?)`, [t.id, t.email, t.User_name, t.User_password, t.loggedIn, t.Auto_Match, t.isOnline, t.avatar]);
    }
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
    

}
