import type React from "react";
import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;

const GameBreakout: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// 赤い四角形
		ctx.beginPath();
		ctx.rect(20, 40, 50, 50);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();

		// 緑の円
		ctx.beginPath();
		ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();

		// 青い枠の四角形
		ctx.beginPath();
		ctx.rect(160, 10, 100, 40);
		ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
		ctx.stroke();
		ctx.closePath();
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
