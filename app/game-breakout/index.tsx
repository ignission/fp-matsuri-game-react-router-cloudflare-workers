import type React from "react";
import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;
const BALL_RADIUS = 10;

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

		function drawBall() {
			if (!ctx) return;
			ctx.beginPath();
			ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
		}

		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			drawBall();

			// 壁との衝突判定
			if (x + dx > CANVAS_WIDTH - BALL_RADIUS || x + dx < BALL_RADIUS) {
				dx = -dx;
			}
			if (y + dy > CANVAS_HEIGHT - BALL_RADIUS || y + dy < BALL_RADIUS) {
				dy = -dy;
			}

			x += dx;
			y += dy;
		}

		let animationFrameId: number;
		function renderLoop() {
			draw();
			animationFrameId = requestAnimationFrame(renderLoop);
		}
		renderLoop();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div style={{ textAlign: "center" }}>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ background: "#eee", display: "block", margin: "0 auto" }}
			/>
		</div>
	);
};

export default GameBreakout;
