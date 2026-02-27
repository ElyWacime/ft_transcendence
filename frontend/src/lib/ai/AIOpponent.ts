
export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export interface AIGameState {
  ball: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    radius: number;
  };
  aiPaddle: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  playerPaddle: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  gameHeight: number;
  score?: {
    ai: number;
    player: number;
  };
}

export interface AIAction {
  moveUp: boolean;
  moveDown: boolean;
}

interface Prediction {
  targetY: number;
  timeToReachAI: number;
}

export class AIOpponent {
  private targetY: number | null = null;
  private timeToReachAI: number = 0;
  private lastBallVx: number = 0;
  private lastBallVy: number = 0;

  private difficulty: Difficulty;
  private predictionNoise: number;
  private paddleSpeed: number = 10;
  private lastCalculationTime: number = 0;

  constructor(difficulty: Difficulty = Difficulty.HARD) {
    this.difficulty = difficulty;
    if (difficulty === Difficulty.EASY) {
      this.predictionNoise = 40;
    } else if (difficulty === Difficulty.MEDIUM) {
      this.predictionNoise = 15;
    } else {
      this.predictionNoise = 0;
    }
  }

  public update(gameState: AIGameState): AIAction {
    const ball = gameState.ball;
    const aiPaddle = gameState.aiPaddle;

    let action: AIAction = { moveUp: false, moveDown: false };
    const currentTime = Date.now();

    // Re-evaluate calculation ONLY if the ball direction flips, or it accelerates, or 1 second passes
    const isBallReset = Math.sign(ball.velocityX) !== Math.sign(this.lastBallVx) && ball.x > 300 && ball.x < 500;
    const isPaddleHit = Math.sign(ball.velocityX) !== Math.sign(this.lastBallVx);
    const hasAccelerated = Math.abs(ball.velocityX) > Math.abs(this.lastBallVx) + 0.1 || Math.abs(ball.velocityY) > Math.abs(this.lastBallVy) + 0.1;

    // We only predict when necessary, predicting the opponent's hit and exactly where we should stand
    const needsRecalculation = this.targetY === null || isBallReset || isPaddleHit || hasAccelerated || (currentTime - this.lastCalculationTime > 1000);

    if (needsRecalculation) {
      const pred = this.calculateExactDestination(gameState);
      this.targetY = this.applyPredictionNoise(pred.targetY, gameState.gameHeight);
      this.timeToReachAI = pred.timeToReachAI;
      this.lastCalculationTime = currentTime;
    } else {
      // Decrease time to reach AI by 1 frame (approx)
      this.timeToReachAI = Math.max(0, this.timeToReachAI - 1);
    }

    if (this.targetY !== null) {
      const paddleCenter = aiPaddle.y + aiPaddle.height / 2;
      const distanceToTarget = Math.abs(paddleCenter - this.targetY);

      let shouldMove = true;

      // Ensure we don't start moving until we need to, preserving movement logic simplicity
      const margin = 10;
      const framesNeededToMove = distanceToTarget / this.paddleSpeed;

      if (this.timeToReachAI > framesNeededToMove + margin && distanceToTarget > 5) {
        shouldMove = false;
      }

      if (shouldMove) {
        const tolerance = 5;
        if (paddleCenter < this.targetY - tolerance) {
          action.moveDown = true;
        } else if (paddleCenter > this.targetY + tolerance) {
          action.moveUp = true;
        }
      }
    }

    this.lastBallVx = ball.velocityX;
    this.lastBallVy = ball.velocityY;

    return action;
  }

  private calculateExactDestination(gameState: AIGameState): Prediction {
    const ball = gameState.ball;
    const aiPaddle = gameState.aiPaddle;
    const p1Paddle = gameState.playerPaddle;

    let simulatedX = ball.x;
    let simulatedY = ball.y;
    let simulatedVX = ball.velocityX;
    let simulatedVY = ball.velocityY;
    let totalTime = 0;

    if (simulatedVX === 0) return { targetY: gameState.gameHeight / 2, timeToReachAI: Infinity };

    const maxSpeedSq = 13 * 13;
    const accelerateSpeed = 1.2;

    let iterations = 0;
    // Iterate to find exactly where the ball ends up
    while (iterations < 100) {
      iterations++;

      if (simulatedVX > 0) {
        const distanceX = Math.max(0, aiPaddle.x - ball.radius - simulatedX);
        const timeX = distanceX / simulatedVX;
        totalTime += timeX;

        let remainingTime = timeX;
        while (remainingTime > 0) {
          let timeToWall;
          if (simulatedVY > 0) {
            timeToWall = (gameState.gameHeight - ball.radius - simulatedY) / simulatedVY;
          } else if (simulatedVY < 0) {
            timeToWall = (ball.radius - simulatedY) / simulatedVY;
          } else {
            timeToWall = Infinity;
          }

          if (simulatedVY === 0) {
            simulatedY += simulatedVY * remainingTime;
            break;
          }

          if (timeToWall < remainingTime) {
            simulatedY += simulatedVY * timeToWall;
            simulatedVY = -simulatedVY;
            remainingTime -= timeToWall;
          } else {
            simulatedY += simulatedVY * remainingTime;
            remainingTime = 0;
          }
        }

        return { targetY: simulatedY, timeToReachAI: totalTime };
      } else {
        const distanceX = Math.max(0, simulatedX - (p1Paddle.x + p1Paddle.width + ball.radius));
        const timeX = distanceX / Math.abs(simulatedVX);
        totalTime += timeX;

        let remainingTime = timeX;
        while (remainingTime > 0) {
          let timeToWall;
          if (simulatedVY > 0) {
            timeToWall = (gameState.gameHeight - ball.radius - simulatedY) / simulatedVY;
          } else if (simulatedVY < 0) {
            timeToWall = (ball.radius - simulatedY) / simulatedVY;
          } else {
            timeToWall = Infinity;
          }

          if (simulatedVY === 0) {
            simulatedY += simulatedVY * remainingTime;
            break;
          }

          if (timeToWall < remainingTime) {
            simulatedY += simulatedVY * timeToWall;
            simulatedVY = -simulatedVY;
            remainingTime -= timeToWall;
          } else {
            simulatedY += simulatedVY * remainingTime;
            remainingTime = 0;
          }
        }

        simulatedX = p1Paddle.x + p1Paddle.width + ball.radius;
        simulatedVX = -simulatedVX;

        if (simulatedVX * simulatedVX + simulatedVY * simulatedVY < maxSpeedSq) {
          simulatedVX *= accelerateSpeed;
          simulatedVY *= accelerateSpeed;
        }
      }
    }

    return { targetY: gameState.gameHeight / 2, timeToReachAI: Infinity };
  }

  private applyPredictionNoise(value: number, max: number): number {
    if (this.predictionNoise === 0) return value;
    const noise = (Math.random() - 0.5) * 2 * this.predictionNoise;
    const adjusted = value + noise;
    return Math.max(0, Math.min(max, adjusted));
  }

  public simulateKeyboardInput(action: AIAction): void {
  }

  public cleanup?(): void {
  }
}