import { open } from "sqlite";
import fs from "fs";
import sqlite3 from "sqlite3";

export class Users {
    constructor() {
        this.id = 0;
        this.email = "";
        this.User_name = "";
        this.User_password = "";
        this.loggedIn = 0;
        this.Auto_Match = 0;
        this.isOnline = 0;
        this.avatar = "";
        this.CreatedAt = new Date();
        this.UpdatedAt = new Date();
    }
}
export class Tournament {
    constructor() {
        this.id = 0;
        this.Label = "";
        this.CreatedAt = new Date();
        this.count_player = 0;
        this.result = "WIN";
        this.Winner_Id = -1;
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
export class Match {
    constructor() {
        this.id = 0;
        this.P1_Id = 0;
        this.P2_Id = 0;
        this.Ball_x = 0;
        this.Ball_y = 0;
        this.Player1_x = 0;
        this.Player1_y = 0;
        this.Player2_x = 0;
        this.Player2_y = 0;
        this.score_player1 = 0;
        this.score_player2 = 0;
        this.CreatedAt = new Date();
        this.result = "WIN";
        this.Winner_Id = 0;
        this.tournamentId = 0;
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
        console.log("Database connected and table created!");
    }

    // -------------------------------
    // Tournament CRUD
    // -------------------------------
    async createTournament(t) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        const result = await this.db.run(`INSERT INTO Tournament (Label, CreatedAt, count_player, result, Winner_Id)
             VALUES (?, ?, ?, ?, ?)`, t.Label, nowf, t.count_player, t.result, t.Winner_Id);
        return result.lastID;
    }
    async getTournaments() {
        return this.db.all(`SELECT * FROM Tournament`);
    }
    async getTournamentById(id) {
        return this.db.get(`SELECT * FROM Tournament WHERE id = ?`, id);
    }
    async updateTournament(id, t) {
        await this.db.run(`UPDATE Tournament 
             SET Label=?, count_player=?, result=?, Winner_Id=? 
             WHERE id = ?`, t.Label, t.count_player, t.result, t.Winner_Id, id);
    }
    async deleteTournament(id) {
        await this.db.run(`DELETE FROM Tournament WHERE id = ?`, id);
    }
    // -------------------------------
    // Match CRUD
    // -------------------------------
    async createMatch(m) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        const result = await this.db.run(`INSERT INTO Match (
                P1_Id, P2_Id, Ball_x, Ball_y,
                Player1_x, Player1_y, Player2_x, Player2_y,
                score_player1, score_player2,
                CreatedAt, result, Winner_Id, tournamentId
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, m.P1_Id, m.P2_Id, m.Ball_x, m.Ball_y, m.Player1_x, m.Player1_y, m.Player2_x, m.Player2_y, m.score_player1, m.score_player2, nowf, m.result, m.Winner_Id, m.tournamentId);
        return result.lastID;
    }
    async getMatches() {
        return this.db.all(`SELECT * FROM Match`);
    }
    async getMatchById(id) {
        return this.db.get(`SELECT * FROM Match WHERE id = ?`, id);
    }
    async getMatchPlayable() {
        return this.db.get(`SELECT id FROM Match WHERE P2_Id is NULL`);
    }
    async getMatchByEmail(email) {
        return this.db.get(`SELECT m.id
        FROM Match m
        INNER JOIN Users u ON u.id = m.P1_Id OR u.id = m.P2_Id
        WHERE u.email = ?
        ORDER BY m.CreatedAt DESC
        LIMIT 1;
        `, email);
    }
    async updateMatch(id, m) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        await this.db.run(`UPDATE Match SET
                P1_Id=?, P2_Id=?, Ball_x=?, Ball_y=?,
                Player1_x=?, Player1_y=?, Player2_x=?, Player2_y=?,
                score_player1=?, score_player2=?,
                CreatedAt=?, result=?, Winner_Id=?, tournamentId=?, chrono=?
             WHERE id = ?`, m.P1_Id, m.P2_Id, m.Ball_x, m.Ball_y, m.Player1_x, m.Player1_y, m.Player2_x, m.Player2_y, m.score_player1, m.score_player2, nowf, m.result, m.Winner_Id, m.tournamentId, id);
    }
    async deleteMatch(id) {
        await this.db.run(`DELETE FROM Match WHERE id = ?`, id);
    }
    // -------------------------------
    // Participate_Tournament CRUD
    // -------------------------------
    async createParticipate(p) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        const result = await this.db.run(`INSERT INTO Participate_Tournament (P_Id, T_Id, CreatedAt)
             VALUES (?, ?, ?)`, p.P_Id, p.T_Id, nowf);
        return result.lastID;
    }
    async getParticipations() {
        return this.db.all(`SELECT * FROM Participate_Tournament`);
    }
    async getParticipationById(id) {
        return this.db.get(`SELECT * FROM Participate_Tournament WHERE id = ?`, id);
    }
    async updateParticipation(id, p) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        await this.db.run(`UPDATE Participate_Tournament SET 
                P_Id=?, T_Id=?, CreatedAt=?
             WHERE id = ?`, p.P_Id, p.T_Id, nowf, id);
    }
    async deleteParticipation(id) {
        await this.db.run(`DELETE FROM Participate_Tournament WHERE id = ?`, id);
    }
    // (email, User_name,User_password, loggedIn,Auto_Match,isOnline,avatar,CreatedAt,UpdatedAt)
    async createUsers(t) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        const result = await this.db.run(`INSERT INTO Users (email, User_name,User_password, loggedIn,Auto_Match,isOnline,avatar,CreatedAt,UpdatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, t.email, t.User_name, t.User_password, t.loggedIn, t.Auto_Match, t.isOnline, t.avatar, nowf, nowf);
        return result.lastID;
    }
    async getUserss() {
        return this.db.all(`SELECT * FROM Users`);
    }
    async getUsersById(id) {
        return this.db.get(`SELECT * FROM Users WHERE id = ?`, id);
    }
    async updateUsers(id, u) {
        let now = new Date();
        let nowf = now.toLocaleString("fr-FR");
        await this.db.run(`UPDATE Users 
             SET 
             email = ? , User_name = ?,User_password = ?, loggedIn = ?,Auto_Match = ?,isOnline = ?,avatar = ?, UpdatedAt = ?
             WHERE id = ?`, u.email, u.User_name, u.User_password, u.loggedIn, u.Auto_Match, u.isOnline, u.avatar, nowf, u.id);
    }
    async deleteUsers(id) {
        await this.db.run(`DELETE FROM Users WHERE id = ?`, id);
    }
}
