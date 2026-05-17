# SEEDMON 🚀

**Sistema de IA para Marketing de Afiliados com Auto-Reparação**

Um sistema inteligente que monitora redes sociais em tempo real, detecta oportunidades de venda, gera links de afiliado e automatiza respostas com aprovação humana.

## 🎯 Características Principais

- **🧠 SeedBrain**: IA orquestradora que analisa intenção de compra com score de confiança
- **🕵️ SocialSniffer**: Monitora Twitter/X, Instagram e outras plataformas 24/7
- **💰 AffiliateEngine**: Busca e otimiza links de afiliados (Shopee, Amazon)
- **🤖 TelegramBot**: Centro de comando remoto com notificações em tempo real
- **🔄 EvolutionEngine**: Auto-reparo inteligente e melhoria contínua
- **🔐 Segurança**: Criptografia AES-256, validação de humanidade no ciclo

## 📋 Arquitetura

```
┌─────────────────────────────────────┐
│   Social Media (Twitter, Instagram) │
└──────────────┬──────────────────────┘
               │
       ┌───────▼────────┐
       │ SocialSniffer  │  🕵️ Detecção de palavras-chave
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │   SeedBrain    │  🧠 Análise de IA
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │ AffiliateEngine│  💰 Links + Comissões
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │  TelegramBot   │  🤖 Notificação do Usuário
       └───────┬────────┘
               │
          👤 Aprovação Manual
               │
       ┌───────▼────────┐
       │ Auto-Publicar  │  📤 Resposta na Rede Social
       └────────────────┘
```

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose
- Variáveis de ambiente configuradas

### Instalação

```bash
# Clone o repositório
git clone https://github.com/neiiiii/seedmon.git
cd seedmon

# Configure o ambiente
cp .env.example .env
# Edite .env com suas chaves de API

# Suba com Docker
docker-compose up -d --build

# Verifique status
docker-compose logs -f seed-nucleus
```

## 📊 Endpoints da API

### Health Check
```bash
GET /health
```

### Dashboard
```bash
GET /api/dashboard
```
Retorna métricas de performance do sistema.

### Análise de Intenção
```bash
POST /api/analyze-intent
Content-Type: application/json

{
  "platform": "Twitter",
  "user": "user_123",
  "text": "Alguém recomenda um fone bluetooth?",
  "originalId": "tweet_001"
}
```

### Buscar Link de Afiliado
```bash
POST /api/affiliate/search
Content-Type: application/json

{
  "product_name": "Fone Bluetooth",
  "platform": "shopee"
}
```

### Status do Sniffer
```bash
GET /api/sniffer/status
```

## 🤖 Comandos Telegram

```
/start              - Bem-vindo ao SEEDMON
/status             - Verifica se sistema está online
/oportunidades      - Lista oportunidades pendentes
/lucro              - Mostra comissões do dia
/pausa              - Pausa o monitoramento
```

## 🔧 Módulos

### src/nucleus/SeedBrain.js
Cérebro IA que:
- Analisa intenção de compra
- Sugere produtos relevantes
- Calcula score de oportunidade
- Gera respostas criativas (AIDA)

### src/providers/SocialSniffer.js
Monitor que:
- Escaneia redes sociais a cada 10 minutos
- Filtra por 10+ palavras-chave de venda
- Envia oportunidades para análise

### src/services/AffiliateEngine.js
Motor de afiliados que:
- Integra com Shopee (comissão: 5%)
- Integra com Amazon (comissão: 4%)
- Rastreia cliques e conversões
- Gera relatórios de comissão

### src/bot/TelegramBot.js
Centro de comando que:
- Notifica em tempo real
- Botões de aprovação/rejeição
- Comandos remotos
- Logs de ações

### src/evolution/EvolutionEngine.js
Auto-reparo que:
- Monitora erros críticos
- Propõe patches via IA
- Faz backup automático
- Executa rollback se necessário

## 💰 Fluxo de Geração de Receita

1. **Detecção** (2 seg): Sniffer encontra post relevante
2. **Análise** (1 seg): IA calcula score de confiança
3. **Afiliação** (500ms): Sistema busca melhor link
4. **Notificação** (1 seg): Telegram avisa usuário
5. **Aprovação** (variável): Você decide se aprova
6. **Publicação** (1 seg): Sistema publica resposta
7. **Conversão** (variável): Usuário clica link
8. **Receita**: Você recebe a comissão 💵

## 📈 Estatísticas Esperadas

- **Taxa de Detecção**: 1.250+ posts/dia
- **Posts Qualificados**: ~85 oportunidades/dia
- **Taxa de Conversão**: 8-14%
- **Comissão Média**: R$ 15-50 por conversão
- **Receita Estimada**: R$ 100-500/dia

## 🔒 Segurança

- ✅ Criptografia AES-256 para chaves de API
- ✅ Humanização: Delays aleatórios entre respostas
- ✅ Aprovação Manual: Humano no ciclo antes de publicar
- ✅ Rate Limiting: Evita bloqueios por spam
- ✅ Backup Automático: Recuperação de falhas

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Testes
npm test

# Build do Docker
npm run docker:build
```

## 📝 Variáveis de Ambiente

```bash
# IA APIs
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
DEEPSEEK_API_KEY=ds-...

# Redes Sociais
TWITTER_BEARER_TOKEN=...
IG_ACCESS_TOKEN=...

# Afiliados
SHOPEE_AFFILIATE_ID=...
AMAZON_ASSOCIATE_TAG=...

# Infraestrutura
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
MONGO_URI=mongodb://seed_db:27017/seedmon
REDIS_URL=redis://seed_cache:6379
```

## 🐛 Troubleshooting

**"Telegram Bot não conecta"**
- Verifique `TELEGRAM_BOT_TOKEN` no `.env`
- Confira se token é válido no @BotFather

**"Twitter API falha"**
- Confirme `TWITTER_BEARER_TOKEN`
- Verifique limite de requisições

**"MongoDB não inicia"**
- Limpe `data/db/`
- Execute `docker-compose up -d seed-db`

## 📚 Roadmap

- [ ] Dashboard web em React
- [ ] Integração com mais plataformas (TikTok, Reddit)
- [ ] Machine learning para otimizar score
- [ ] Webhook para integrações externas
- [ ] API GraphQL
- [ ] Analytics avançado

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou PR.

## 📄 Licença

MIT - veja LICENSE para detalhes

## 👤 Autor

**neiiiii** - [GitHub](https://github.com/neiiiii)

---

**Desenvolvido com ❤️ e IA** 🚀
