import React, { useRef, useEffect, useState } from 'react';
import bounceSound from './assets/bounce.wav';
import brickBreakSound from './assets/brick_break.mp3';
import backgroundImage from './assets/background.jpg';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [paddleX, setPaddleX] = useState(200);
  const [ball, setBall] = useState([{ x: 250, y: 300, dx: 2, dy: -2 }]);
  const [bricks, setBricks] = useState(initBricks);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const paddleWidth = useRef(100);
  const paddleHeight = 10;
  const canvasWidth = 735;
  const canvasHeight = 500;
  const [audioContext, setAudioContext] = useState(null);

// document.getElementById("Canvas").style.background = "url('/assets/background.png')"

  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
    }
  }, [score]);
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };
  }, []);
  // const drawBackground = (ctx) => {
  //   const img = new Image();
  //   img.src = backgroundImage;
  //   img.onload = () => {
  //     ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  //   };
  // };

  const drawPaddle = (ctx) => {
    ctx.beginPath();
    ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth.current, paddleHeight);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  };

  const drawBall = (ctx) => {
    ball.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    });
  };

  const drawBricks = (ctx) => {
    for (let c = 0; c < bricks.length; c++) {
      for (let r = 0; r < bricks[c].length; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = (c * (75 + 10)) + 30;
          let brickY = (r * (20 + 10)) + 30;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, 75, 20);
          ctx.fillStyle = bricks[c][r].powerUp ? 'gold' : '#0095DD';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  const drawScore = (ctx) => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20);
  };

  const drawLives = (ctx) => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, canvasWidth - 65, 20);
  };

  const drawHighScore = (ctx) => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`High Score: ${highScore}`, 90, 20);
  };

  const playSound = (sound) => {
    if (!audioContext) return;
    const audio = new Audio(sound);
    const track = audioContext.createMediaElementSource(audio);
    track.connect(audioContext.destination);
    audio.play();
  };

  const draw = (ctx) => {
    const img = new Image();
    img.src = backgroundImage;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight); // Draw background
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawBricks(ctx);
    drawPaddle(ctx);
    drawBall(ctx);
    drawScore(ctx);
    drawLives(ctx);
    drawHighScore(ctx);
    

    if (isPaused || !gameStarted) return;

    let newBalls = ball.map((b) => {
      let newX = b.x + b.dx;
      let newY = b.y + b.dy;

      if (newX + b.dx > canvasWidth - 10 || newX + b.dx < 10) {
        b.dx = -b.dx;
        playSound(bounceSound);
      }
      if (newY + b.dy < 10) {
        b.dy = -b.dy;
        playSound(bounceSound);
      } else if (newY + b.dy > canvasHeight - paddleHeight - 10) {
        if (newX > paddleX && newX < paddleX + paddleWidth.current) {
          b.dy = -b.dy;
          playSound(bounceSound);
        } else {
          setLives((prev) => prev - 1);
          if (lives === 1) {
            alert('GAME OVER');
            document.location.reload();
          } else {
            b.x = 250;
            b.y = 300;
            b.dx = 2;
            b.dy = -2;
            setPaddleX(200);
          }
        }
      }
      return { ...b, x: newX, y: newY };
    });

    setBall(newBalls);
  };

  const collisionDetection = () => {
    for (let c = 0; c < bricks.length; c++) {
      for (let r = 0; r < bricks[c].length; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          ball.forEach((ball) => {
            if (ball.x > b.x && ball.x < b.x + 75 && ball.y > b.y && ball.y < b.y + 20) {
              ball.dy = -ball.dy;
              b.status = 0;
              setScore((prev) => prev + 1);
              playSound(brickBreakSound);

              if (b.powerUp) {
                activatePowerUp();
              }

              if (bricks.flat().every(brick => brick.status === 0)) {
                alert('YOU WIN, CONGRATULATIONS!');
                document.location.reload();
              }
            }
          });
        }
      }
    }
  };

  const activatePowerUp = () => {
    const powerUpType = Math.floor(Math.random() * 4);

    switch (powerUpType) {
      case 0:
        increasePaddleSize();
        break;
      case 1:
        multipleBalls();
        break;
      case 2:
        slowMotion();
        break;
      case 3:
        fastMotion();
        break;
      default:
        break;
    }
  };

  const increasePaddleSize = () => {
    if (score < 3) return;
    setScore(score - 3);
    paddleWidth.current = 200;
    setTimeout(() => {
      paddleWidth.current = 100;
    }, 5000);
  };

  const multipleBalls = () => {
    if (score < 3) return;
    setScore(score - 3);
    setBall((prev) => [...prev, { x: 250, y: 300, dx: 2, dy: -2 }]);
    setTimeout(() => {
      setBall((prev) => prev.slice(0, 1));
    }, 5000);
  };

  const slowMotion = () => {
    if (score < 3) return;
    setScore(score - 3);
    setBall((prev) => prev.map(b => ({ ...b, dx: b.dx / 2, dy: b.dy / 2 })));
    setTimeout(() => {
      setBall((prev) => prev.map(b => ({ ...b, dx: b.dx * 2, dy: b.dy * 2 })));
    }, 5000);
  };

  const fastMotion = () => {
    if (score < 3) return;
    setScore(score - 3);
    setBall((prev) => prev.map(b => ({ ...b, dx: b.dx * 2, dy: b.dy * 2 })));
    setTimeout(() => {
      setBall((prev) => prev.map(b => ({ ...b, dx: b.dx / 2, dy: b.dy / 2 })));
    }, 5000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const interval = setInterval(() => {
      draw(ctx);
      collisionDetection();
    }, 10);
    return () => clearInterval(interval);
  }, [paddleX, ball, bricks, score, lives, isPaused, gameStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBricks((prevBricks) => prevBricks.map(row => row.map(brick => ({
        ...brick,
        y: brick.y + 1,
      }))));
    }, 10000); // Bricks descend every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    if (!audioContext) {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }

    if (e.key === 'ArrowLeft' && paddleX > 0) {
      setPaddleX((prev) => prev - 20);
    } else if (e.key === 'ArrowRight' && paddleX < canvasWidth - paddleWidth.current) {
      setPaddleX((prev) => prev + 20);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paddleX, audioContext]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsPaused(false);
    setBall([{ x: 250, y: 300, dx: 2, dy: -2 }]);
    setBricks(initBricks());
    setScore(0);
    setLives(5);
    setPaddleX(200);
  };

  return (
    <div className="button-container">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      <div className='buttons'>
        <button onClick={startGame}>
          {gameStarted ? 'Restart' : 'Start'}
        </button>
        <button onClick={togglePause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={increasePaddleSize}>Paddle Size Increase</button>
        <button onClick={multipleBalls}>Multiple Balls</button>
        <button onClick={slowMotion}>Slow Motion</button>
        <button onClick={fastMotion}>Fast Motion</button>
      </div>
    </div>
  );
};

export default Canvas;

const initBricks = () => {
  let bricks = [];
  for (let c = 0; c < 8; c++) {
    bricks[c] = [];
    for (let r = 0; r < 5; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: Math.random() < 0.2 };
    }
  }
  return bricks;
};
