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

export interface AIAction 
{
  moveUp: boolean;
  moveDown: boolean;
}

export class AIOpponent {
  private reactionTime: number;
  private accuracy: number;
  private predictionSkill: number;
  private predictionNoise: number;
  private mistakeChance: number;
  private hesitationChance: number;
  private lastDecisionTime = 0;
  private cachedAction: AIAction = { moveUp: false, moveDown: false,};
  constructor() {
    this.reactionTime = 120;
    this.accuracy = 0.95;
    this.predictionSkill = 0.98;
    this.predictionNoise = 4;
    this.mistakeChance = 0.003;
    this.hesitationChance = 0.03;
  }

  public update(gameState: AIGameState): AIAction {
    const currentTime = Date.now();
    if (currentTime - this.lastDecisionTime < this.reactionTime) 
      {
      return this.cachedAction;
      }

    // Decide behavior directly (simplified: tracking, anticipating or defensive)
    const stateToUse = gameState;
    const ball = stateToUse.ball;
    const isBallApproaching = ball.velocityX > 0;

    let action: AIAction = { moveUp: false, moveDown: false};

    if (!isBallApproaching)
      this.defensiveBehavior(stateToUse, action);
    else if (this.shouldAnticipate(stateToUse))
      this.anticipatingBehavior(stateToUse, action);
    else
      this.trackingBehavior(stateToUse, action);

    // Add human-like imperfection
    this.addHumanImperfections(action);

    this.cachedAction = action;
    this.lastDecisionTime = currentTime;
    return action;
  }

  

  private trackingBehavior(gameState: AIGameState, action: AIAction): void {
    const targetY = this.predictBallPosition(gameState);
    const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;

    this.moveTowardTarget(paddleCenter, targetY, action);
  }

  private anticipatingBehavior(gameState: AIGameState, action: AIAction): void {
    // Predict where the ball will be after multiple bounces
    const predictedPosition = this.predictComplexTrajectory(gameState);
    const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;

    this.moveTowardTarget(paddleCenter, predictedPosition, action);
  }

  private defensiveBehavior(gameState: AIGameState, action: AIAction): void {
    // Move to center position when not under immediate threat
    const centerY = gameState.gameHeight / 2;
    const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;

    this.moveTowardTarget(paddleCenter, centerY, action);
  }


  private predictBallPosition(gameState: AIGameState): number {
    const ball = gameState.ball;
    const aiPaddle = gameState.aiPaddle;

    // Simple prediction: where will ball be when it reaches paddle x position
    if (ball.velocityX <= 0) return ball.y; // Ball moving away

    const timeToReachPaddle = (aiPaddle.x - ball.x) / ball.velocityX;
    let predictedY = ball.y + ball.velocityY * timeToReachPaddle;

    // Predict wall bounces
    while (predictedY < 0 || predictedY > gameState.gameHeight) {
      if (predictedY < 0) {
        predictedY = -predictedY;
      } else {
        predictedY = 2 * gameState.gameHeight - predictedY;
      }
    }

    return this.applyPredictionNoise(predictedY, gameState.gameHeight);
  }

  private predictComplexTrajectory(gameState: AIGameState): number {
    // More sophisticated prediction considering multiple bounces
    const ball = gameState.ball;
    const aiPaddle = gameState.aiPaddle;

    if (ball.velocityX <= 0) return gameState.gameHeight / 2;

    let simulatedX = ball.x;
    let simulatedY = ball.y;
    let simulatedVX = ball.velocityX;
    let simulatedVY = ball.velocityY;

    // Simulate ball trajectory until it reaches paddle
    while (simulatedX < aiPaddle.x) {
      simulatedX += simulatedVX;
      simulatedY += simulatedVY;

      // Handle wall collisions
      if (simulatedY <= 0 || simulatedY >= gameState.gameHeight) {
        simulatedVY = -simulatedVY;
        simulatedY = Math.max(0, Math.min(gameState.gameHeight, simulatedY));
      }

      // Add some randomness based on difficulty
      if (Math.random() > this.predictionSkill) {
        simulatedVY += (Math.random() - 0.5) * 2;
      }
    }

    return this.applyPredictionNoise(simulatedY, gameState.gameHeight);
  }

  private applyPredictionNoise(value: number, max: number): number {
    const noise = (Math.random() - 0.5) * 2 * this.predictionNoise;
    const adjusted = value + noise;
    return Math.max(0, Math.min(max, adjusted));
  }

  private moveTowardTarget(currentY: number, targetY: number, action: AIAction): void {
    const tolerance = 8 + (1 - this.accuracy) * 35;

    if (Math.abs(currentY - targetY) > tolerance) {
      if (currentY < targetY) {
        action.moveDown = true;
      } else {
        action.moveUp = true;
      }
    }
  }

  private shouldAnticipate(gameState: AIGameState): boolean {
    const ball = gameState.ball;
    // Anticipate when ball is moving fast or at tricky angles
    const ballSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
    const isFastBall = ballSpeed > 8;
    const isTrickyAngle = Math.abs(ball.velocityY) > Math.abs(ball.velocityX);

    return isFastBall || isTrickyAngle;
  }

  

  private addHumanImperfections(action: AIAction): void {
    if (Math.random() < this.mistakeChance)
      {
      if (action.moveUp)
        {
        action.moveUp = false;
        action.moveDown = true;
      }
      else if (action.moveDown)
        {
        action.moveDown = false;
        action.moveUp = true;
        }
    }

    if (Math.random() < this.hesitationChance) {
      action.moveUp = false;
      action.moveDown = false;
    }
  }

  

  // Method to simulate keyboard input (as required)
  public simulateKeyboardInput(action: AIAction): void {
    if (typeof document === "undefined") return;

    if (action.moveUp) {
      this.dispatchKeyEvent("keydown", "ArrowUp");
      setTimeout(() => this.dispatchKeyEvent("keyup", "ArrowUp"), 50);
    }

    if (action.moveDown) {
      this.dispatchKeyEvent("keydown", "ArrowDown");
      setTimeout(() => this.dispatchKeyEvent("keyup", "ArrowDown"), 50);
    }
  }

  private dispatchKeyEvent(eventType: string, key: string): void {
    const event = new KeyboardEvent(eventType, { key });
    document.dispatchEvent(event);
  }
}
