// export enum Difficulty {
//   EASY = "EASY",
//   MEDIUM = "MEDIUM",
//   HARD = "HARD",
// }

// export interface AIGameState {
//   ball: {
//     x: number;
//     y: number;
//     velocityX: number;
//     velocityY: number;
//     radius: number;
//   };
//   aiPaddle: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   };
//   playerPaddle: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   };
//   gameHeight: number;
//   score?: {
//     ai: number;
//     player: number;
//   };
// }

// export interface AIAction 
// {
//   moveUp: boolean;
//   moveDown: boolean;
// }

// export class AIOpponent {
//   private reactionTime: number;
//   private accuracy: number;
//   private predictionSkill: number;
//   private predictionNoise: number;
//   private mistakeChance: number;
//   private hesitationChance: number;
//   private lastDecisionTime = 0;
//   private cachedAction: AIAction = { moveUp: false, moveDown: false};
//   constructor() {
//     this.reactionTime = 120;
//     this.accuracy = 0.95;
//     this.predictionSkill = 0.98;
//     this.predictionNoise = 4;
//     this.mistakeChance = 0.003;
//     this.hesitationChance = 0.03;
//   }

//   public update(gameState: AIGameState): AIAction {
//     const currentTime = Date.now();
//     if (currentTime - this.lastDecisionTime < this.reactionTime) {
//       return this.cachedAction;
//       }

//     const stateToUse = gameState;
//     const ball = stateToUse.ball;
//     const isBallApproaching = ball.velocityX > 0;

//     let action: AIAction = { moveUp: false, moveDown: false};

//     if (!isBallApproaching) {
//       this.defensiveBehavior(stateToUse, action);
//     } else if (this.shouldAnticipate(stateToUse)) {
//       this.anticipatingBehavior(stateToUse, action);
//     } else {
//       this.trackingBehavior(stateToUse, action);
//     }

//     this.addHumanImperfections(action);

//     this.cachedAction = action;
//     this.lastDecisionTime = currentTime;
//     return action;
//   }

  

//   private trackingBehavior(gameState: AIGameState, action: AIAction): void {
//     const targetY = this.predictBallPosition(gameState);
//     const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;

//     this.moveTowardTarget(paddleCenter, targetY, action);
//   }

//   private anticipatingBehavior(gameState: AIGameState, action: AIAction): void {
//     const predictedPosition = this.predictComplexTrajectory(gameState);
//     const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;

//     this.moveTowardTarget(paddleCenter, predictedPosition, action);
//   }

//   private defensiveBehavior(gameState: AIGameState, action: AIAction): void {
//     const centerY = gameState.gameHeight / 2;
//     const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;

//     this.moveTowardTarget(paddleCenter, centerY, action);
//   }


//   private predictBallPosition(gameState: AIGameState): number {
//     const ball = gameState.ball;
//     const aiPaddle = gameState.aiPaddle;

//     if (ball.velocityX <= 0) return ball.y;

//     const timeToReachPaddle = (aiPaddle.x - ball.x) / ball.velocityX;
//     let predictedY = ball.y + ball.velocityY * timeToReachPaddle;

//     while (predictedY < 0 || predictedY > gameState.gameHeight) {
//       if (predictedY < 0) {
//         predictedY = -predictedY;
//       } else {
//         predictedY = 2 * gameState.gameHeight - predictedY;
//       }
//     }

//     return this.applyPredictionNoise(predictedY, gameState.gameHeight);
//   }

//   private predictComplexTrajectory(gameState: AIGameState): number {
//     const ball = gameState.ball;
//     const aiPaddle = gameState.aiPaddle;

//     if (ball.velocityX <= 0) return gameState.gameHeight / 2;

//     let simulatedX = ball.x;
//     let simulatedY = ball.y;
//     let simulatedVX = ball.velocityX;
//     let simulatedVY = ball.velocityY;

//     while (simulatedX < aiPaddle.x) {
//       simulatedX += simulatedVX;
//       simulatedY += simulatedVY;

//       if (simulatedY <= 0 || simulatedY >= gameState.gameHeight) {
//         simulatedVY = -simulatedVY;
//         simulatedY = Math.max(0, Math.min(gameState.gameHeight, simulatedY));
//       }

//       if (Math.random() > this.predictionSkill) {
//         simulatedVY += (Math.random() - 0.5) * 2;
//       }
//     }

//     return this.applyPredictionNoise(simulatedY, gameState.gameHeight);
//   }

//   private applyPredictionNoise(value: number, max: number): number {
//     const noise = (Math.random() - 0.5) * 2 * this.predictionNoise;
//     const adjusted = value + noise;
//     return Math.max(0, Math.min(max, adjusted));
//   }

//   private moveTowardTarget(currentY: number, targetY: number, action: AIAction): void {
//     const tolerance = 8 + (1 - this.accuracy) * 35;

//     if (Math.abs(currentY - targetY) > tolerance) {
//       if (currentY < targetY) {
//         action.moveDown = true;
//       } else {
//         action.moveUp = true;
//       }
//     }
//   }

//   private shouldAnticipate(gameState: AIGameState): boolean {
//     const ball = gameState.ball;
//     const ballSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
//     const isFastBall = ballSpeed > 8;
//     const isTrickyAngle = Math.abs(ball.velocityY) > Math.abs(ball.velocityX);

//     return isFastBall || isTrickyAngle;
//   }

  

//   private addHumanImperfections(action: AIAction): void {
//     if (Math.random() < this.mistakeChance)
//       {
//       if (action.moveUp)
//         {
//         action.moveUp = false;
//         action.moveDown = true;
//       }
//       else if (action.moveDown)
//         {
//         action.moveDown = false;
//         action.moveUp = true;
//         }
//     }

//     if (Math.random() < this.hesitationChance) {
//       action.moveUp = false;
//       action.moveDown = false;
//     }
//   }

  

//   public simulateKeyboardInput(action: AIAction): void {
//     if (typeof document === "undefined") return;

//     if (action.moveUp) {
//       this.dispatchKeyEvent("keydown", "ArrowUp");
//       setTimeout(() => this.dispatchKeyEvent("keyup", "ArrowUp"), 50);
//     }

//     if (action.moveDown) {
//       this.dispatchKeyEvent("keydown", "ArrowDown");
//       setTimeout(() => this.dispatchKeyEvent("keyup", "ArrowDown"), 50);
//     }
//   }

//   private dispatchKeyEvent(eventType: string, key: string): void {
//     const event = new KeyboardEvent(eventType, { key });
//     document.dispatchEvent(event);
//   }
// }



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

  private difficulty: Difficulty;
  private predictionNoise: number;
  private paddleSpeed: number = 10;
  private lastCalculationTime: number = 0;

  constructor(difficulty: Difficulty = Difficulty.HARD)
  {
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

    // AI can only refresh its view of the game once per second (subject requirement)
    // It must predict ball trajectory from that single snapshot
    const needsRecalculation = this.targetY === null || (currentTime - this.lastCalculationTime >= 1000);

    if (needsRecalculation) {
      const pred = this.calculateExactDestination(gameState);
      this.targetY = this.applyPredictionNoise(pred.targetY, gameState.gameHeight);
      this.timeToReachAI = pred.timeToReachAI;
      this.lastCalculationTime = currentTime;
    } else {
      // Continue moving toward the predicted position without observing the ball
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
          // If ball has no vertical velocity, it stays at same Y
          if (simulatedVY === 0) {
            break;
          }

          let timeToWall;
          if (simulatedVY > 0) {
            timeToWall = (gameState.gameHeight - ball.radius - simulatedY) / simulatedVY;
          } else {
            timeToWall = (ball.radius - simulatedY) / simulatedVY;
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
          // If ball has no vertical velocity, it stays at same Y
          if (simulatedVY === 0) {
            break;
          }

          let timeToWall;
          if (simulatedVY > 0) {
            timeToWall = (gameState.gameHeight - ball.radius - simulatedY) / simulatedVY;
          } else {
            timeToWall = (ball.radius - simulatedY) / simulatedVY;
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