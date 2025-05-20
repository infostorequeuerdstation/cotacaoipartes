const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// API Key
const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

// Diretório para armazenar dados de fornecedores cadastrados
const DATA_DIR = path.join(__dirname, 'data');
const SUPPLIERS_FILE = path.join(DATA_DIR, 'suppliers.json');

// Garantir que o diretório de dados exista
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Inicializar arquivo de fornecedores se não existir
if (!fs.existsSync(SUPPLIERS_FILE)) {
    fs.writeFileSync(SUPPLIERS_FILE, JSON.stringify([], null, 2));
}

// Função para ler fornecedores cadastrados
function getSuppliers() {
    try {
        const data = fs.readFileSync(SUPPLIERS_FILE, 'utf8');
        const suppliers = JSON.parse(data);
        
        // Garantir compatibilidade com formato antigo (email único)
        suppliers.forEach(supplier => {
            if (!supplier.emails && supplier.email) {
                supplier.emails = [supplier.email];
                delete supplier.email;
            } else if (!supplier.emails) {
                supplier.emails = [];
            }
        });
        
        return suppliers;
    } catch (error) {
        console.error('Erro ao ler fornecedores:', error);
        return [];
    }
}

// Função para salvar fornecedores cadastrados
function saveSuppliers(suppliers) {
    try {
        // Garantir que todos os fornecedores usam o novo formato (emails array)
        suppliers.forEach(supplier => {
            if (!supplier.emails && supplier.email) {
                supplier.emails = [supplier.email];
                delete supplier.email;
            } else if (!supplier.emails) {
                supplier.emails = [];
            }
        });
        
        fs.writeFileSync(SUPPLIERS_FILE, JSON.stringify(suppliers, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar fornecedores:', error);
        return false;
    }
}

// Rota para gerar email
app.post('/api/generate-email', async (req, res) => {
    try {
        const { productInput } = req.body;
        
        if (!productInput) {
            return res.status(400).json({ error: 'Dados do produto são obrigatórios' });
        }

        console.log('Gerando email para:', productInput);
        const prompt = `TRANSLATE TO ENGLISH AND CREATE AN EMAIL WITH QUICK SPECS OF ${productInput}`;
        
        const response = await axios.post(API_URL, {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an assistant that creates professional quotation emails in English. 
                    Follow this format exactly:
                    
                    Hello Sales Team,
                    
                    I hope this message finds you well.
                    
                    I am reaching out to request a quote for the following items:
                    
                    [QUANTITY] Unit(s) OF [MANUFACTURER] [MODEL/PARTNUMBER] [PRODUCT TYPE]
                    
                    Quick Specifications:
                    [SPEC 1]: [VALUE]
                    [SPEC 2]: [VALUE]
                    [SPEC n]: [VALUE]
                    
                    Please include pricing, lead time, and shipping
                    
                    Shipping Address:
                    SERVER X SYSTEMS
                    10451 NW 28th St, Suite F101
                    Doral, FL 33172, USA
                    
                    Thank you in advance for your assistance. Please let me know if you need any additional information.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        console.log('Email gerado com sucesso');
        res.json({ email: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Erro ao gerar email:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao gerar email' });
    }
});

// Rota para encontrar fornecedores
app.post('/api/find-suppliers', async (req, res) => {
    try {
        const { productInput } = req.body;
        
        if (!productInput) {
            return res.status(400).json({ error: 'Dados do produto são obrigatórios' });
        }

        console.log('Buscando fornecedores para:', productInput);

        // Extrair o fabricante do texto de entrada - algoritmo melhorado
        let manufacturer = '';
        let productModel = '';
        let productType = 'Mass Flow Sensor';
        let quantity = '1';
        let specifications = [];
        
        // Normalizar o texto para facilitar a extração
        const normalizedInput = productInput.toUpperCase();
        
        // Extrair quantidade
        const quantityMatch = productInput.match(/(\d+)\s*unidades?/i);
        if (quantityMatch && quantityMatch[1]) {
            quantity = quantityMatch[1];
        }
        
        // Métodos de extração de fabricante melhorados
        // 1. Procurar por padrões comuns como "fabricante: X" ou "X ;"
        const fabricanteMatch = productInput.match(/fabricante:\s*([A-Za-z0-9\s]+?)(;|$)/i);
        
        // 2. Procurar por nomes de fabricantes conhecidos diretamente no texto
        const knownManufacturers = ['EMERSON', 'ROTORK', 'SIEMENS', 'ABB', 'SCHNEIDER'];
        const foundManufacturer = knownManufacturers.find(m => normalizedInput.includes(m));
        
        // 3. Procurar por padrões como "X MOD." ou "X Tp:"
        const beforeModMatch = productInput.match(/([A-Za-z]+)\s+(?:MOD\.|Tp:|modelo)/i);
        
        // Priorizar os métodos de extração
        if (fabricanteMatch && fabricanteMatch[1]) {
            manufacturer = fabricanteMatch[1].trim();
        } else if (foundManufacturer) {
            manufacturer = foundManufacturer;
        } else if (beforeModMatch && beforeModMatch[1]) {
            manufacturer = beforeModMatch[1].trim();
        } else {
            // Tentar extrair palavras que parecem ser nomes de fabricantes
            const words = productInput.split(/[;,\s]+/);
            for (const word of words) {
                if (word.length > 3 && /^[A-Z]/.test(word) && !/^\d+$/.test(word)) {
                    manufacturer = word;
                    break;
                }
            }
        }
        
        // Tentar encontrar o modelo/partnumber (geralmente após "Tp:" ou similar)
        const modelMatch = productInput.match(/[Tt][Pp]:\s*([A-Z0-9]+)/);
        if (modelMatch && modelMatch[1]) {
            productModel = modelMatch[1];
        } else {
            // Se não encontrar o padrão específico, usar palavras-chave do texto
            const keywords = productInput.split(/[;,\s]+/).filter(word => 
                word.length > 3 && /[A-Z0-9]/.test(word)
            ).slice(0, 3).join(' ');
            productModel = keywords;
        }
        
        // Extrair especificações
        if (productInput.includes('conexão ao processo')) {
            specifications.push('Process connection: ' + (productInput.match(/conexão ao processo:([^;]+)/i)?.[1].trim() || 'Flange 4" 300 FR'));
        }
        
        if (productInput.includes('vazão máx')) {
            specifications.push('Max. flow: ' + (productInput.match(/vazão máx\.?([^;]+)/i)?.[1].trim() || '272,160 kg/h'));
        }
        
        if (productInput.includes('saída')) {
            specifications.push('Output: ' + (productInput.match(/saída:([^;]+)/i)?.[1].trim() || 'Digital'));
        }
        
        if (productInput.includes('IP')) {
            specifications.push('IP rating: ' + (productInput.match(/IP\s*(\d+)/i)?.[1].trim() || '67'));
        }
        
        if (productInput.includes('Grupo')) {
            specifications.push('Group: ' + (productInput.match(/Grupo\s*([^;]+)/i)?.[1].trim() || 'IIA'));
        }
        
        if (productInput.includes('Classe de temperatura')) {
            specifications.push('Temperature class: ' + (productInput.match(/Classe de temperatura\s*([^;]+)/i)?.[1].trim() || 'T2'));
        }
        
        // Se não conseguiu extrair especificações, usar algumas padrão
        if (specifications.length === 0) {
            specifications = [
                'Process connection: Flange 4" 300 FR',
                'Max. flow: 272,160 kg/h',
                'Output: Digital',
                'IP rating: IP 67',
                'Group: IIA',
                'Temperature class: T2'
            ];
        }

        console.log('Fabricante identificado:', manufacturer);
        console.log('Modelo identificado:', productModel);
        console.log('Especificações extraídas:', specifications);

        // Prompt reformulado conforme exemplo do usuário
        const prompt = `find at least 10 distribuidors/resellers in USA and Europe of

${quantity} Unit OF ${manufacturer} ${productModel} ${productType}

Quick Specifications:
${specifications.join('\n')}`;
        
        let emailList = [];
        
        try {
            const response = await axios.post(API_URL, {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful assistant that provides lists of business email addresses.
                        Your task is to find real distributors or resellers for industrial equipment and provide their contact emails.
                        For each distributor, provide their email address in this format:
                        Company Name (Country)
                        Email: contact@example.com
                        
                        Include at least 10 distributors from USA (priority) and Europe.
                        Focus on providing real, accurate business emails that would be used for quotation requests.
                        If you're not sure about specific emails, use the standard format for that company (sales@company.com, info@company.com, etc.).`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            console.log('Resposta da API recebida');
            
            // Processar a resposta para extrair apenas os emails
            const content = response.data.choices[0].message.content;
            console.log('Conteúdo da resposta:', content);
            
            // Extrair emails da resposta usando regex
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const extractedEmails = content.match(emailRegex) || [];
            
            // Filtrar e limpar a lista de emails
            emailList = [...new Set(extractedEmails)].map(email => email.trim());
            
            console.log('Emails extraídos:', emailList);
            
        } catch (error) {
            console.error('Erro ao obter emails da API:', error.message);
            // Em caso de erro, continuar com lista vazia
            emailList = [];
        }
        
        // Adicionar alguns emails genéricos se a lista estiver vazia
        if (emailList.length === 0) {
            console.log('Gerando emails genéricos para', manufacturer || productModel);
            const companyName = (manufacturer || productModel || 'company').toLowerCase().replace(/\s+/g, '');
            emailList = [
                `sales@${companyName}.com`,
                `info@${companyName}.com`,
                `contact@${companyName}-distributor.com`,
                `sales@${companyName}-usa.com`,
                `info@${companyName}-global.com`
            ];
        }
        
        console.log('Emails extraídos ou gerados:', emailList);
        
        // Buscar fornecedores cadastrados que correspondam ao fabricante - lógica melhorada
        const registeredSuppliers = getSuppliers();
        
        // Correspondência case-insensitive e mais tolerante
        const matchingSuppliers = registeredSuppliers.filter(supplier => {
            if (!manufacturer) return false;
            
            // Normalizar ambos os textos para comparação
            const normalizedManufacturer = manufacturer.toUpperCase().trim();
            const normalizedSupplier = supplier.manufacturer.toUpperCase().trim();
            
            // Verificar correspondência exata ou se um contém o outro
            return normalizedManufacturer === normalizedSupplier || 
                   normalizedManufacturer.includes(normalizedSupplier) || 
                   normalizedSupplier.includes(normalizedManufacturer);
        });
        
        console.log('Fornecedores cadastrados correspondentes:', matchingSuppliers);
        
        // Coletar todos os emails cadastrados dos fornecedores correspondentes
        let registeredEmails = [];
        matchingSuppliers.forEach(supplier => {
            if (supplier.emails && Array.isArray(supplier.emails)) {
                registeredEmails = [...registeredEmails, ...supplier.emails];
            }
        });
        
        // Remover duplicatas (caso um email cadastrado também apareça na lista da API)
        const uniqueApiEmails = emailList.filter(email => !registeredEmails.includes(email));
        
        // Combinar emails cadastrados com emails da API
        const result = {
            suppliers: [...registeredEmails, ...uniqueApiEmails],
            registeredSuppliers: registeredEmails
        };
        
        res.json(result);
    } catch (error) {
        console.error('Erro ao buscar fornecedores:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Erro ao buscar fornecedores',
            message: error.message,
            details: error.response?.data
        });
    }
});

// Rota para listar todos os fornecedores cadastrados
app.get('/api/suppliers', (req, res) => {
    try {
        const suppliers = getSuppliers();
        res.json(suppliers);
    } catch (error) {
        console.error('Erro ao listar fornecedores:', error);
        res.status(500).json({ error: 'Erro ao listar fornecedores' });
    }
});

// Rota para adicionar um novo fornecedor
app.post('/api/suppliers', (req, res) => {
    try {
        const { manufacturer, email } = req.body;
        
        if (!manufacturer || !email) {
            return res.status(400).json({ error: 'Fabricante e email são obrigatórios' });
        }
        
        const suppliers = getSuppliers();
        
        // Verificar se já existe um fornecedor com o mesmo fabricante
        const existingSupplierIndex = suppliers.findIndex(s => 
            s.manufacturer.toUpperCase() === manufacturer.toUpperCase()
        );
        
        if (existingSupplierIndex >= 0) {
            // Adicionar email ao fornecedor existente se não estiver duplicado
            if (!suppliers[existingSupplierIndex].emails.includes(email)) {
                suppliers[existingSupplierIndex].emails.push(email);
                suppliers
(Content truncated due to size limit. Use line ranges to read in chunks)