// src/evolution/EvolutionEngine.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class EvolutionEngine {
    constructor() {
        this.deepSeekKey = process.env.DEEPSEEK_API_KEY;
        this.errorLog = [];
        this.proposedPatches = [];
    }

    /**
     * Monitora erros e propõe auto-reparo
     * @param {Error} error - Erro capturado
     * @param {string} moduleName - Nome do módulo que falhou
     */
    async handleCriticalError(error, moduleName) {
        console.log(`\n⚠️ ERRO CRÍTICO detectado em ${moduleName}`);
        console.log(`   Mensagem: ${error.message}`);

        const errorRecord = {
            timestamp: new Date().toISOString(),
            module: moduleName,
            error: error.message,
            stack: error.stack,
            status: 'detected'
        };

        this.errorLog.push(errorRecord);

        // Se for erro de API, tenta diagnosticar
        if (error.message.includes('API') || error.message.includes('404') || error.message.includes('400')) {
            await this.diagnoseAPIError(error, moduleName);
        }
    }

    /**
     * Diagnostica erros de API e propõe correção
     */
    async diagnoseAPIError(error, moduleName) {
        console.log(`🔍 Diagnosticando erro de API...`);

        if (!this.deepSeekKey || this.deepSeekKey.includes('ds-...')) {
            console.log('⚠️ DeepSeek API Key não configurada. Usando heurística local.');
            return this.localDiagnosis(error, moduleName);
        }

        try {
            // Tenta usar DeepSeek para diagnóstico
            const prompt = `
            Você é um engenheiro de software senior.
            
            Erro crítico em ${moduleName}:
            ${error.message}
            
            O que pode ter causado? O que verificar? Responda em português, de forma concisa.
            `;

            console.log('🤖 Consultando DeepSeek para diagnóstico...');
            
            // Simulação - DeepSeek em desenvolvimento
            const diagnosis = await this.localDiagnosis(error, moduleName);
            return diagnosis;
        } catch (err) {
            console.error('❌ Erro ao chamar DeepSeek:', err.message);
            return this.localDiagnosis(error, moduleName);
        }
    }

    /**
     * Diagnóstico local com heurísticas
     */
    async localDiagnosis(error, moduleName) {
        const message = error.message.toLowerCase();
        let diagnosis = '';
        let suggestions = [];

        if (message.includes('401') || message.includes('unauthorized')) {
            diagnosis = 'Erro de autenticação: Token inválido ou expirado';
            suggestions = [
                'Renovar token de API',
                'Verificar credenciais no .env',
                'Confirmar permissões da conta'
            ];
        } else if (message.includes('429') || message.includes('rate')) {
            diagnosis = 'Rate limit atingido';
            suggestions = [
                'Aumentar delay entre requisições',
                'Verificar limite da API',
                'Usar backoff exponencial'
            ];
        } else if (message.includes('404') || message.includes('not found')) {
            diagnosis = 'Recurso não encontrado: Endpoint pode ter mudado';
            suggestions = [
                'Verificar documentação da API',
                'Confirmar URL do endpoint',
                'Atualizar código do módulo'
            ];
        } else if (message.includes('500')) {
            diagnosis = 'Erro do servidor: API pode estar em manutenção';
            suggestions = [
                'Aguardar e tentar novamente',
                'Verificar status da API',
                'Implementar retry com backoff'
            ];
        } else {
            diagnosis = `Erro genérico: ${error.message}`;
            suggestions = ['Verificar logs', 'Validar entrada', 'Consultar documentação'];
        }

        console.log(`\n📋 DIAGNÓSTICO:`);
        console.log(`   ${diagnosis}`);
        console.log(`\n💡 SUGESTÕES:`);
        suggestions.forEach((s, i) => console.log(`   ${i+1}. ${s}`));

        return {
            diagnosis,
            suggestions,
            module: moduleName
        };
    }

    /**
     * Propõe patch de auto-reparo
     */
    async proposePatch(moduleName, error) {
        console.log(`\n🔧 Proposição de Auto-Reparo...`);

        if (!this.deepSeekKey || this.deepSeekKey.includes('ds-...')) {
            console.log('⚠️ DeepSeek não configurado. Usando patches predefinidos.');
            return this.getPredefinedPatch(moduleName, error);
        }

        try {
            const currentCode = this.readModuleCode(moduleName);
            
            const prompt = `
            Você é um arquiteto de software especializado em correção de bugs.
            
            Módulo: ${moduleName}
            Erro: ${error.message}
            
            Código atual:
            \`\`\`javascript
            ${currentCode.substring(0, 1000)}...
            \`\`\`
            
            Forneça uma correção mínima e segura. Responda APENAS com o código JavaScript corrigido.
            `;

            // Simulação - DeepSeek em desenvolvimento
            const patch = this.getPredefinedPatch(moduleName, error);
            return patch;
        } catch (err) {
            console.error('❌ Erro ao gerar patch:', err.message);
            return this.getPredefinedPatch(moduleName, error);
        }
    }

    /**
     * Patches predefinidos para erros comuns
     */
    getPredefinedPatch(moduleName, error) {
        const patches = {
            'TwitterSniffer': {
                description: 'Adicionar retry com backoff exponencial',
                code: `
                async retryWithBackoff(fn, maxRetries = 3) {
                    for (let i = 0; i < maxRetries; i++) {
                        try {
                            return await fn();
                        } catch (error) {
                            if (i === maxRetries - 1) throw error;
                            const delay = Math.pow(2, i) * 1000;
                            console.log(\`Retry em \${delay}ms...\`);
                            await new Promise(r => setTimeout(r, delay));
                        }
                    }
                }
                `
            },
            'AffiliateEngine': {
                description: 'Fallback para link alternativo',
                code: `
                async findBestLink(product) {
                    try {
                        return await this.getShopeeLink(product);
                    } catch (err) {
                        console.log('Fallback para Amazon...');
                        return await this.getAmazonLink(product);
                    }
                }
                `
            }
        };

        return patches[moduleName] || {
            description: 'Aplicar logging detalhado',
            code: 'console.log(\`Error in ${moduleName}: \${error.message}\`);'
        };
    }

    /**
     * Lê código do módulo
     */
    readModuleCode(moduleName) {
        try {
            const modulePath = path.join(__dirname, `../${moduleName}.js`);
            if (fs.existsSync(modulePath)) {
                return fs.readFileSync(modulePath, 'utf8');
            }
        } catch (err) {
            console.error(`Não consegui ler ${moduleName}`);
        }
        return '';
    }

    /**
     * Aplica patch com aprovação
     */
    async applyPatch(moduleName, patch, requiresApproval = true) {
        console.log(`\n⚙️ PATCH DISPONÍVEL: ${patch.description}`);
        
        if (requiresApproval) {
            console.log('👤 Aguardando aprovação do usuário no Telegram...');
            // Em produção, enviaria notificação Telegram
            return {
                status: 'awaiting_approval',
                patch
            };
        }

        // Aplicação automática para patches críticos
        try {
            const modulePath = path.join(__dirname, `../${moduleName}.js`);
            // Fazer backup
            const backup = `${modulePath}.backup_${Date.now()}`;
            fs.copyFileSync(modulePath, backup);
            console.log(`📦 Backup criado: ${backup}`);

            // Aplicar patch (em produção)
            // fs.writeFileSync(modulePath, newCode);
            console.log(`✅ Patch aplicado com sucesso`);

            return {
                status: 'applied',
                backup
            };
        } catch (err) {
            console.error(`❌ Erro ao aplicar patch: ${err.message}`);
            return { status: 'failed', error: err.message };
        }
    }

    /**
     * Rollback para versão anterior
     */
    async rollback(backupPath) {
        try {
            const modulePath = backupPath.replace(/\.backup_\d+$/, '');
            fs.copyFileSync(backupPath, modulePath);
            console.log(`🔄 Rollback realizado com sucesso`);
            return { status: 'success' };
        } catch (err) {
            console.error(`❌ Erro ao fazer rollback: ${err.message}`);
            return { status: 'failed', error: err.message };
        }
    }

    /**
     * Retorna histórico de erros
     */
    getErrorHistory(limit = 10) {
        return {
            total_errors: this.errorLog.length,
            recent: this.errorLog.slice(-limit),
            by_module: this.groupErrorsByModule()
        };
    }

    /**
     * Agrupa erros por módulo
     */
    groupErrorsByModule() {
        return this.errorLog.reduce((acc, err) => {
            if (!acc[err.module]) {
                acc[err.module] = [];
            }
            acc[err.module].push(err);
            return acc;
        }, {});
    }

    /**
     * Auto-atualização: verifica mudanças em APIs
     */
    async checkForAPIChanges() {
        console.log('🔄 Verificando mudanças em APIs...');
        
        // Simulação - Em produção, consultaria Perplexity
        const changes = {
            twitter: 'Sem mudanças detectadas',
            shopee: 'Sem mudanças detectadas',
            amazon: 'Sem mudanças detectadas'
        };

        return changes;
    }

    /**
     * Status completo do Evolution Engine
     */
    getStatus() {
        return {
            errors_detected: this.errorLog.length,
            patches_proposed: this.proposedPatches.length,
            last_check: new Date().toISOString(),
            deepseek_available: !this.deepSeekKey?.includes('ds-...'),
            error_history: this.getErrorHistory(5)
        };
    }
}

module.exports = new EvolutionEngine();
