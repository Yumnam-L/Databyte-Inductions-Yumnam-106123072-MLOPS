# Breakout Game

Breakout is a classic arcade game where the player controls a paddle to bounce a ball and break a wall of bricks. The objective is to clear all the bricks without letting the ball pass the paddle. This game is built using React for the frontend.

## Features

- **Paddle Control**: Move the paddle using the left and right arrow keys.
- **Bouncing Ball**: The ball moves around the canvas, bouncing off the paddle, walls, and bricks.
- **Brick Grid**: A grid of bricks appears at the top of the canvas. The bricks' positions are randomized every time they are cleared completely.
- **Collision Detection**: Detects collisions between the ball and paddle, ball and bricks, and ball and walls. When the ball hits a brick, the brick disappears.
- **Scoring System**: Players score points when the ball hits a brick.
- **Lives**: Players have five lives. The game ends when all lives are depleted.
- **Descending Bricks**: Bricks slowly descend over time, and the game ends if they reach the bottom of the paddle.
- **High Score System**: Tracks the highest score achieved by the player.
- **Power-ups**: Unique bricks provide power-ups like increased paddle size, multiple balls, slow-motion effects, and fast motion of the balls.
- **Sound Effects**: Placeholder for sound effects (e.g., `bounce.wav` and `brick_break.wav`).
- **Background Image**: A background image is displayed on the canvas.
- **Pause/Resume**: A button to pause and resume the game.
- **Start/Restart**: A button to start or restart the game.

## Components

### `Canvas.js`

This file contains the main game logic and rendering code.

#### Key Functions

- `drawPaddle(ctx)`: Draws the paddle on the canvas.
- `drawBall(ctx)`: Draws the ball on the canvas.
- `drawBricks(ctx)`: Draws the bricks on the canvas.
- `drawScore(ctx)`: Displays the current score.
- `drawLives(ctx)`: Displays the remaining lives.
- `drawHighScore(ctx)`: Displays the high score.
- `playSound(sound)`: Plays the specified sound effect.
- `draw(ctx)`: Main drawing function that updates the game state.
- `collisionDetection()`: Detects collisions between the ball and other objects.
- `activatePowerUp()`: Activates a random power-up.
- `increasePaddleSize()`: Increases the paddle size for 5 seconds.
- `multipleBalls()`: Adds multiple balls for 5 seconds.
- `slowMotion()`: Slows down the ball movement for 5 seconds.
- `fastMotion()`: Speeds up the ball movement for 5 seconds.

## Usage

### Controls

- **Arrow Keys**: Move the paddle left and right.
- **Start Button**: Starts or restarts the game.
- **Pause/Resume Button**: Pauses or resumes the game.
- **Power-up Buttons**: Activates specific power-ups (paddle size increase, multiple balls, slow motion, fast motion).

### Power-ups

- **Increased Paddle Size**: Increases the paddle size for 5 seconds. Costs 3 points.
- **Multiple Balls**: Adds multiple balls for 5 seconds. Costs 3 points.
- **Slow Motion**: Slows down ball movement for 5 seconds. Costs 3 points.
- **Fast Motion**: Speeds up ball movement for 5 seconds. Costs 3 points.

### Game Over

- The game ends when the player loses all lives 

### Winning

- The player wins when all bricks are destroyed, and a message "You won the game" is displayed.

