export enum AIState {
  TRACKING = "TRACKING",
  ANTICIPATING = "ANTICIPATING",
  USING_POWERUP = "USING_POWERUP",
  DEFENSIVE = "DEFENSIVE",
}

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
  usePowerUp: boolean;
  powerUpType?: string;
}

export class AIOpponent {
  private lastViewUpdate = 0;
  private viewRefreshRate = 1000;
  private cachedGameState: AIGameState | null = null;
  private currentState: AIState = AIState.TRACKING;
  private difficulty: Difficulty;
  private reactionTime!: number;
  private accuracy!: number;
  private predictionSkill!: number;
  private predictionNoise!: number;
  private mistakeChance!: number;
  private hesitationChance!: number;
  private lastDecisionTime = 0;
  private cachedAction: AIAction = { moveUp: false, moveDown: false, usePowerUp: false };

  // Power-up management
  private availablePowerUps: string[] = [];
  private lastPowerUpUse = 0;
  private powerUpCooldown = 3000; // 3 seconds

  constructor(difficulty: Difficulty = Difficulty.MEDIUM) {
    this.difficulty = difficulty;
    this.setDifficultyParameters();
  }

  private setDifficultyParameters(): void {
    const profiles = {
      [Difficulty.EASY]: {
        reactionTime: 340,
        accuracy: 0.6,
        predictionSkill: 0.65,
        viewRefreshRate: 300,
        predictionNoise: 45,
        mistakeChance: 0.14,
        hesitationChance: 0.18,
      },
      [Difficulty.MEDIUM]: {
        reactionTime: 190,
        accuracy: 0.84,
        predictionSkill: 0.9,
        viewRefreshRate: 160,
        predictionNoise: 12,
        mistakeChance: 0.02,
        hesitationChance: 0.08,
      },
      [Difficulty.HARD]: {
        reactionTime: 120,
        accuracy: 0.95,
        predictionSkill: 0.98,
        viewRefreshRate: 130,
        predictionNoise: 4,
        mistakeChance: 0.003,
        hesitationChance: 0.03,
      },
    } as const;

    const profile = profiles[this.difficulty];
    this.reactionTime = profile.reactionTime;
    this.accuracy = profile.accuracy;
    this.predictionSkill = profile.predictionSkill;
    this.viewRefreshRate = profile.viewRefreshRate;
    this.predictionNoise = profile.predictionNoise;
    this.mistakeChance = profile.mistakeChance;
    this.hesitationChance = profile.hesitationChance;
  }

  public update(gameState: AIGameState): AIAction {
    const currentTime = Date.now();

    // Simulate 1-second view refresh constraint
    if (currentTime - this.lastViewUpdate >= this.viewRefreshRate) {
      this.cachedGameState = {
        ball: { ...gameState.ball },
        aiPaddle: { ...gameState.aiPaddle },
        playerPaddle: { ...gameState.playerPaddle },
        gameHeight: gameState.gameHeight,
        score: gameState.score ? { ...gameState.score } : undefined,
      };
      this.lastViewUpdate = currentTime;
    }

    // Use cached state for decision making
    const stateToUse = this.cachedGameState || gameState;

    if (currentTime - this.lastDecisionTime < this.reactionTime) {
      return this.cachedAction;
    }

    // Update AI state based on game situation
    this.updateAIState(stateToUse);

    // Generate action based on current state
    const action = this.generateAction(stateToUse, currentTime);
    this.cachedAction = action;
    this.lastDecisionTime = currentTime;
    return action;
  }

  private updateAIState(gameState: AIGameState): void {
    const ball = gameState.ball;

    // Check if ball is moving toward AI
    const isBallApproaching = ball.velocityX > 0;

    // Check if we should use power-up
    const shouldUsePowerUp = this.shouldUsePowerUp(gameState);

    if (shouldUsePowerUp) {
      this.currentState = AIState.USING_POWERUP;
    } else if (!isBallApproaching) {
      this.currentState = AIState.DEFENSIVE;
    } else if (this.shouldAnticipate(gameState)) {
      this.currentState = AIState.ANTICIPATING;
    } else {
      this.currentState = AIState.TRACKING;
    }
  }

  private generateAction(gameState: AIGameState, currentTime: number): AIAction {
    const action: AIAction = {
      moveUp: false,
      moveDown: false,
      usePowerUp: false,
    };

    switch (this.currentState) {
      case AIState.TRACKING:
        this.trackingBehavior(gameState, action);
        break;
      case AIState.ANTICIPATING:
        this.anticipatingBehavior(gameState, action);
        break;
      case AIState.USING_POWERUP:
        if (currentTime - this.lastPowerUpUse >= this.powerUpCooldown) {
          this.powerUpBehavior(gameState, action);
          this.lastPowerUpUse = currentTime;
        }
        break;
      case AIState.DEFENSIVE:
        this.defensiveBehavior(gameState, action);
        break;
    }

    // Add human-like imperfection
    this.addHumanImperfections(action);

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

  private powerUpBehavior(gameState: AIGameState, action: AIAction): void {
    const bestPowerUp = this.selectBestPowerUp();
    if (bestPowerUp) {
      action.usePowerUp = true;
      action.powerUpType = bestPowerUp;
      this.availablePowerUps = this.availablePowerUps.filter((p) => p !== bestPowerUp);
    }
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

  private shouldUsePowerUp(gameState: AIGameState): boolean {
    if (this.availablePowerUps.length === 0) return false;

    const isLosing = this.isLosingSituation(gameState);
    const isOpportunity = this.isPowerUpOpportunity(gameState);

    return isLosing || isOpportunity;
  }

  private isLosingSituation(gameState: AIGameState): boolean {
    const predictedY = this.predictBallPosition(gameState);
    const paddleCenter = gameState.aiPaddle.y + gameState.aiPaddle.height / 2;
    const distanceToBall = Math.abs(paddleCenter - predictedY);

    return distanceToBall > gameState.aiPaddle.height * 0.4;
  }

  private isPowerUpOpportunity(gameState: AIGameState): boolean {
    const ball = gameState.ball;
    return ball.velocityX > 0; // Ball coming toward AI
  }

  private selectBestPowerUp(): string | null {
    if (this.availablePowerUps.length === 0) return null;

    if (this.availablePowerUps.includes("speed_boost")) {
      return "speed_boost";
    } else if (this.availablePowerUps.includes("paddle_extend")) {
      return "paddle_extend";
    } else {
      return this.availablePowerUps[0];
    }
  }

  private addHumanImperfections(action: AIAction): void {
    if (Math.random() < this.mistakeChance) {
      if (action.moveUp) {
        action.moveUp = false;
        action.moveDown = true;
      } else if (action.moveDown) {
        action.moveDown = false;
        action.moveUp = true;
      }
    }

    if (Math.random() < this.hesitationChance) {
      action.moveUp = false;
      action.moveDown = false;
    }
  }

  // Public method to add power-ups (called from game when AI collects power-up)
  public addPowerUp(powerUpType: string): void {
    this.availablePowerUps.push(powerUpType);
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

    if (action.usePowerUp && action.powerUpType) {
      this.dispatchKeyEvent("keydown", " ");
      setTimeout(() => this.dispatchKeyEvent("keyup", " "), 50);
    }
  }

  private dispatchKeyEvent(eventType: string, key: string): void {
    const event = new KeyboardEvent(eventType, { key });
    document.dispatchEvent(event);
  }
}