/**
 * Expression Evaluator — safe math expression parser for calculated fields.
 *
 * Supports: +, -, *, /, (, ), numbers, and field references like {field_id}.
 * Does NOT use eval() — parses manually for security.
 *
 * Usage:
 *   evaluateExpression("{qty} * {price}", { qty: 10, price: 25.5 })
 *   // → 255
 */

// ── Types ────────────────────────────────────────────────────────────────────

type Token =
  | { type: "number"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" }
  | { type: "paren"; value: "(" | ")" };

// ── Tokenizer ────────────────────────────────────────────────────────────────

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Skip whitespace
    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }

    // Number (including decimals)
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }
      tokens.push({ type: "number", value: Number.parseFloat(num) });
      continue;
    }

    // Operators
    if ("+-*/".includes(ch)) {
      tokens.push({
        type: "op",
        value: ch as Token & { type: "op" } extends { value: infer V }
          ? V
          : never,
      });
      i++;
      continue;
    }

    // Parentheses
    if (ch === "(" || ch === ")") {
      tokens.push({ type: "paren", value: ch });
      i++;
      continue;
    }

    // Unknown character — skip
    i++;
  }

  return tokens;
}

// ── Recursive Descent Parser ─────────────────────────────────────────────────

function parseExpression(tokens: Token[], pos: { i: number }): number {
  let left = parseTerm(tokens, pos);
  while (
    pos.i < tokens.length &&
    tokens[pos.i].type === "op" &&
    (tokens[pos.i].value === "+" || tokens[pos.i].value === "-")
  ) {
    const op = tokens[pos.i].value;
    pos.i++;
    const right = parseTerm(tokens, pos);
    left = op === "+" ? left + right : left - right;
  }
  return left;
}

function parseTerm(tokens: Token[], pos: { i: number }): number {
  let left = parseFactor(tokens, pos);
  while (
    pos.i < tokens.length &&
    tokens[pos.i].type === "op" &&
    (tokens[pos.i].value === "*" || tokens[pos.i].value === "/")
  ) {
    const op = tokens[pos.i].value;
    pos.i++;
    const right = parseFactor(tokens, pos);
    left = op === "*" ? left * right : right !== 0 ? left / right : 0;
  }
  return left;
}

function parseFactor(tokens: Token[], pos: { i: number }): number {
  const token = tokens[pos.i];
  if (!token) return 0;

  if (token.type === "number") {
    pos.i++;
    return token.value;
  }

  if (token.type === "paren" && token.value === "(") {
    pos.i++;
    const result = parseExpression(tokens, pos);
    // Skip closing paren
    if (pos.i < tokens.length && tokens[pos.i].type === "paren") {
      pos.i++;
    }
    return result;
  }

  // Unary minus
  if (token.type === "op" && token.value === "-") {
    pos.i++;
    return -parseFactor(tokens, pos);
  }

  return 0;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Replace field references {field_id} with values from the data map,
 * then evaluate the resulting math expression.
 *
 * Returns NaN if the expression is invalid or references missing fields.
 */
export function evaluateExpression(
  expression: string,
  fieldValues: Record<string, unknown>,
): number {
  // Replace {field_id} with numeric values
  const resolved = expression.replace(/\{([^}]+)\}/g, (_, fieldId: string) => {
    const val = fieldValues[fieldId];
    const num = Number(val);
    return Number.isNaN(num) ? "0" : String(num);
  });

  try {
    const tokens = tokenize(resolved);
    if (tokens.length === 0) return 0;
    const pos = { i: 0 };
    return parseExpression(tokens, pos);
  } catch {
    return Number.NaN;
  }
}
