// Módulo de Criptografia AES-256-GCM para Dados Sensíveis (ex: Telefone)
import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits para AES-GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Criptografa uma string usando AES-256-GCM.
 * @param {string} text - Texto em claro a ser criptografado.
 * @param {string} keyHex - Chave secreta de 256 bits (64 caracteres hexadecimais).
 * @returns {string} Payload no formato: iv_hex:auth_tag_hex:ciphertext_hex
 */
export function encryptPhone(text, keyHex) {
  if (!text || typeof text !== 'string') {
    throw new Error('Texto inválido para criptografia.');
  }

  if (!keyHex || keyHex.length !== 64) {
    throw new Error('Chave de criptografia inválida. Requer chave hex de 256 bits (64 chars).');
  }

  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Descriptografa um payload AES-256-GCM.
 * @param {string} payload - String no formato iv_hex:auth_tag_hex:ciphertext_hex.
 * @param {string} keyHex - Chave secreta de 256 bits (64 caracteres hexadecimais).
 * @returns {string} Texto em claro descriptografado.
 */
export function decryptPhone(payload, keyHex) {
  if (!payload || typeof payload !== 'string' || !payload.includes(':')) {
    throw new Error('Payload criptografado em formato inválido.');
  }

  if (!keyHex || keyHex.length !== 64) {
    throw new Error('Chave de criptografia inválida. Requer chave hex de 256 bits (64 chars).');
  }

  const parts = payload.split(':');
  if (parts.length !== 3) {
    throw new Error('Formato de payload AES-GCM corrompido ou incompleto.');
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Gera uma nova chave AES-256 aleatória em formato Hex (64 caracteres).
 * @returns {string} Chave Hex de 256 bits.
 */
export function generateKeyHex() {
  return crypto.randomBytes(32).toString('hex');
}
