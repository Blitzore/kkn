/**
 * GATE-BOT — Boolean Logic Evaluator Module
 * File: js/gatebot/gatebotEvaluator.js
 * Parses and evaluates boolean logic expressions safely (Shunting-Yard algorithm)
 * Generates human-readable truth evaluation steps for classroom projectors
 */

(function() {
    'use strict';

    class GateBotEvaluator {
        static normalizeString(raw) {
            if (!raw) return '';
            let s = raw.trim();

            const wrapperMatch = s.match(/^(?:IF|JIKA|bukaGerbang|buka)\s*\((.*)\)\s*;?$/i);
            if (wrapperMatch) {
                s = wrapperMatch[1].trim();
            }

            s = s.replace(/&&/g, ' AND ')
                 .replace(/\|\|/g, ' OR ')
                 .replace(/!/g, ' NOT ')
                 .replace(/\bDAN\b/gi, ' AND ')
                 .replace(/\bATAU\b/gi, ' OR ')
                 .replace(/\b(?:TIDAK|BUKAN)\b/gi, ' NOT ');

            s = s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
            return s.trim().replace(/\s+/g, ' ');
        }

        static tokenize(normalizedStr) {
            if (!normalizedStr) return [];
            return normalizedStr.split(' ').filter(t => t.length > 0);
        }

        /**
         * Evaluates a logic expression and returns truth result & equation representation
         */
        static evaluate(expressionStr, contextObj, allowedKeys) {
            const normalized = this.normalizeString(expressionStr);
            if (!normalized) {
                return { valid: false, error: 'Aturan logika belum ditentukan.' };
            }

            const tokens = this.tokenize(normalized);
            const outputQueue = [];
            const opStack = [];

            const precedence = {
                'NOT': 3,
                'AND': 2,
                'OR': 1
            };

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const upper = token.toUpperCase();

                if (upper === 'AND' || upper === 'OR') {
                    while (
                        opStack.length > 0 &&
                        opStack[opStack.length - 1] !== '(' &&
                        precedence[opStack[opStack.length - 1]] >= precedence[upper]
                    ) {
                        outputQueue.push(opStack.pop());
                    }
                    opStack.push(upper);
                } else if (upper === 'NOT') {
                    opStack.push('NOT');
                } else if (token === '(') {
                    opStack.push('(');
                } else if (token === ')') {
                    let foundLeftParen = false;
                    while (opStack.length > 0) {
                        const top = opStack.pop();
                        if (top === '(') {
                            foundLeftParen = true;
                            break;
                        }
                        outputQueue.push(top);
                    }
                    if (!foundLeftParen) {
                        return { valid: false, error: 'Tanda kurung tutup ")" tidak memiliki kurung buka.' };
                    }
                } else {
                    const varKey = Object.keys(contextObj).find(k => k.toLowerCase() === token.toLowerCase());
                    if (!varKey) {
                        return {
                            valid: false,
                            error: `Atribut <code>${token}</code> tidak dikenal pada level ini.`
                        };
                    }
                    outputQueue.push(varKey);
                }
            }

            while (opStack.length > 0) {
                const top = opStack.pop();
                if (top === '(' || top === ')') {
                    return { valid: false, error: 'Terdapat tanda kurung yang belum ditutup.' };
                }
                outputQueue.push(top);
            }

            // Evaluate RPN queue
            const valStack = [];
            for (const item of outputQueue) {
                if (item === 'AND') {
                    if (valStack.length < 2) return { valid: false, error: 'Operator AND memerlukan dua kondisi.' };
                    const b = valStack.pop();
                    const a = valStack.pop();
                    valStack.push(Boolean(a && b));
                } else if (item === 'OR') {
                    if (valStack.length < 2) return { valid: false, error: 'Operator OR memerlukan dua kondisi.' };
                    const b = valStack.pop();
                    const a = valStack.pop();
                    valStack.push(Boolean(a || b));
                } else if (item === 'NOT') {
                    if (valStack.length < 1) return { valid: false, error: 'Operator NOT harus diletakkan sebelum atribut.' };
                    const a = valStack.pop();
                    valStack.push(Boolean(!a));
                } else {
                    valStack.push(Boolean(contextObj[item]));
                }
            }

            if (valStack.length !== 1) {
                return { valid: false, error: 'Susunan ekspresi logika belum lengkap.' };
            }

            // Generate truth equation string for projector demonstration
            const equationTokens = tokens.map(t => {
                const upper = t.toUpperCase();
                if (upper === 'AND' || upper === 'OR' || upper === 'NOT' || t === '(' || t === ')') {
                    return t;
                }
                const varKey = Object.keys(contextObj).find(k => k.toLowerCase() === t.toLowerCase());
                const val = varKey ? Boolean(contextObj[varKey]) : false;
                return `${t}(${val ? 'TRUE' : 'FALSE'})`;
            });

            return {
                valid: true,
                result: valStack[0],
                equationStr: `${equationTokens.join(' ')} ➔ ${valStack[0] ? 'TRUE' : 'FALSE'}`
            };
        }
    }

    if (typeof window !== 'undefined') {
        window.GateBotEvaluator = GateBotEvaluator;
    }
})();
