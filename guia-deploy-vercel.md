# Guia de Deploy Manual do Sistema de Cotação IPARTES na Vercel

Este guia detalhado irá ajudá-lo a implantar o Sistema de Cotação IPARTES na Vercel, uma plataforma de hospedagem gratuita que oferecerá disponibilidade 24/7 para seu sistema. Este guia foi criado especialmente para pessoas sem conhecimento técnico, com instruções passo a passo.

## Índice

1. [Criando uma conta na Vercel](#1-criando-uma-conta-na-vercel)
2. [Preparando o projeto para upload](#2-preparando-o-projeto-para-upload)
3. [Fazendo o deploy na Vercel](#3-fazendo-o-deploy-na-vercel)
4. [Configurando variáveis de ambiente](#4-configurando-variáveis-de-ambiente)
5. [Testando o sistema](#5-testando-o-sistema)
6. [Solução de problemas comuns](#6-solução-de-problemas-comuns)

## 1. Criando uma conta na Vercel

A Vercel é uma plataforma gratuita para hospedagem de aplicações web.

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" no canto superior direito
3. Você pode se cadastrar usando sua conta do GitHub, GitLab, Bitbucket ou com email e senha
4. Se escolher email e senha:
   - Digite seu email
   - Crie uma senha segura
   - Clique em "Continue"
5. Siga as instruções para verificar seu email
6. Após verificar, você será redirecionado para o dashboard da Vercel

## 2. Preparando o projeto para upload

Você já recebeu o arquivo ZIP do Sistema de Cotação IPARTES. Agora, vamos prepará-lo para upload:

1. Descompacte o arquivo ZIP em uma pasta no seu computador
2. Verifique se a pasta contém os seguintes arquivos:
   - `server.js` (arquivo principal do servidor)
   - `index.html` (página principal)
   - `cadastro-fornecedor.html` (página de cadastro de fornecedores)
   - `script.js` (código JavaScript)
   - `styles.css` (estilos)
   - `package.json` (configuração do projeto)
   - `vercel.json` (configuração para a Vercel)
   - Pasta `data` com `suppliers.json`
   - `logo.png` (logo do sistema)

3. Crie um arquivo chamado `.env` na pasta principal (se ainda não existir) e adicione:
   ```
   OPENAI_API_KEY=sua_chave_api_openai
   ```
   Substitua `sua_chave_api_openai` pela chave da API do OpenAI que você está usando.

## 3. Fazendo o deploy na Vercel

Agora vamos fazer o upload do sistema para a Vercel:

1. Acesse [vercel.com](https://vercel.com) e faça login na sua conta
2. No dashboard, clique em "Add New..." e depois em "Project"
3. Clique em "Upload" na seção "Import Git Repository"
4. Arraste a pasta do projeto ou clique para selecionar os arquivos
5. Após o upload, na seção "Configure Project":
   - Dê um nome ao seu projeto (por exemplo, "ipartes-cotacao")
   - Em "Framework Preset", selecione "Other"
   - Em "Root Directory", mantenha o padrão (./), que é a raiz do projeto
   - Em "Build Command", digite: `npm run build`
   - Em "Output Directory", deixe em branco
   - Em "Install Command", digite: `npm install`
   - Em "Development Command", digite: `npm start`

6. Não clique em "Deploy" ainda, pois precisamos configurar as variáveis de ambiente

## 4. Configurando variáveis de ambiente

Antes de finalizar o deploy, precisamos configurar a variável de ambiente para a API do OpenAI:

1. Na mesma tela de configuração do projeto, role para baixo até a seção "Environment Variables"
2. Adicione a seguinte variável:
   - Nome: `OPENAI_API_KEY`
   - Valor: sua chave da API OpenAI (a mesma que você colocou no arquivo .env)
3. Clique em "Add" para adicionar a variável
4. Agora clique em "Deploy" para iniciar o processo de deploy
5. Aguarde o processo de deploy ser concluído (pode levar alguns minutos)
6. Quando terminar, você verá uma mensagem de sucesso e um link para seu site

## 5. Testando o sistema

Vamos verificar se tudo está funcionando corretamente:

1. Clique no link fornecido pela Vercel após o deploy
2. Você será redirecionado para o Sistema de Cotação IPARTES
3. Teste as seguintes funcionalidades:
   - Inserir um produto no campo de pesquisa
   - Gerar um email de cotação
   - Verificar se a lista de emails de fornecedores está sendo exibida
   - Cadastrar um novo fornecedor
   - Verificar se o fornecedor cadastrado aparece em negrito na lista

## 6. Solução de problemas comuns

Se você encontrar algum problema, aqui estão algumas soluções:

### O sistema não está gerando emails ou listando fornecedores

- Verifique se a chave da API OpenAI está correta nas variáveis de ambiente
- Acesse o painel da Vercel, vá em seu projeto, clique em "Settings" > "Environment Variables" e confirme se a variável está correta

### Erro ao salvar fornecedores cadastrados

- Verifique se a pasta `data` foi incluída no upload
- Se o problema persistir, você pode precisar configurar um banco de dados MongoDB Atlas (conforme explicado no guia de instalação anterior)

### O site não está carregando

- Verifique se o deploy foi concluído com sucesso na Vercel
- Tente acessar o link novamente após alguns minutos
- Se o problema persistir, tente fazer um novo deploy

### Erro "Application Error" ou "Internal Server Error"

- Acesse o dashboard da Vercel
- Clique no seu projeto
- Vá para a aba "Deployments"
- Clique no deployment mais recente
- Vá para a aba "Functions Logs" para ver os logs de erro
- Se houver erros relacionados ao Node.js, tente fazer um novo deploy após verificar se o arquivo `vercel.json` está correto

## Conclusão

Parabéns! Você agora tem o Sistema de Cotação IPARTES funcionando permanentemente na Vercel. O sistema estará disponível 24/7 e você pode acessá-lo de qualquer dispositivo com acesso à internet.

Lembre-se de guardar em local seguro:
- O link do seu site na Vercel
- Suas credenciais de acesso à Vercel
- Sua chave da API OpenAI

Se precisar de ajuda adicional, você pode entrar em contato com o suporte técnico.
