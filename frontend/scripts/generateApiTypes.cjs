const fetch = require('node-fetch').default;
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const OPENAPI_URL = 'http://localhost:8000/openapi.json'; // URL do seu FastAPI
const OUTPUT_DIR = path.resolve(__dirname, '../src/api'); // Onde os tipos serão gerados
const OPENAPI_FILE = path.resolve(__dirname, '../temp/openapi.json'); // Arquivo temporário

async function generateApiTypes() {
  console.log('Iniciando geração de tipos da API...');

  // 1. Criar diretório temporário se não existir
  const tempDir = path.dirname(OPENAPI_FILE);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // 2. Baixar a especificação OpenAPI
  console.log(`Baixando OpenAPI de: ${OPENAPI_URL}`);
  try {
    const response = await fetch(OPENAPI_URL);
    if (!response.ok) {
      throw new Error(`Erro ao baixar OpenAPI: ${response.statusText}`);
    }
    const data = await response.json();
    fs.writeFileSync(OPENAPI_FILE, JSON.stringify(data, null, 2));
    console.log(`OpenAPI salvo em: ${OPENAPI_FILE}`);
  } catch (error) {
    console.error('Falha ao baixar OpenAPI. Certifique-se de que seu backend FastAPI está rodando.', error);
    process.exit(1); // Sai com erro se não conseguir baixar
  }

  // 3. Gerar tipos TypeScript usando swagger-typescript-api
  console.log('Gerando tipos TypeScript...');
  try {
    // Limpa o diretório de saída antes de gerar novamente
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Comando do swagger-typescript-api
    // -p: path para a especificação
    // -o: diretório de saída
    // --clean-output: (opcional) limpa o diretório de saída antes de gerar
    // --module-name-index: (opcional) como nomear os módulos (0 para nomear pelo caminho)
    // --union-enums: (opcional) gera enums como union types
    // ... veja a documentação para mais opções: https://github.com/acacode/swagger-typescript-api
    execSync(`swagger-typescript-api generate -p ${OPENAPI_FILE} -o ${OUTPUT_DIR} --clean-output --module-name-index 0 --union-enums`, { stdio: 'inherit' });
    console.log(`Tipos gerados em: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Falha ao gerar tipos TypeScript:', error.message);
    process.exit(1);
  } finally {
    // Limpar o arquivo temporário
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Limpeza de arquivos temporários concluída.');
  }

  console.log('Geração de tipos da API concluída com sucesso!');
}

generateApiTypes();