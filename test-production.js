#!/usr/bin/env node

/**
 * Script para testar a inscrição em produção
 * Envia dados de teste para a API de candidatos
 */

const https = require('https');

const API_URL = 'https://api-secti-go-privado.onrender.com/api/candidates/public';

const testData = {
  nome: 'Teste Inscrição',
  cpf: '12345678901',
  email: 'teste@example.com',
  telefone: '6199999999',
  data_nascimento: '2000-01-15',
  curso_id: 1,
  turno: 'MATUTINO',
  status: 'PENDENTE'
};

function makeRequest() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(testData);

    const url = new URL(API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      console.log(`\n📊 Status: ${res.statusCode}`);
      console.log('Headers:', res.headers);
      
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          resolve({
            status: res.statusCode,
            data: json,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function test() {
  console.log('🧪 Testando inscrição em produção...\n');
  console.log('URL:', API_URL);
  console.log('Payload:', testData);

  try {
    const response = await makeRequest();
    
    console.log('\n✅ Resposta recebida:');
    console.log('Status:', response.status);
    console.log('Dados:', JSON.stringify(response.data, null, 2));

    if (response.status >= 400) {
      console.log('\n❌ Erro detectado:');
      if (response.data?.error) {
        console.log('Erro:', response.data.error);
      }
      if (response.data?.issues) {
        console.log('Detalhes da validação:');
        console.log(JSON.stringify(response.data.issues, null, 2));
      }
      if (response.data?.message) {
        console.log('Mensagem:', response.data.message);
      }
    }

    process.exit(response.status >= 400 ? 1 : 0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

test();
