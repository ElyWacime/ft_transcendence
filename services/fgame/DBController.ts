import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import * as fs from "fs";

export interface Tournament {
    id?: number;
    Label: string;
    CreatedAt: Date;
    count_player: number;
    result: string;
    Winner_Id: number;
}

export interface Participate_Tournament {
    id?: number;
    P_Id: number;
    T_Id: number;
    CreatedAt: Date;
}

export interface Match {
    id?: number;
    P1_Id: number;
    P2_Id: number;
    Ball_x: number;
    Ball_y: number;
    Player1_x: number;
    Player1_y: number;
    Player2_x: number;
    Player2_y: number;
    score_player1: number;
    score_player2: number;
    CreatedAt: Date;
    result: string;
    Winner_Id: number;
    tournamentId: number;
    chrono: number;
}

export class SQLiteDB {
    private db!: Database;

    constructor() { }

    // Must be called once to initialize the DB
    async connect(filename: string, schemaPath?: string) {
        this.db = await open({
            filename,
            driver: sqlite3.Database
        });

        if (schemaPath) {
            const schema = fs.readFileSync(schemaPath, "utf8");
            await this.db.exec(schema);
        }
    }

    // -------------------------------
    // Tournament CRUD
    // -------------------------------

    async createTournament(t: Tournament): Promise<number> {
        const result = await this.db.run(
            `INSERT INTO Tournament (Label, CreatedAt, count_player, result, Winner_Id)
             VALUES (?, ?, ?, ?, ?)`,
            t.Label,
            t.CreatedAt.toISOString(),
            t.count_player,
            t.result,
            t.Winner_Id
        );

        return result.lastID!;
    }

    async getTournaments(): Promise<Tournament[]> {
        return this.db.all<Tournament[]>(`SELECT * FROM Tournament`);
    }

    async getTournamentById(id: number): Promise<Tournament | undefined> {
        return this.db.get<Tournament>(`SELECT * FROM Tournament WHERE id = ?`, id);
    }

    async updateTournament(id: number, t: Tournament): Promise<void> {
        await this.db.run(
            `UPDATE Tournament 
             SET Label=?, CreatedAt=?, count_player=?, result=?, Winner_Id=? 
             WHERE id = ?`,
            t.Label,
            t.CreatedAt.toISOString(),
            t.count_player,
            t.result,
            t.Winner_Id,
            id
        );
    }

    async deleteTournament(id: number): Promise<void> {
        await this.db.run(`DELETE FROM Tournament WHERE id = ?`, id);
    }

    // -------------------------------
    // Match CRUD
    // -------------------------------

    async createMatch(m: Match): Promise<number> {
        const result = await this.db.run(
            `INSERT INTO Match (
                P1_Id, P2_Id, Ball_x, Ball_y,
                Player1_x, Player1_y, Player2_x, Player2_y,
                score_player1, score_player2,
                CreatedAt, result, Winner_Id, tournamentId, chrono
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            m.P1_Id, m.P2_Id, m.Ball_x, m.Ball_y,
            m.Player1_x, m.Player1_y, m.Player2_x, m.Player2_y,
            m.score_player1, m.score_player2,
            m.CreatedAt.toISOString(), m.result, m.Winner_Id,
            m.tournamentId, m.chrono
        );

        return result.lastID!;
    }

    async getMatches(): Promise<Match[]> {
        return this.db.all<Match[]>(`SELECT * FROM Match`);
    }

    async getMatchById(id: number): Promise<Match | undefined> {
        return this.db.get<Match>(`SELECT * FROM Match WHERE id = ?`, id);
    }
    async getMatchPlayable(): Promise<Match | undefined> {
        return this.db.get<Match>(`SELECT id FROM Match WHERE P2_Id is NULL`);
    }
    async getMatchByEmail(email: string): Promise<Match | undefined> {
        return this.db.get<Match>(`SELECT m.id
        FROM Match m
        INNER JOIN Users u ON u.id = m.P1_Id OR u.id = m.P2_Id
        WHERE u.email = ?
        ORDER BY m.CreatedAt DESC
        LIMIT 1;
        `, email);
    }
    async updateMatch(id: number, m: Match): Promise<void> {
        await this.db.run(
            `UPDATE Match SET
                P1_Id=?, P2_Id=?, Ball_x=?, Ball_y=?,
                Player1_x=?, Player1_y=?, Player2_x=?, Player2_y=?,
                score_player1=?, score_player2=?,
                CreatedAt=?, result=?, Winner_Id=?, tournamentId=?, chrono=?
             WHERE id = ?`,
            m.P1_Id, m.P2_Id, m.Ball_x, m.Ball_y,
            m.Player1_x, m.Player1_y, m.Player2_x, m.Player2_y,
            m.score_player1, m.score_player2,
            m.CreatedAt.toISOString(), m.result, m.Winner_Id,
            m.tournamentId, m.chrono,
            id
        );
    }

    async deleteMatch(id: number): Promise<void> {
        await this.db.run(`DELETE FROM Match WHERE id = ?`, id);
    }

    // -------------------------------
    // Participate_Tournament CRUD
    // -------------------------------

    async createParticipate(p: Participate_Tournament): Promise<number> {
        const result = await this.db.run(
            `INSERT INTO Participate_Tournament (P_Id, T_Id, CreatedAt)
             VALUES (?, ?, ?)`,
            p.P_Id,
            p.T_Id,
            p.CreatedAt.toISOString()
        );

        return result.lastID!;
    }

    async getParticipations(): Promise<Participate_Tournament[]> {
        return this.db.all<Participate_Tournament[]>(
            `SELECT * FROM Participate_Tournament`
        );
    }

    async getParticipationById(id: number): Promise<Participate_Tournament | undefined> {
        return this.db.get<Participate_Tournament>(
            `SELECT * FROM Participate_Tournament WHERE id = ?`,
            id
        );
    }

    async updateParticipation(id: number, p: Participate_Tournament): Promise<void> {
        await this.db.run(
            `UPDATE Participate_Tournament SET 
                P_Id=?, T_Id=?, CreatedAt=?
             WHERE id = ?`,
            p.P_Id,
            p.T_Id,
            p.CreatedAt.toISOString(),
            id
        );
    }

    async deleteParticipation(id: number): Promise<void> {
        await this.db.run(
            `DELETE FROM Participate_Tournament WHERE id = ?`,
            id
        );
    }
}
