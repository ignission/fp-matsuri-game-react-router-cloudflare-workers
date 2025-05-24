import type React from "react";
import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;
const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;

const GameBreakout: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let x = CANVAS_WIDTH / 2;
		let y = CANVAS_HEIGHT - 30;
		let dx = 2;
		let dy = -2;
		let paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
		let rightPressed = false;
		let leftPressed = false;

		// ブロック関連の定数
		const brickRowCount = 3;
		const brickColumnCount = 5;
		const brickWidth = 75;
		const brickHeight = 20;
		const brickPadding = 10;
		const brickOffsetTop = 30;
		const brickOffsetLeft = 30;

		// ブロックの二次元配列（status追加）
		const bricks: { x: number; y: number; status: number }[][] = [];
		for (let c = 0; c < brickColumnCount; c++) {
			bricks[c] = [];
			for (let r = 0; r < brickRowCount; r++) {
				bricks[c][r] = { x: 0, y: 0, status: 1 };
			}
		}

		// スコア管理
		let score = 0;

		// ライフ管理
		let lives = 3;


		// ロゴ画像の読み込み
		const logoImg = new window.Image();
		logoImg.src = '/app/game-breakout/logo.jpg';
		let logoImgLoaded = false;
		logoImg.onload = () => {
			logoImgLoaded = true;
		};

		function drawBricks() {
			if (!ctx) return;
			for (let c = 0; c < brickColumnCount; c++) {
				for (let r = 0; r < brickRowCount; r++) {
					if (bricks[c][r].status === 1) {
						const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
						const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
						bricks[c][r].x = brickX;
						bricks[c][r].y = brickY;
						ctx.beginPath();
						ctx.rect(brickX, brickY, brickWidth, brickHeight);
						ctx.fillStyle = "#0095DD";
						ctx.fill();
						ctx.closePath();
					}
				}
			}
		}

		function drawBall() {
			if (!ctx) return;
			if (logoImgLoaded) {
				ctx.drawImage(
					logoImg,
					x - BALL_RADIUS,
					y - BALL_RADIUS,
					BALL_RADIUS * 2,
					BALL_RADIUS * 2
				);
			} else {
				ctx.beginPath();
				ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}

		function drawPaddle() {
			if (!ctx) return;
			ctx.beginPath();
			ctx.rect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
		}

		function drawScore() {
			if (!ctx) return;
			ctx.font = "16px Arial";
			ctx.fillStyle = "#0095DD";
			ctx.fillText(`Score: ${score}`, 8, 20);
		}

		function drawLives() {
			if (!ctx) return;
			ctx.font = "16px Arial";
			ctx.fillStyle = "#0095DD";
			ctx.fillText(`Lives: ${lives}`, CANVAS_WIDTH - 65, 20);
		}

		function collisionDetection() {
			for (let c = 0; c < brickColumnCount; c++) {
				for (let r = 0; r < brickRowCount; r++) {
					const b = bricks[c][r];
					if (b.status === 1) {
						if (
							x > b.x &&
							x < b.x + brickWidth &&
							y > b.y &&
							y < b.y + brickHeight
						) {
							dy = -dy;
							b.status = 0;
							score++;
							if (score === brickRowCount * brickColumnCount) {
								alert("YOU WIN, CONGRATULATIONS!");
								cancelAnimationFrame(animationFrameId);
								return;
							}
						}
					}
				}
			}
		}

		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			drawBricks();
			drawBall();
			drawPaddle();
			collisionDetection();
			drawScore();
			drawLives();

			// 壁との衝突判定
			if (x + dx > CANVAS_WIDTH - BALL_RADIUS || x + dx < BALL_RADIUS) {
				dx = -dx;
			}
			if (y + dy < BALL_RADIUS) {
				dy = -dy;
			} else if (y + dy > CANVAS_HEIGHT - BALL_RADIUS) {
				if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
					dy = -dy;
				} else {
					lives--;
					if (!lives) {
						alert("GAME OVER");
						cancelAnimationFrame(animationFrameId);
						return;
					}
					x = CANVAS_WIDTH / 2;
					y = CANVAS_HEIGHT - 30;
					dx = 2;
					dy = -2;
					paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
				}
			}

			x += dx;
			y += dy;

			// パドルの移動
			if (rightPressed) {
				paddleX = Math.min(paddleX + 7, CANVAS_WIDTH - PADDLE_WIDTH);
			} else if (leftPressed) {
				paddleX = Math.max(paddleX - 7, 0);
			}
		}

		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === "Right" || e.key === "ArrowRight") {
				rightPressed = true;
			} else if (e.key === "Left" || e.key === "ArrowLeft") {
				leftPressed = true;
			}
		}

		function keyUpHandler(e: KeyboardEvent) {
			if (e.key === "Right" || e.key === "ArrowRight") {
				rightPressed = false;
			} else if (e.key === "Left" || e.key === "ArrowLeft") {
				leftPressed = false;
			}
		}

		function mouseMoveHandler(e: MouseEvent) {
			if (!canvas) return;
			const relativeX = e.clientX - canvas.offsetLeft;
			if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
				paddleX = Math.max(0, Math.min(relativeX - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH));
			}
		}

		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);

		let animationFrameId: number;
		function renderLoop() {
			draw();
			animationFrameId = requestAnimationFrame(renderLoop);
		}
		renderLoop();

		return () => {
			cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", keyDownHandler, false);
			document.removeEventListener("keyup", keyUpHandler, false);
			document.removeEventListener("mousemove", mouseMoveHandler, false);
		};
	}, []);

	return (
		<div style={{ textAlign: "center" }}>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ background: "#fff", display: "block", margin: "0 auto" }}
			/>
		</div>
	);
};

export default GameBreakout;
