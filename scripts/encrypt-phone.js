// Utilitário CLI para Criptografar o Número de Telefone (+5561986813857)
import { encryptPhone, generateKeyHex } from '../server/crypto.js';

const PHONE_TO_ENCRYPT = process.argv[2] || '+5561986813857';
const keyHex = generateKeyHex();

try {
  const encryptedPayload = encryptPhone(PHONE_TO_ENCRYPT, keyHex);

  console.log('====================================================');
  console.log('🔒 RESULTADO DA CRIPTOGRAFIA AES-256-GCM');
  console.log('====================================================');
  console.log(`Telefone Original: ${PHONE_TO_ENCRYPT}`);
  console.log(`Chave 256-bits (PHONE_ENCRYPTION_KEY): ${keyHex}`);
  console.log(`Payload Cifrado (ENCRYPTED_PHONE_NUMBER): ${encryptedPayload}`);
  console.log('====================================================');
  console.log('⚠️ IMPORTANTE: Guarde a chave em uma variável de ambiente no servidor/serverless.');
  console.log('Nunca envie a chave nem o telefone em texto claro para o repositório público.');
  console.log('====================================================');
} catch (err) {
  console.error('❌ Erro durante a criptografia:', err.message);
  process.exit(1);
}
