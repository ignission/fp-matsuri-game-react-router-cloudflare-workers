import { describe, expect, it } from 'vitest';
import { CANVAS_HEIGHT, createInitialState, reducer } from './index';

// テスト用のAction型
const KEY_RIGHT = { type: 'KEY_DOWN', key: 'ArrowRight' } as const;
const KEY_LEFT = { type: 'KEY_DOWN', key: 'ArrowLeft' } as const;
const KEY_UP_RIGHT = { type: 'KEY_UP', key: 'ArrowRight' } as const;
const KEY_UP_LEFT = { type: 'KEY_UP', key: 'ArrowLeft' } as const;


describe('GameBreakout reducer', () => {
  it('初期状態でTICKするとボールが動く', () => {
    const state = createInitialState();
    const next = reducer(state, { type: 'TICK' });
    expect(next.x).not.toBe(state.x);
    expect(next.y).not.toBe(state.y);
  });

  it('右キー押下でrightPressedがtrueになる', () => {
    const state = createInitialState();
    const next = reducer(state, KEY_RIGHT);
    expect(next.rightPressed).toBe(true);
  });

  it('左キー押下でleftPressedがtrueになる', () => {
    const state = createInitialState();
    const next = reducer(state, KEY_LEFT);
    expect(next.leftPressed).toBe(true);
  });

  it('右キー離すとrightPressedがfalseになる', () => {
    const state = { ...createInitialState(), rightPressed: true };
    const next = reducer(state, KEY_UP_RIGHT);
    expect(next.rightPressed).toBe(false);
  });

  it('左キー離すとleftPressedがfalseになる', () => {
    const state = { ...createInitialState(), leftPressed: true };
    const next = reducer(state, KEY_UP_LEFT);
    expect(next.leftPressed).toBe(false);
  });

  it('マウス移動でpaddleXが変わる', () => {
    const state = createInitialState();
    const next = reducer(state, { type: 'MOUSE_MOVE', x: 100 });
    expect(next.paddleX).not.toBe(state.paddleX);
  });

  it('ライフが0になるとそのまま0で止まる', () => {
    let state = { ...createInitialState(), lives: 1, y: CANVAS_HEIGHT - 10, dy: 2, x: 0, paddleX: 100 };
    // ボールが下に抜ける状況を作る（パドルの範囲外）
    state = reducer(state, { type: 'TICK' });
    expect(state.lives).toBe(0);
  });
}); 