#!/usr/bin/env node
// Start script que SEMPRE roda Express (nunca ng serve em produção)
import { execSync } from 'child_process';

try {
  console.log('📊 Preparando banco de dados...');
  execSync('node prepare.js', { stdio: 'inherit' });

  console.log('🚀 Iniciando servidor Express...');
  execSync('node server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}
