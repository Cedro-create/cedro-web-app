#!/usr/bin/env node
// Start script que roda Express (com inicialização automática do banco no server.js)
import { execSync } from 'child_process';

try {
  console.log('🚀 Iniciando servidor Express...');
  execSync('node server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}
