import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
  it('deve passar um teste básico', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve testar strings', () => {
    expect('hello').toBe('hello');
  });
});