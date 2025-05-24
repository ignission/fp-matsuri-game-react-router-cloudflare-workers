import type React from "react";
import { useEffect, useReducer, useRef } from "react";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;
const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;

// 状態の型定義
interface Brick {
	x: number;
	y: number;
	status: number;
}

interface GameState {
	x: number;
	y: number;
	dx: number;
	dy: number;
	paddleX: number;
	rightPressed: boolean;
	leftPressed: boolean;
	bricks: Brick[][];
	score: number;
	lives: number;
}

// Action型定義

type Action =
	| { type: "TICK" }
	| { type: "KEY_DOWN"; key: string }
	| { type: "KEY_UP"; key: string }
	| { type: "MOUSE_MOVE"; x: number };

// 速度ベクトルをランダムな角度で生成する関数
function getRandomVelocity(speed = 2) {
	// 30度〜150度の範囲でランダム（上方向のみ）
	const minAngle = (30 * Math.PI) / 180;
	const maxAngle = (150 * Math.PI) / 180;
	const angle = Math.random() * (maxAngle - minAngle) + minAngle;
	const dx = speed * Math.cos(angle);
	const dy = -Math.abs(speed * Math.sin(angle)); // 上方向
	return { dx, dy };
}

// パドルの当たり位置から反射角度を計算する関数
function getPaddleBounceVelocity(ballX: number, paddleX: number, paddleWidth: number, speed = 2) {
	// パドル中心との差を-1〜1に正規化（符号を反転）
	const relativeIntersect = ((ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2)) * -1;
	// 反射角度を60度〜120度（-30度〜+30度）にマッピング
	const bounceAngle = (relativeIntersect * 60 + 90) * (Math.PI / 180); // 90度±30度
	const dx = speed * Math.cos(bounceAngle);
	const dy = -Math.abs(speed * Math.sin(bounceAngle));
	return { dx, dy };
}

// 初期状態生成関数
function createInitialState(): GameState {
	const brickRowCount = 3;
	const brickColumnCount = 5;
	const brickWidth = 75;
	const brickHeight = 20;
	const brickPadding = 10;
	const brickOffsetTop = 30;
	const brickOffsetLeft = 30;
	const bricks: Brick[][] = [];
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}
	const { dx, dy } = getRandomVelocity(2);
	return {
		x: CANVAS_WIDTH / 2,
		y: CANVAS_HEIGHT - 30,
		dx,
		dy,
		paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
		rightPressed: false,
		leftPressed: false,
		bricks,
		score: 0,
		lives: 3,
	};
}

// reducer関数（現時点ではTICK以外は未実装）
function reducer(state: GameState, action: Action): GameState {
	switch (action.type) {
		case "TICK": {
			if (state.lives <= 0) return state;
			// 定数
			const brickRowCount = 3;
			const brickColumnCount = 5;
			const brickWidth = 75;
			const brickHeight = 20;
			const brickPadding = 10;
			const brickOffsetTop = 30;
			const brickOffsetLeft = 30;
			let {
				x,
				y,
				dx,
				dy,
				paddleX,
				rightPressed,
				leftPressed,
				bricks,
				score,
				lives,
			} = state;
			// パドル移動
			if (rightPressed) {
				paddleX = Math.min(paddleX + 7, CANVAS_WIDTH - PADDLE_WIDTH);
			} else if (leftPressed) {
				paddleX = Math.max(paddleX - 7, 0);
			}
			// ボール移動
			x += dx;
			y += dy;
			// 壁との衝突
			if (x + dx > CANVAS_WIDTH - BALL_RADIUS || x + dx < BALL_RADIUS) {
				dx = -dx;
			}
			if (y + dy < BALL_RADIUS) {
				dy = -dy;
			} else if (y + dy > CANVAS_HEIGHT - BALL_RADIUS) {
				if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
					// パドルの当たり位置で反射角度を変える
					const v = getPaddleBounceVelocity(x, paddleX, PADDLE_WIDTH, Math.sqrt(dx*dx + dy*dy));
					dx = v.dx;
					dy = v.dy;
				} else {
					lives--;
					if (lives > 0) {
						// 初期位置に戻す
						x = CANVAS_WIDTH / 2;
						y = CANVAS_HEIGHT - 30;
						const v = getRandomVelocity(2);
						dx = v.dx;
						dy = v.dy;
						paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
					} else {
						// livesが0になったらそのまま（alert等は副作用で）
					}
				}
			}
			// ブロック衝突
			const newBricks = bricks.map((arr) => arr.map((b) => ({ ...b })));
			let newScore = score;
			for (let c = 0; c < brickColumnCount; c++) {
				for (let r = 0; r < brickRowCount; r++) {
					const b = newBricks[c][r];
					if (b.status === 1) {
						const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
						const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
						b.x = brickX;
						b.y = brickY;
						if (
							x > brickX &&
							x < brickX + brickWidth &&
							y > brickY &&
							y < brickY + brickHeight
						) {
							dy = -dy;
							b.status = 0;
							newScore++;
						}
					}
				}
			}
			return {
				...state,
				x,
				y,
				dx,
				dy,
				paddleX,
				bricks: newBricks,
				score: newScore,
				lives,
			};
		}
		case "KEY_DOWN":
			if (action.key === "Right" || action.key === "ArrowRight") {
				return { ...state, rightPressed: true };
			}
			if (action.key === "Left" || action.key === "ArrowLeft") {
				return { ...state, leftPressed: true };
			}
			return state;
		case "KEY_UP":
			if (action.key === "Right" || action.key === "ArrowRight") {
				return { ...state, rightPressed: false };
			}
			if (action.key === "Left" || action.key === "ArrowLeft") {
				return { ...state, leftPressed: false };
			}
			return state;
		case "MOUSE_MOVE":
			return {
				...state,
				paddleX: Math.max(
					0,
					Math.min(action.x - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH),
				),
			};
		default:
			return state;
	}
}

const GameBreakout: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// ロゴ画像の読み込み
		const logoImg = new window.Image();
		logoImg.src = '/app/game-breakout/logo.jpg';
		let logoImgLoaded = false;
		logoImg.onload = () => {
			logoImgLoaded = true;
		};

		// 描画関数（stateを参照）
		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			// ブロック
			for (let c = 0; c < state.bricks.length; c++) {
				for (let r = 0; r < state.bricks[c].length; r++) {
					const b = state.bricks[c][r];
					if (b.status === 1) {
						ctx.beginPath();
						ctx.rect(b.x, b.y, 75, 20);
						ctx.fillStyle = "#0095DD";
						ctx.fill();
						ctx.closePath();
					}
				}
			}
			// ボール
			if (logoImgLoaded) {
				ctx.drawImage(
					logoImg,
					state.x - BALL_RADIUS,
					state.y - BALL_RADIUS,
					BALL_RADIUS * 2,
					BALL_RADIUS * 2
				);
			} else {
				ctx.beginPath();
				ctx.arc(state.x, state.y, BALL_RADIUS, 0, Math.PI * 2);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
			// パドル
			ctx.beginPath();
			ctx.rect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
			// スコア
			ctx.font = "16px Arial";
			ctx.fillStyle = "#0095DD";
			ctx.fillText(`Score: ${state.score}`, 8, 20);
			// ライフ
			ctx.font = "16px Arial";
			ctx.fillStyle = "#0095DD";
			ctx.fillText(`Lives: ${state.lives}`, CANVAS_WIDTH - 65, 20);
		}

		let animationFrameId: number;
		function loop() {
			draw();
			dispatch({ type: "TICK" });
			animationFrameId = requestAnimationFrame(loop);
		}
		animationFrameId = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [state]);

	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			dispatch({ type: "KEY_DOWN", key: e.key });
		}
		function keyUpHandler(e: KeyboardEvent) {
			dispatch({ type: "KEY_UP", key: e.key });
		}
		function mouseMoveHandler(e: MouseEvent) {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const relativeX = e.clientX - canvas.offsetLeft;
			if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
				dispatch({ type: "MOUSE_MOVE", x: relativeX });
			}
		}
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);
		return () => {
			document.removeEventListener("keydown", keyDownHandler, false);
			document.removeEventListener("keyup", keyUpHandler, false);
			document.removeEventListener("mousemove", mouseMoveHandler, false);
		};
	}, []);

	// ゲームクリア・ゲームオーバー時の副作用管理
	useEffect(() => {
		const totalBricks = 3 * 5; // brickRowCount * brickColumnCount
		if (state.score === totalBricks) {
			setTimeout(() => {
				alert("YOU WIN, CONGRATULATIONS!");
				window.location.reload();
			}, 100);
		} else if (state.lives === 0) {
			setTimeout(() => {
				alert("GAME OVER");
				window.location.reload();
			}, 100);
		}
	}, [state.score, state.lives]);

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

export { CANVAS_HEIGHT, CANVAS_WIDTH, createInitialState, PADDLE_WIDTH, reducer };
export default GameBreakout;
