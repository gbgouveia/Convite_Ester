// Testes Unitários de Criptografia AES-256-GCM
import test from 'node:test';
import assert from 'node:assert';
import { encryptPhone, decryptPhone, generateKeyHex } from '../server/crypto.js';

test('Ciclo completo de Criptografia e Descriptografia AES-256-GCM', () => {
  const originalPhone = '+5561986813857';
  const keyHex = generateKeyHex();

  // 1. Criptografia
  const encryptedPayload = encryptPhone(originalPhone, keyHex);
  assert.strictEqual(typeof encryptedPayload, 'string');
  assert.strictEqual(encryptedPayload.split(':').length, 3, 'Payload deve conter IV, AuthTag e Ciphertext');

  // 2. Descriptografia
  const decryptedPhone = decryptPhone(encryptedPayload, keyHex);
  assert.strictEqual(decryptedPhone, originalPhone, 'Telefone descriptografado deve ser idêntico ao original');
});

test('Rejeição de AuthTag ou Payload adulterado (GCM Integrity)', () => {
  const originalPhone = '+5561986813857';
  const keyHex = generateKeyHex();
  const encryptedPayload = encryptPhone(originalPhone, keyHex);

  const parts = encryptedPayload.split(':');
  // Altera um caractere hex mantendo o comprimento par do hex
  const lastChar = parts[2].slice(-1);
  const newChar = lastChar === '0' ? '1' : '0';
  const corruptedCiphertext = parts[2].slice(0, -1) + newChar;
  const corruptedPayload = `${parts[0]}:${parts[1]}:${corruptedCiphertext}`;

  assert.throws(() => {
    decryptPhone(corruptedPayload, keyHex);
  }, /Unsupported state or unable to authenticate data|cipher|bad decrypt/i);
});

test('Validação de Chave Inválida', () => {
  const invalidKey = '123456';
  assert.throws(() => {
    encryptPhone('+5561986813857', invalidKey);
  }, /Chave de criptografia inválida/);
});
