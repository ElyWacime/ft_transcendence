// Common types & message formats shared between server and client

export type PlayerNumber = 1 | 2;

/** Messages the client sends */
export type ClientMessage =
  | { type: "keydown"; key: string }   // key codes like "KeyW", "KeyS", "ArrowUp", "ArrowDown"
  | { type: "keyup"; key: string }
  | { type: "hello"; name?: string }   // optional, not required

/** Messages the server sends */
export type ServerMessage =
  | { type: "assigned"; player: PlayerNumber }
  | { type: "error"; message: string }
  | { type: "state"; state: GameState }
  | { type: "info"; message: string };

/** The authoritative game state sent each tick */
export interface GameState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
  };
  paddle1: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  paddle2: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: {
    player1: number;
    player2: number;
  };
  gameStatus: "waiting" | "playing" | "paused" | "finished";
}
