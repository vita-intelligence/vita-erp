/**
 * Expression Evaluator — safe math expression parser for calculated fields.
 *
 * Does NOT use eval() — parses manually via recursive descent for security.
 *
 * Supported:
 *   Arithmetic:   +  -  *  /  %  ^  (parentheses)
 *   Comparison:   >  >=  <  <=  ==  !=    → returns 1 (true) or 0 (false)
 *   Functions:    round, floor, ceil, int, abs, min, max, pow, sqrt, mod,
 *                 if, coalesce, clamp
 *   Constants:    pi
 *   References:   {field_id}
 *
 * Usage:
 *   evaluateExpression("{qty} * {price}", { qty: 10, price: 25.5 })  → 255
 *   evaluateExpression("round({total}, 2)", { total: 12.3456 })      → 12.35
 *   evaluateExpression("if({qty} > 100, {qty} * 0.9, {qty})", ...)   → discount
 */

// ── Token Types ─────────────────────────────────────────────────────────────

type Token =
  | { type: "number"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" | "%" | "^" }
  | { type: "cmp"; value: ">" | ">=" | "<" | "<=" | "==" | "!=" }
  | { type: "paren"; value: "(" | ")" }
  | { type: "comma"; value: "," }
  | { type: "func"; value: string };

// ── Tokenizer ───────────────────────────────────────────────────────────────

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Skip whitespace
    if (ch === " " || ch === "\t" || ch === "\n") {
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

    // Two-character comparison operators (must check before single-char)
    if (i + 1 < expr.length) {
      const two = expr[i] + expr[i + 1];
      if (two === ">=" || two === "<=" || two === "==" || two === "!=") {
        tokens.push({
          type: "cmp",
          value: two as Token & { type: "cmp" } extends { value: infer V }
            ? V
            : never,
        });
        i += 2;
        continue;
      }
    }

    // Single-character comparison operators
    if (ch === ">" || ch === "<") {
      tokens.push({ type: "cmp", value: ch });
      i++;
      continue;
    }

    // Arithmetic operators
    if ("+-*/%^".includes(ch)) {
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

    // Comma (function argument separator)
    if (ch === ",") {
      tokens.push({ type: "comma", value: "," });
      i++;
      continue;
    }

    // Identifier (function name or constant)
    if (/[a-zA-Z_]/.test(ch)) {
      let name = "";
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        name += expr[i++];
      }
      // Check constants
      if (name === "pi") {
        tokens.push({ type: "number", value: Math.PI });
      } else {
        tokens.push({ type: "func", value: name });
      }
      continue;
    }

    // Unknown character — skip
    i++;
  }

  return tokens;
}

// ── Recursive Descent Parser ────────────────────────────────────────────────
// Precedence (low → high): comparison → addition → multiplication → power → unary/factor

function parseComparison(tokens: Token[], pos: { i: number }): number {
  const left = parseAddition(tokens, pos);

  if (pos.i < tokens.length && tokens[pos.i].type === "cmp") {
    const op = (tokens[pos.i] as { type: "cmp"; value: string }).value;
    pos.i++;
    const right = parseAddition(tokens, pos);

    switch (op) {
      case ">":
        return left > right ? 1 : 0;
      case ">=":
        return left >= right ? 1 : 0;
      case "<":
        return left < right ? 1 : 0;
      case "<=":
        return left <= right ? 1 : 0;
      case "==":
        return left === right ? 1 : 0;
      case "!=":
        return left !== right ? 1 : 0;
      default:
        return left;
    }
  }

  return left;
}

function parseAddition(tokens: Token[], pos: { i: number }): number {
  let left = parseMultiplication(tokens, pos);
  while (
    pos.i < tokens.length &&
    tokens[pos.i].type === "op" &&
    (tokens[pos.i].value === "+" || tokens[pos.i].value === "-")
  ) {
    const op = tokens[pos.i].value;
    pos.i++;
    const right = parseMultiplication(tokens, pos);
    left = op === "+" ? left + right : left - right;
  }
  return left;
}

function parseMultiplication(tokens: Token[], pos: { i: number }): number {
  let left = parsePower(tokens, pos);
  while (
    pos.i < tokens.length &&
    tokens[pos.i].type === "op" &&
    (tokens[pos.i].value === "*" ||
      tokens[pos.i].value === "/" ||
      tokens[pos.i].value === "%")
  ) {
    const op = tokens[pos.i].value;
    pos.i++;
    const right = parsePower(tokens, pos);
    if (op === "*") left = left * right;
    else if (op === "/") left = right !== 0 ? left / right : 0;
    else left = right !== 0 ? left % right : 0;
  }
  return left;
}

function parsePower(tokens: Token[], pos: { i: number }): number {
  const base = parseFactor(tokens, pos);
  if (
    pos.i < tokens.length &&
    tokens[pos.i].type === "op" &&
    tokens[pos.i].value === "^"
  ) {
    pos.i++;
    const exp = parseFactor(tokens, pos);
    return base ** exp;
  }
  return base;
}

function parseFactor(tokens: Token[], pos: { i: number }): number {
  const token = tokens[pos.i];
  if (!token) return 0;

  // Number literal
  if (token.type === "number") {
    pos.i++;
    return token.value;
  }

  // Function call: name(arg1, arg2, ...)
  if (token.type === "func") {
    const name = token.value;
    pos.i++;
    // Expect opening paren
    if (
      pos.i < tokens.length &&
      tokens[pos.i].type === "paren" &&
      tokens[pos.i].value === "("
    ) {
      pos.i++;
      const args = parseArgList(tokens, pos);
      // Skip closing paren
      if (
        pos.i < tokens.length &&
        tokens[pos.i].type === "paren" &&
        tokens[pos.i].value === ")"
      ) {
        pos.i++;
      }
      return callFunction(name, args);
    }
    // Function name without parens — return 0
    return 0;
  }

  // Parenthesized expression
  if (token.type === "paren" && token.value === "(") {
    pos.i++;
    const result = parseComparison(tokens, pos);
    if (
      pos.i < tokens.length &&
      tokens[pos.i].type === "paren" &&
      tokens[pos.i].value === ")"
    ) {
      pos.i++;
    }
    return result;
  }

  // Unary minus
  if (token.type === "op" && token.value === "-") {
    pos.i++;
    return -parseFactor(tokens, pos);
  }

  // Unary plus
  if (token.type === "op" && token.value === "+") {
    pos.i++;
    return parseFactor(tokens, pos);
  }

  return 0;
}

/** Parse comma-separated argument list (each arg is a full comparison expression). */
function parseArgList(tokens: Token[], pos: { i: number }): number[] {
  const args: number[] = [];

  // Empty arg list: func()
  if (
    pos.i < tokens.length &&
    tokens[pos.i].type === "paren" &&
    tokens[pos.i].value === ")"
  ) {
    return args;
  }

  args.push(parseComparison(tokens, pos));

  while (pos.i < tokens.length && tokens[pos.i].type === "comma") {
    pos.i++; // skip comma
    args.push(parseComparison(tokens, pos));
  }

  return args;
}

// ── Built-in Functions ──────────────────────────────────────────────────────

function callFunction(name: string, args: number[]): number {
  const a = args[0] ?? 0;
  const b = args[1] ?? 0;

  switch (name) {
    // ── Rounding ──
    case "round": {
      // round(value) or round(value, decimals)
      const decimals = args.length > 1 ? Math.round(b) : 0;
      const factor = 10 ** decimals;
      return Math.round(a * factor) / factor;
    }
    case "floor":
      return Math.floor(a);
    case "ceil":
      return Math.ceil(a);
    case "int":
      return Math.trunc(a);

    // ── Basic math ──
    case "abs":
      return Math.abs(a);
    case "sqrt":
      return Math.sqrt(a);
    case "pow":
      return a ** b;
    case "mod":
      return b !== 0 ? a % b : 0;
    case "log":
      return Math.log(a);
    case "log10":
      return Math.log10(a);
    case "exp":
      return Math.exp(a);

    // ── Min / Max / Clamp (variadic) ──
    case "min":
      return args.length > 0 ? Math.min(...args) : 0;
    case "max":
      return args.length > 0 ? Math.max(...args) : 0;
    case "clamp":
      // clamp(value, min, max)
      return Math.min(Math.max(a, b), args[2] ?? b);

    // ── Trigonometry ──
    case "sin":
      return Math.sin(a);
    case "cos":
      return Math.cos(a);
    case "tan":
      return Math.tan(a);
    case "asin":
      return Math.asin(a);
    case "acos":
      return Math.acos(a);
    case "atan":
      return Math.atan(a);
    case "atan2":
      return Math.atan2(a, b);

    // ── Conditional ──
    case "if":
      // if(condition, value_if_true, value_if_false)
      return a !== 0 ? b : (args[2] ?? 0);

    // ── Utility ──
    case "coalesce":
      // Return first non-zero, non-NaN argument
      for (const arg of args) {
        if (arg !== 0 && !Number.isNaN(arg)) return arg;
      }
      return 0;

    case "number":
      return Number(a) || 0;

    default:
      return 0;
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

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
    return parseComparison(tokens, pos);
  } catch {
    return Number.NaN;
  }
}

// ── Documentation Export (for UI hints) ─────────────────────────────────────

/** All available functions with their signatures, for display in the editor. */
export const EXPRESSION_FUNCTIONS = [
  {
    name: "round",
    signature: "round(value, decimals?)",
    description: "Round to N decimal places (default 0)",
  },
  {
    name: "floor",
    signature: "floor(value)",
    description: "Round down to integer",
  },
  {
    name: "ceil",
    signature: "ceil(value)",
    description: "Round up to integer",
  },
  {
    name: "int",
    signature: "int(value)",
    description: "Truncate to integer (drop decimals)",
  },
  { name: "abs", signature: "abs(value)", description: "Absolute value" },
  { name: "sqrt", signature: "sqrt(value)", description: "Square root" },
  {
    name: "pow",
    signature: "pow(base, exponent)",
    description: "Raise to power (also: base ^ exponent)",
  },
  {
    name: "mod",
    signature: "mod(a, b)",
    description: "Remainder of a / b (also: a % b)",
  },
  {
    name: "min",
    signature: "min(a, b, ...)",
    description: "Smallest of all arguments",
  },
  {
    name: "max",
    signature: "max(a, b, ...)",
    description: "Largest of all arguments",
  },
  {
    name: "clamp",
    signature: "clamp(value, min, max)",
    description: "Constrain value between min and max",
  },
  {
    name: "if",
    signature: "if(condition, then, else)",
    description:
      "Conditional: returns then if condition is true (nonzero), else otherwise",
  },
  {
    name: "coalesce",
    signature: "coalesce(a, b, ...)",
    description: "First non-zero argument",
  },
  { name: "log", signature: "log(value)", description: "Natural logarithm" },
  {
    name: "log10",
    signature: "log10(value)",
    description: "Base-10 logarithm",
  },
  {
    name: "exp",
    signature: "exp(value)",
    description: "e raised to the power of value",
  },
  { name: "sin", signature: "sin(radians)", description: "Sine" },
  { name: "cos", signature: "cos(radians)", description: "Cosine" },
  { name: "tan", signature: "tan(radians)", description: "Tangent" },
] as const;
