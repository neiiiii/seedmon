#!/bin/bash
echo "🛡️  SEEDMON: INICIANDO DEPLOY..."

# 1. Verifica se o Docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo "❌ Erro: Docker não instalado."
  echo "Instale Docker em: https://docs.docker.com/install/"
  exit 1
fi

# 2. Verifica Docker Compose
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "❌ Erro: Docker Compose não instalado."
  exit 1
fi

echo "✅ Docker encontrado"
echo ""

# 3. Cria diretórios necessários
echo "📁 Criando estrutura de diretórios..."
mkdir -p data/db data/redis

# 4. Copia arquivo de exemplo
if [ ! -f .env ]; then
  echo "📋 Copiando .env.example para .env..."
  cp .env.example .env
  echo "⚠️  Edite o arquivo .env com suas chaves de API!"
fi

# 5. Constrói a imagem
echo ""
echo "🔨 Construindo imagem Docker..."
docker-compose build

# 6. Inicia os serviços
echo ""
echo "🚀 Iniciando serviços..."
docker-compose up -d

# 7. Aguarda iniciação
echo ""
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 5

# 8. Verifica health
echo ""
echo "🏥 Verificando saúde do sistema..."
curl -s http://localhost:5000/health | json_pp || echo "⏳ Sistema ainda iniciando..."

echo ""
echo "✅ SEEDMON INICIADO COM SUCESSO!"
echo ""
echo "📊 Acesse:"
echo "   Dashboard: http://localhost:5000/api/dashboard"
echo "   Health: http://localhost:5000/health"
echo ""
echo "📋 Para ver logs:"
echo "   docker-compose logs -f seed-nucleus"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"
