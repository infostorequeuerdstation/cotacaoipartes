# Guia de Instalação do Sistema de Cotação IPARTES

Este guia detalhado irá ajudá-lo a instalar o Sistema de Cotação IPARTES em um servidor gratuito usando a plataforma Vercel com MongoDB Atlas. Este guia foi criado especialmente para pessoas sem conhecimento técnico, com instruções passo a passo.

## Índice

1. [Criando uma conta na Vercel](#1-criando-uma-conta-na-vercel)
2. [Criando uma conta no MongoDB Atlas](#2-criando-uma-conta-no-mongodb-atlas)
3. [Configurando o banco de dados MongoDB](#3-configurando-o-banco-de-dados-mongodb)
4. [Preparando o código para deploy](#4-preparando-o-código-para-deploy)
5. [Fazendo o deploy na Vercel](#5-fazendo-o-deploy-na-vercel)
6. [Testando o sistema](#6-testando-o-sistema)
7. [Solução de problemas comuns](#7-solução-de-problemas-comuns)

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

## 2. Criando uma conta no MongoDB Atlas

MongoDB Atlas é um serviço de banco de dados na nuvem com plano gratuito.

1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Clique em "Try Free" no canto superior direito
3. Preencha o formulário com:
   - Email
   - Nome
   - Sobrenome
   - Senha
4. Marque a caixa concordando com os termos
5. Clique em "Create your Atlas account"
6. Siga as instruções para verificar seu email
7. Após verificar, você será redirecionado para a página de configuração inicial

## 3. Configurando o banco de dados MongoDB

Agora vamos configurar seu banco de dados gratuito:

1. Na página "Deploy your database", selecione "FREE" (plano M0)
2. Escolha o provedor (AWS, Google Cloud ou Azure) - recomendamos AWS
3. Escolha a região mais próxima de você (por exemplo, São Paulo para Brasil)
4. Clique em "Create"
5. Na seção "Security Quickstart":
   - Escolha "Username and Password" como método de autenticação
   - Crie um nome de usuário (anote-o)
   - Crie uma senha segura (anote-a)
   - Clique em "Create User"
6. Na seção "Where would you like to connect from?":
   - Selecione "Allow access from anywhere"
   - Clique em "Add Entry"
   - Clique em "Finish and Close"
7. Clique em "Go to Database" para acessar seu cluster
8. No dashboard, clique em "Connect"
9. Selecione "Drivers"
10. Copie a string de conexão que aparece (será algo como: `mongodb+srv://seuusuario:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
11. Substitua `<password>` pela senha que você criou anteriormente
12. Guarde esta string de conexão, você precisará dela mais tarde

## 4. Preparando o código para deploy

Agora vamos preparar o código do sistema para funcionar com o MongoDB:

1. Descompacte o arquivo ZIP do Sistema de Cotação IPARTES em uma pasta no seu computador
2. Crie um novo arquivo chamado `.env` na pasta principal do projeto
3. Abra este arquivo com o Bloco de Notas ou outro editor de texto
4. Adicione as seguintes linhas:

```
MONGODB_URI=sua_string_de_conexao_mongodb
OPENAI_API_KEY=sua_chave_api_openai
```

5. Substitua `sua_string_de_conexao_mongodb` pela string que você copiou do MongoDB Atlas
6. Substitua `sua_chave_api_openai` pela chave da API do OpenAI que você está usando
7. Salve o arquivo

## 5. Fazendo o deploy na Vercel

Agora vamos fazer o upload do sistema para a Vercel:

1. Acesse [vercel.com](https://vercel.com) e faça login na sua conta
2. No dashboard, clique em "Add New..." e depois em "Project"
3. Clique em "Upload" na seção "Import Git Repository"
4. Arraste a pasta do projeto ou clique para selecionar os arquivos
5. Após o upload, na seção "Configure Project":
   - Dê um nome ao seu projeto (por exemplo, "ipartes-cotacao")
   - Em "Environment Variables", adicione:
     - Nome: `MONGODB_URI`, Valor: sua string de conexão MongoDB
     - Nome: `OPENAI_API_KEY`, Valor: sua chave da API OpenAI
   - Clique em "Add" após adicionar cada variável
6. Clique em "Deploy"
7. Aguarde o processo de deploy ser concluído (pode levar alguns minutos)
8. Quando terminar, você verá uma mensagem de sucesso e um link para seu site

## 6. Testando o sistema

Vamos verificar se tudo está funcionando corretamente:

1. Clique no link fornecido pela Vercel após o deploy
2. Você será redirecionado para o Sistema de Cotação IPARTES
3. Teste as seguintes funcionalidades:
   - Inserir um produto no campo de pesquisa
   - Gerar um email de cotação
   - Verificar se a lista de emails de fornecedores está sendo exibida
   - Cadastrar um novo fornecedor
   - Verificar se o fornecedor cadastrado aparece em negrito na lista

## 7. Solução de problemas comuns

Se você encontrar algum problema, aqui estão algumas soluções:

### O sistema não está gerando emails ou listando fornecedores

- Verifique se a chave da API OpenAI está correta nas variáveis de ambiente
- Acesse o painel da Vercel, vá em seu projeto, clique em "Settings" > "Environment Variables" e confirme se as variáveis estão corretas

### Erro ao salvar fornecedores cadastrados

- Verifique se a string de conexão do MongoDB está correta
- Certifique-se de que substituiu `<password>` pela sua senha real na string de conexão
- Verifique se permitiu acesso de qualquer IP no MongoDB Atlas

### O site não está carregando

- Verifique se o deploy foi concluído com sucesso na Vercel
- Tente acessar o link novamente após alguns minutos
- Se o problema persistir, tente fazer um novo deploy

### Outros problemas

Se você encontrar outros problemas não listados aqui, recomendamos:

1. Verificar os logs de erro na Vercel:
   - Acesse o dashboard da Vercel
   - Clique no seu projeto
   - Vá para a aba "Deployments"
   - Clique no deployment mais recente
   - Vá para a aba "Functions Logs"

2. Entrar em contato com suporte técnico para assistência adicional

## Conclusão

Parabéns! Você agora tem o Sistema de Cotação IPARTES funcionando em um servidor gratuito na Vercel com MongoDB Atlas. O sistema estará disponível 24/7 e você pode acessá-lo de qualquer dispositivo com acesso à internet.

Lembre-se de guardar em local seguro:
- O link do seu site na Vercel
- Suas credenciais de acesso à Vercel
- Suas credenciais de acesso ao MongoDB Atlas
- Sua chave da API OpenAI
