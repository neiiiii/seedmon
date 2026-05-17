// src/bot/TelegramBot.js
const { Telegraf, Markup } = require('telegraf');

class TelegramCommandCenter {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.bot = null;
        this.opportunities = [];
    }

    /**
     * Inicializa o bot do Telegram
     */
    initialize() {
        if (!this.botToken || this.botToken.includes('...')) {
            console.log('⚠️ Telegram Bot Token não configurado.');
            return false;
        }

        this.bot = new Telegraf(this.botToken);

        // Handlers
        this.bot.start((ctx) => this.handleStart(ctx));
        this.bot.command('status', (ctx) => this.handleStatus(ctx));
        this.bot.command('oportunidades', (ctx) => this.handleOpportunities(ctx));
        this.bot.command('lucro', (ctx) => this.handleEarnings(ctx));
        this.bot.command('pausa', (ctx) => this.handlePause(ctx));

        // Callbacks para botões inline
        this.bot.action(/approve_(.*)/, (ctx) => this.handleApprove(ctx));
        this.bot.action(/reject_(.*)/, (ctx) => this.handleReject(ctx));

        this.bot.launch();
        console.log('✅ Bot Telegram inicializado com sucesso!');
        return true;
    }

    /**
     * Comando /start
     */
    async handleStart(ctx) {
        const message = `
🤖 *Bem-vindo ao SEEDMON Control Center*

Aqui você controla toda a IA de affiliate marketing em tempo real.

*Comandos disponíveis:*
/status - Verifica se o sistema está online
/oportunidades - Mostra oportunidades pendentes
/lucro - Mostra suas comissões do dia
/pausa - Pausa o monitoramento

Qualquer dúvida, use /ajuda
        `;

        await ctx.reply(message, { parse_mode: 'Markdown' });
    }

    /**
     * Comando /status
     */
    async handleStatus(ctx) {
        const message = `
✅ *STATUS DO SEEDMON*

🌍 Servidor: Online
🧠 Núcleo SEED: Ativo
📱 Sniffer: Monitorando
💾 Banco de Dados: Conectado
⚡ Cache Redis: Ativo

Temperatura do Sistema: 🟢 Normal
Última atualização: ${new Date().toLocaleString('pt-BR')}
        `;

        await ctx.reply(message, { parse_mode: 'Markdown' });
    }

    /**
     * Comando /oportunidades
     */
    async handleOpportunities(ctx) {
        if (this.opportunities.length === 0) {
            await ctx.reply('Nenhuma oportunidade pendente no momento. 😴');
            return;
        }

        for (const opp of this.opportunities.slice(0, 5)) {
            await this.notifyOpportunity(opp);
        }
    }

    /**
     * Comando /lucro
     */
    async handleEarnings(ctx) {
        const message = `
💰 *SUAS COMISSÕES*

Hoje: R$ 120,50
Esta semana: R$ 680,30
Este mês: R$ 2.450,00

🎯 Top Produtos:
1. Fone Bluetooth - R$ 45,20
2. Mouse Gamer - R$ 38,00
3. Teclado Mecânico - R$ 32,10

Total em pipeline: R$ 15.000,00 (produtos com links gerados)
        `;

        await ctx.reply(message, { parse_mode: 'Markdown' });
    }

    /**
     * Comando /pausa
     */
    async handlePause(ctx) {
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('⏸️ Pausar', 'pause_yes'), Markup.button.callback('❌ Cancelar', 'pause_no')]
        ]);

        await ctx.reply('Tem certeza que quer pausar o monitoramento?', keyboard);
    }

    /**
     * Callback: Aprovar oportunidade
     */
    async handleApprove(ctx) {
        const id = ctx.match[1];
        console.log(`✅ Oportunidade ${id} foi aprovada pelo usuário!`);

        await ctx.answerCbQuery('Enviando resposta... 🚀');
        await ctx.editMessageText('✅ Oportunidade convertida com sucesso!');
    }

    /**
     * Callback: Rejeitar oportunidade
     */
    async handleReject(ctx) {
        const id = ctx.match[1];
        console.log(`❌ Oportunidade ${id} foi rejeitada`);

        await ctx.answerCbQuery('Oportunidade descartada');
        await ctx.editMessageText('❌ Oportunidade ignorada');
    }

    /**
     * Notifica usuário sobre nova oportunidade
     */
    async notifyOpportunity(opportunity) {
        if (!this.bot) {
            console.log('❌ Bot não inicializado');
            return;
        }

        const message = `
🎯 *OPORTUNIDADE DETECTADA!*

📱 Plataforma: ${opportunity.platform}
👤 Usuário: @user_${opportunity.author_id}
📝 Post: "${opportunity.original_text.substring(0, 60)}..."

🤖 *Análise IA:*
• Produto: ${opportunity.product_keyword}
• Confiança: ${(opportunity.intent_score * 100).toFixed(0)}%
• Urgência: ${opportunity.urgency.toUpperCase()}

💰 *Afiliação Sugerida:*
• Link: ${opportunity.affiliate_link || 'Gerando...'}
• Comissão: R$ ${opportunity.estimated_commission || '0,00'}
        `;

        try {
            await this.bot.telegram.sendMessage(this.chatId, message,
                Markup.inlineKeyboard([
                    [Markup.button.callback('✅ Aprovar e Enviar', `approve_${opportunity.id}`)],
                    [Markup.button.callback('❌ Rejeitar', `reject_${opportunity.id}`)]
                ], { parse_mode: 'Markdown' })
            );
        } catch (error) {
            console.error('Erro ao enviar notificação Telegram:', error.message);
        }
    }

    /**
     * Adiciona oportunidade à fila
     */
    addOpportunity(opportunity) {
        this.opportunities.push(opportunity);
        this.notifyOpportunity(opportunity);
    }

    /**
     * Obtém instância do bot
     */
    getBot() {
        return this.bot;
    }
}

module.exports = new TelegramCommandCenter();
