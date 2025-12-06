import Database from "better-sqlite3";
import * as fs from "node:fs";

export interface Tournament {
    id: number,
    Label: string,
    CreatedAt: Date,
    count_player: number,
    result: string,
    Winner_Id: number
}

export interface Participate_Tournament {
    id: number,
    P_Id: number,
    T_Id: number,
    CreatedAt: Date,
}

export interface Match {
    id: number,
    P1_Id: number,
    P2_Id: number,
    Ball_x: number,
    Ball_y: number,
    Player1_x: number,
    Player1_y: number,
    Player2_x: number,
    Player2_y: number,
    score1: number,
    score2: number,
    CreatedAt: Date,
    result: string,
    Winner_Id: number,
    tournamentId: number,
    chrono: number
}

export class SQLiteDB {
    private db: Database.Database;

    constructor(filename: string, schemaPath?: string) {
        this.db = new Database(filename);

        // If schema file provided → load and execute it
        if (schemaPath) {
            const schema = fs.readFileSync(schemaPath, "utf8");
            this.db.exec(schema);
        }
    }

    // Insert a Tournament
    createTournament(tournament: Tournament): number {
        const stmt = this.db.prepare(
            "INSERT INTO Tournament () VALUES ()"
        );
        // const result = stmt.run(tournament.id, ...);
        // return result.lastInsertRowid as number;
        return 0;
    }

    // Get all Tournamens
    getTournament(): Tournament[] {
        const stmt = this.db.prepare("SELECT * FROM Tournament");
        return stmt.all() as Tournament[];
    }

    // Get one Tournament
    getTournamentById(id: number): Tournament | undefined {
        const stmt = this.db.prepare("SELECT * FROM Tournament WHERE id = ?");
        return stmt.get(id) as Tournament | undefined;
    }

    // Update Tournament
    updateTournament(id: number, Tournament: Tournament): void {
        const stmt = this.db.prepare(
            "UPDATE Tournament SET name = ?, age = ? WHERE id = ?"
        );
        // const result = stmt.run(tournament.id, ...);
    }

    // Delete Tournament
    deleteTournament(id: number): void {
        const stmt = this.db.prepare("DELETE FROM Tournament WHERE id = ?");
        stmt.run(id);
    }


    // Insert a Match
    createMatch(match: Match): number {
        const stmt = this.db.prepare(
            "INSERT INTO Match () VALUES ()"
        );
        // const result = stmt.run(match.id, ...);
        // return result.lastInsertRowid as number;
        return 0;
    }

    // Get all Tournamens
    getMatch(): Match[] {
        const stmt = this.db.prepare("SELECT * FROM Match");
        return stmt.all() as Match[];
    }

    // Get one Match
    getMatchById(id: number): Match | undefined {
        const stmt = this.db.prepare("SELECT * FROM Match WHERE id = ?");
        return stmt.get(id) as Match | undefined;
    }

    // Update Match
    updateMatch(id: number, match: Match): void {
        const stmt = this.db.prepare(
            "UPDATE Match SET name = ?, age = ? WHERE id = ?"
        );
        // const result = stmt.run(match.id, ...);
    }

    // Delete Match
    deleteMatch(id: number): void {
        const stmt = this.db.prepare("DELETE FROM Match WHERE id = ?");
        stmt.run(id);
    }

    // Insert a Participate_Tournament
    createParticipate_Tournament(participation: Participate_Tournament): number {
        const stmt = this.db.prepare(
            "INSERT INTO Participate_Tournament () VALUES ()"
        );
        // const result = stmt.run(participation.id, ...);
        // return result.lastInsertRowid as number;
        return 0;
    }

    // Get all Tournamens
    getParticipate_Tournament(): Participate_Tournament[] {
        const stmt = this.db.prepare("SELECT * FROM Participate_Tournament");
        return stmt.all() as Participate_Tournament[];
    }

    // Get one Participate_Tournament
    getParticipate_TournamentById(id: number): Participate_Tournament | undefined {
        const stmt = this.db.prepare("SELECT * FROM Participate_Tournament WHERE id = ?");
        return stmt.get(id) as Participate_Tournament | undefined;
    }

    // Update Participate_Tournament
    updateParticipate_Tournament(id: number, participation: Participate_Tournament): void {
        const stmt = this.db.prepare(
            "UPDATE Participate_Tournament SET name = ?, age = ? WHERE id = ?"
        );
        // const result = stmt.run(participation.id, ...);
    }

    // Delete Participate_Tournament
    deleteParticipate_Tournament(id: number): void {
        const stmt = this.db.prepare("DELETE FROM Participate_Tournament WHERE id = ?");
        stmt.run(id);
    }
}

