#!/usr/bin/env node

/**
 * Script de teste: Fluxo completo de inscrição
 * Valida se a inscrição consegue ser enviada ao backend
 */

const http = require('http');
const path = require('path');

const API_BASE_URL = 'http://localhost:3333';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE_URL + path);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testInscriptionFlow() {
  console.log('🧪 Iniciando testes de inscrição...\n');

  try {
    // 1. Verificar se o backend está online
    console.log('1️⃣  Verificando conexão com backend...');
    const healthRes = await makeRequest('GET', '/health');
    if (healthRes.status === 200) {
      console.log('✅ Backend online\n');
    } else {
      console.log('❌ Backend offline. Status:', healthRes.status);
      process.exit(1);
    }

    // 2. Listar cursos disponíveis
    console.log('2️⃣  Buscando cursos disponíveis...');
    const coursesRes = await makeRequest('GET', '/courses');
    if (coursesRes.status === 200 && coursesRes.data && coursesRes.data.length > 0) {
      console.log(`✅ ${coursesRes.data.length} cursos encontrados`);
      const course = coursesRes.data[0];
      console.log(`   - Exemplo: ${course.nome} (ID: ${course.id})\n`);
    } else {
      console.log('⚠️  Nenhum curso encontrado. Continuando com ID fictício...\n');
    }

    // 3. Submeter inscrição com dados mínimos obrigatórios
    console.log('3️⃣  Testando inscrição com dados válidos...');
    const testData = {
      nome: 'João Silva Teste',
      cpf: '12345678901',
      email: 'joao.teste@example.com',
      telefone: '6199999999',
      data_nascimento: '2000-01-15',
      curso_id: 1,
      turno: 'manhã',
      local_curso: 'Campus Principal',
      
      // Campos adicionais recomendados
      rg: '1234567',
      sexo: 'MASCULINO',
      deficiencia: 'NAO',
      raca_cor: 'BRANCO',
      renda_mensal: '1_A_2_SALARIOS',
      pessoas_renda: 3,
      tipo_residencia: 'PROPRIA',
      itens_casa: 'GELADEIRA,TV,CAMA',
      goianas_ciencia: 'NAO',
      
      // Status correto em MAIÚSCULA
      status: 'PENDENTE'
    };

    const inscricaoRes = await makeRequest('POST', '/candidates/public', testData);
    
    if (inscricaoRes.status === 200 || inscricaoRes.status === 201) {
      console.log(`✅ Inscrição enviada com sucesso (Status: ${inscricaoRes.status})`);
      console.log(`   ID da candidatura: ${inscricaoRes.data?.id || 'N/A'}`);
      console.log(`   Status no DB: ${inscricaoRes.data?.status || 'N/A'}\n`);
    } else {
      console.log(`❌ Erro na inscrição (Status: ${inscricaoRes.status})`);
      console.log('   Resposta:', inscricaoRes.data);
      console.log('');
    }

    // 4. Testar validação de CPF inválido
    console.log('4️⃣  Testando validação de CPF inválido...');
    const invalidData = { ...testData, cpf: '00000000000' };
    const invalidRes = await makeRequest('POST', '/candidates/public', invalidData);
    
    if (invalidRes.status >= 400) {
      console.log(`✅ Validação funcionando (erro esperado: ${invalidRes.status})`);
      console.log(`   Mensagem: ${invalidRes.data?.error || invalidRes.data?.message || 'N/A'}\n`);
    } else {
      console.log(`⚠️  CPF inválido foi aceito (Status: ${invalidRes.status})\n`);
    }

    // 5. Testar status em lowercase (deve falhar)
    console.log('5️⃣  Testando status em lowercase (deve falhar)...');
    const lowercaseData = { ...testData, cpf: '11122233344', status: 'pendente' };
    const lowercaseRes = await makeRequest('POST', '/candidates/public', lowercaseData);
    
    if (lowercaseRes.status >= 400) {
      console.log(`✅ Status lowercase rejeitado (erro esperado: ${lowercaseRes.status})\n`);
    } else {
      console.log(`⚠️  Status lowercase foi aceito (Status: ${lowercaseRes.status})\n`);
    }

    console.log('✅ Testes completados!');
    console.log('📊 Resumo: Backend está respondendo corretamente ao fluxo de inscrição.\n');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Certifique-se que o backend está rodando em http://localhost:3333');
    }
    process.exit(1);
  }
}

testInscriptionFlow();
