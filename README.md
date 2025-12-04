# 🛡️ SOC Dashboard - Sistema de Correlação de Eventos de Segurança

Dashboard profissional para Security Operations Center (SOC) que integra múltiplas ferramentas de segurança e correlaciona eventos críticos automaticamente.

![SOC Dashboard](https://img.shields.io/badge/versão-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Docker](https://img.shields.io/badge/docker-required-blue)

---

## 📋 Índice

- [O que é o SOC Dashboard?](#o-que-é-o-soc-dashboard)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Guia de Instalação Completo](#guia-de-instalação-completo)
  - [Windows](#instalação-no-windows)
  - [Linux](#instalação-no-linux)
  - [macOS](#instalação-no-macos)
- [Configuração Inicial](#configuração-inicial)
- [Primeiro Acesso](#primeiro-acesso)
- [Solução de Problemas](#solução-de-problemas)
- [Perguntas Frequentes](#perguntas-frequentes)

---

## 🎯 O que é o SOC Dashboard?

Este sistema conecta-se a suas ferramentas de segurança (Elasticsearch, Tenable, Microsoft Defender e OpenCTI) e **automaticamente**:

- ✅ Coleta alertas de segurança críticos
- ✅ Identifica vulnerabilidades de alta prioridade
- ✅ Correlaciona eventos entre diferentes ferramentas
- ✅ Apresenta tudo em um painel visual único
- ✅ Permite exportar relatórios em Excel e PDF

**Em outras palavras:** Em vez de verificar 4 sistemas diferentes, você vê tudo consolidado em uma única tela.

---

## 🌟 Funcionalidades

### Para Analistas de Segurança
- 📊 **Dashboard em tempo real** com alertas críticos
- 🔍 **Correlação automática** de eventos por ativo/servidor
- 📈 **Timeline de ameaças** cronológica
- 📥 **Exportação** de relatórios para gestão

### Para Administradores
- 👥 **Gerenciamento de usuários** (3 níveis: Admin, Analista, Visualizador)
- ⚙️ **Configuração de fontes** de dados via interface web
- 🔐 **Controle de acesso** granular
- 📊 **Monitoramento** do status das integrações

### Para Gestores
- 📄 **Relatórios** em Excel/PDF
- 👁️ **Acesso somente leitura** aos dashboards
- 📊 **Métricas** de segurança consolidadas

---

## 📦 Pré-requisitos

### O que você precisa ter instalado no seu computador

#### ✅ Obrigatório para TODOS os sistemas operacionais:

1. **Docker Desktop** (versão 24 ou superior)
   - O que é? Software que permite rodar aplicações em "containers" isolados
   - Por que preciso? O SOC Dashboard roda completamente dentro do Docker

2. **Acesso às APIs das ferramentas de segurança**:
   - Elasticsearch SIEM (URL + usuário/senha)
   - Tenable (Access Key + Secret Key)
   - Microsoft Defender (Tenant ID + Client ID + Client Secret)
   - OpenCTI (URL + Token)

#### ⚙️ Recursos de Hardware Mínimos:

- **RAM:** 4 GB disponíveis (8 GB recomendado)
- **Disco:** 10 GB de espaço livre
- **Processador:** Dual-core ou superior
- **Internet:** Conexão estável

---

## 🚀 Guia de Instalação Completo

Escolha o guia do seu sistema operacional:

---

### 📘 Instalação no Windows

#### Passo 1: Instalar o Docker Desktop

1. **Baixe o Docker Desktop:**
   - Acesse: https://www.docker.com/products/docker-desktop
   - Clique em "Download for Windows"
   - Aguarde o download do instalador (cerca de 500 MB)

2. **Instale o Docker Desktop:**
   - Dê duplo clique no arquivo baixado (`Docker Desktop Installer.exe`)
   - Clique em "Ok" para aceitar as configurações padrão
   - Aguarde a instalação (pode levar 5-10 minutos)
   - **IMPORTANTE:** Quando solicitado, marque a opção "Use WSL 2 instead of Hyper-V"
   - Clique em "Close and restart" para reiniciar o computador

3. **Verifique se o Docker está funcionando:**
   - Abra o **Prompt de Comando** (tecle Windows + R, digite `cmd` e pressione Enter)
   - Digite o comando abaixo e pressione Enter:
     ```
     docker --version
     ```
   - Você deve ver algo como: `Docker version 24.0.7, build afdd53b`
   - Se aparecer essa mensagem, o Docker está instalado! ✅

#### Passo 2: Instalar o Git (para baixar o projeto)

1. **Baixe o Git:**
   - Acesse: https://git-scm.com/download/win
   - O download iniciará automaticamente

2. **Instale o Git:**
   - Dê duplo clique no instalador
   - Clique "Next" em todas as telas (use as configurações padrão)
   - Na tela "Adjusting your PATH environment", selecione "Git from the command line and also from 3rd-party software"
   - Clique "Install" e aguarde

3. **Verifique a instalação:**
   - Abra um novo Prompt de Comando
   - Digite:
     ```
     git --version
     ```
   - Deve aparecer: `git version 2.x.x`

#### Passo 3: Baixar o SOC Dashboard

1. **Abra o Prompt de Comando** (Windows + R → `cmd` → Enter)

2. **Navegue até a pasta onde quer instalar** (exemplo: Documentos):

3. **Baixe o projeto do GitHub:**
git clone https://github.com/brunodbz/dashboard.git
> ⚠️ **Importante:** Substitua `seu-usuario/dashboard` pela URL real do seu repositório

4. **Entre na pasta do projeto:**
cd dashboard

#### Passo 4: Configurar as Credenciais

1. **Copie o arquivo de exemplo:**
copy .env.example .env

2. **Abra o arquivo `.env` para editar:**
notepad .env

3. **Preencha suas credenciais** (explicação detalhada na seção [Configuração Inicial](#configuração-inicial))

4. **Salve o arquivo:** Menu Arquivo → Salvar (ou Ctrl + S)

#### Passo 5: Iniciar o Sistema

1. **Certifique-se que o Docker Desktop está rodando:**
- Procure o ícone da baleia no canto inferior direito da tela (bandeja do sistema)
- Se não estiver lá, abra o Docker Desktop pelo menu Iniciar

2. **No Prompt de Comando, execute:**
docker-compose up -d

3. **Aguarde o download e inicialização** (primeira vez pode levar 10-15 minutos):
- Você verá mensagens como "Pulling image...", "Creating container..."
- Ao final, deve aparecer: "✅ Dashboard disponível em: http://localhost"

4. **Verifique se está funcionando:**
docker-compose ps
- Todos os serviços devem estar com status "Up"

#### Passo 6: Acessar o Dashboard

1. **Abra seu navegador** (Chrome, Firefox, Edge)
2. **Digite na barra de endereços:** `http://localhost`
3. **Faça login com as credenciais padrão:**
- **Usuário:** `admin`
- **Senha:** `admin123`
4. **⚠️ IMPORTANTE:** Altere a senha imediatamente após o primeiro login!

---

### 🐧 Instalação no Linux

#### Passo 1: Instalar o Docker

**Para Ubuntu/Debian:**
Atualize os pacotes
sudo apt update

Instale dependências
sudo apt install -y ca-certificates curl gnupg lsb-release

Adicione a chave GPG oficial do Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

Configure o repositório
echo
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

Instale o Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

Adicione seu usuário ao grupo docker (para não precisar usar sudo)
sudo usermod -aG docker $USER

Recarregue as permissões
newgrp docker

**Para Fedora/CentOS/RHEL:**

sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker

**Verifique a instalação:**
docker --version
docker compose version

#### Passo 2: Instalar o Git (se necessário)

Ubuntu/Debian
sudo apt install -y git

Fedora/CentOS
sudo dnf install -y git

Verificar
git --version

#### Passo 3: Baixar e Configurar

Navegue até a pasta home
cd ~

Clone o repositório
git clone https://github.com/brunodbz/dashboard.git

Entre na pasta
cd soc-dashboard

Copie o arquivo de configuração
cp .env.example .env

Edite com seu editor favorito
nano .env

ou
vim .env

ou
gedit .env

#### Passo 4: Iniciar o Sistema

Build das imagens
docker compose build

Inicie os containers
docker compose up -d

Verifique os logs
docker compose logs -f

Pressione Ctrl+C para sair dos logs
Verifique o status
docker compose ps

#### Passo 5: Acessar

Abra o navegador e acesse: `http://localhost`

---

### 🍎 Instalação no macOS

#### Passo 1: Instalar o Docker Desktop

1. **Baixe o Docker Desktop:**
   - Acesse: https://www.docker.com/products/docker-desktop
   - Clique em "Download for Mac"
   - Escolha a versão correta:
     - **Mac com Apple Silicon (M1/M2/M3):** Apple Chip
     - **Mac Intel:** Intel Chip

2. **Instale:**
   - Abra o arquivo `.dmg` baixado
   - Arraste o ícone do Docker para a pasta Applications
   - Abra o Docker Desktop pela primeira vez (pasta Applications)
   - Autorize quando solicitado (pode pedir senha de administrador)

3. **Verifique:**
   - Abra o Terminal (Cmd + Espaço, digite "Terminal")
docker --version
docker compose version

#### Passo 2: Instalar o Git (geralmente já vem instalado)

Verifique se já tem
git --version

Se não tiver, instale via Homebrew (recomendado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git

#### Passo 3: Baixar e Configurar

Navegue até a pasta Documentos
cd ~/Documents

Clone o repositório
git clone https://github.com/brunodbz/dashboard.git

Entre na pasta
cd soc-dashboard

Copie e edite o arquivo de configuração
cp .env.example .env
nano .env

ou use TextEdit: open -e .env

#### Passo 4: Iniciar

Build
docker compose build

Iniciar
docker compose up -d

Verificar
docker compose ps

#### Passo 5: Acessar

Abra Safari/Chrome e acesse: `http://localhost`

---

## ⚙️ Configuração Inicial

Ao abrir o arquivo `.env`, você verá várias variáveis. Aqui está o que preencher em cada uma:

### 🔐 Segurança do Sistema

Deixe como está ou mude se preferir
POSTGRES_DB=soc_dashboard
POSTGRES_USER=soc_admin

⚠️ ALTERE ESTA SENHA! Use uma senha forte
POSTGRES_PASSWORD=SuaSenhaForteAqui123!

⚠️ ALTERE! Use uma senha aleatória
REDIS_PASSWORD=OutraSenhaForte456!

⚠️ GERE UMA CHAVE SECRETA! (mínimo 32 caracteres aleatórios)
Dica: Use um gerador online de senhas ou digite caracteres aleatórios
SECRET_KEY=sua_chave_secreta_muito_longa_e_aleatoria_aqui_12345678901234567890

### 📊 Elasticsearch / Elastic SIEM

URL do seu Elasticsearch (exemplo)
ELASTICSEARCH_URL=https://seu-elastic.cloud.es.io:9200

Usuário do Elasticsearch
ELASTICSEARCH_USERNAME=elastic

Senha do Elasticsearch
ELASTICSEARCH_PASSWORD=sua_senha_elastic

**Como obter:**
1. Acesse seu Elastic Cloud ou instância local
2. Vá em "Security" ou "Management"
3. Copie a URL do endpoint
4. Use as credenciais de administrador

### 🛡️ Tenable Vulnerability Management

TENABLE_ACCESS_KEY=sua_access_key_aqui
TENABLE_SECRET_KEY=sua_secret_key_aqui

**Como obter:**
1. Faça login em https://cloud.tenable.com
2. Vá em **Settings** → **My Account** → **API Keys**
3. Clique em **Generate** (ou **New API Key**)
4. Copie o **Access Key** e **Secret Key**
5. ⚠️ Guarde-os em local seguro (não são exibidos novamente!)

### 🔐 Microsoft Defender

DEFENDER_TENANT_ID=seu-tenant-id-azure
DEFENDER_CLIENT_ID=seu-client-id
DEFENDER_CLIENT_SECRET=seu-client-secret

**Como obter:**
1. Acesse o **Azure Portal** (https://portal.azure.com)
2. Vá em **Azure Active Directory** → **App registrations**
3. Clique em **New registration**
4. Nome: "SOC Dashboard Integration"
5. Após criar, copie:
   - **Application (client) ID** → DEFENDER_CLIENT_ID
   - **Directory (tenant) ID** → DEFENDER_TENANT_ID
6. Vá em **Certificates & secrets** → **New client secret**
7. Copie o **Value** → DEFENDER_CLIENT_SECRET
8. Em **API permissions**, adicione:
   - `SecurityEvents.Read.All`
   - `SecurityIncident.Read.All`

### 🎯 OpenCTI

OPENCTI_URL=https://seu-opencti.exemplo.com
OPENCTI_TOKEN=seu_token_opencti

**Como obter:**
1. Acesse sua instância do OpenCTI
2. Faça login
3. Clique no seu nome (canto superior direito) → **Profile**
4. Vá na aba **API Access**
5. Clique em **Create a new token**
6. Copie o token gerado

### 📊 Thresholds (Limiares) - OPCIONAL

Deixe os valores padrão ou ajuste conforme sua necessidade:

CVSS_HIGH_THRESHOLD=7.0 # CVSS maior que 7 = HIGH
CVSS_CRITICAL_THRESHOLD=9.0 # CVSS maior que 9 = CRITICAL
RISK_SCORE_HIGH_THRESHOLD=70 # Risk Score Elastic > 70 = HIGH
RISK_SCORE_CRITICAL_THRESHOLD=90 # Risk Score Elastic > 90 = CRITICAL
CONFIDENCE_THRESHOLD=75 # OpenCTI confidence > 75 = confiável

---

## 🎉 Primeiro Acesso

### 1. Acesse o Dashboard

Abra seu navegador e vá para: [**http://localhost**](http://localhost)

### 2. Faça Login

- **Usuário:** `admin`
- **Senha:** `admin123`

### 3. ⚠️ ALTERE A SENHA IMEDIATAMENTE

1. Após logar, clique no ícone de **Configurações** (engrenagem) no canto superior direito
2. Vá em **Painel Administrativo**
3. Clique na aba **Gerenciamento de Usuários**
4. Localize o usuário `admin`
5. Clique em **Editar**
6. Altere a senha para uma senha forte
7. Salve

### 4. Configure as Fontes de Dados

1. No **Painel Administrativo**, clique na aba **Fontes de Dados**
2. Clique em **Adicionar Fonte**
3. Preencha:
   - **Nome:** Ex: "Elasticsearch Produção"
   - **Tipo:** Selecione "Elasticsearch SIEM"
   - **Configuração JSON:**
     ```
     {
       "url": "https://seu-elastic.com:9200",
       "username": "elastic",
       "password": "sua_senha"
     }
     ```
4. Marque **Habilitar fonte**
5. Clique em **Criar Fonte**
6. Repita para Tenable, Defender e OpenCTI

### 5. Crie Usuários para sua Equipe

1. Ainda no **Painel Administrativo** → **Gerenciamento de Usuários**
2. Clique em **Criar Usuário**
3. Preencha:
   - **Nome de Usuário:** Ex: "joao.silva"
   - **Email:** joao.silva@empresa.com
   - **Senha:** Senha temporária (usuário deve trocar no primeiro login)
   - **Função:**
     - **Administrador:** Acesso total
     - **Analista:** Visualiza e exporta relatórios
     - **Visualizador:** Apenas visualiza (ideal para gestores)
4. Clique em **Criar Usuário**

### 6. Explore o Dashboard

- **Dashboard Principal:** Veja alertas críticos correlacionados
- **Estatísticas:** Métricas consolidadas
- **Timeline:** Linha do tempo de ameaças
- **Exportar:** Baixe relatórios em Excel ou PDF

---

## 🛠️ Comandos Úteis

### Windows (Prompt de Comando ou PowerShell)

REM Ver status dos containers
docker-compose ps

REM Ver logs em tempo real
docker-compose logs -f

REM Parar o sistema
docker-compose down

REM Reiniciar o sistema
docker-compose restart

REM Iniciar novamente
docker-compose up -d

REM Limpar tudo (cuidado! Remove todos os dados)
docker-compose down -v

### Linux/macOS (Terminal)

Ver status
docker compose ps

Ver logs
docker compose logs -f

Parar
docker compose down

Reiniciar
docker compose restart

Iniciar
docker compose up -d

Limpar tudo
docker compose down -v

Atualizar para nova versão
git pull
docker compose build
docker compose up -d

---

## 🔧 Solução de Problemas

### ❌ Problema: "docker: command not found"

**Causa:** Docker não está instalado ou não está no PATH

**Solução:**
- **Windows:** Reinstale o Docker Desktop e reinicie o computador
- **Linux:** Verifique se o Docker foi instalado corretamente: `sudo systemctl status docker`
- **macOS:** Abra o Docker Desktop manualmente

---

### ❌ Problema: "failed to fetch anonymous token" ou i/o timeout ao baixar imagens do Docker Hub

**Causa:** Conexão com o Docker Hub está lenta/bloqueada ou há proxy corporativo impedindo o download das imagens base (`python:3.11-slim`, `nginx:alpine`, `node:20-alpine`).

**Solução:**
1. **Teste sua conexão:**
   - `docker pull hello-world` (verifique se consegue baixar algo pequeno)
   - Se falhar, cheque se há proxy ou bloqueio de rede.
2. **Configurar um mirror do Docker Hub (recomendado em redes restritas):**
   - Crie/edite `~/.docker/daemon.json` e adicione:
     ```json
     {
       "registry-mirrors": ["https://mirror.gcr.io"]
     }
     ```
   - Reinicie o Docker Desktop/daemon e tente novamente `docker-compose build`.
3. **Usar variáveis de proxy (quando necessário):**
   - Exporte antes de rodar o build: `export HTTPS_PROXY=http://usuario:senha@proxy:3128`
   - No Docker Desktop (Windows/macOS): Settings → Resources → Proxies → configure o proxy.
4. **Usar uma imagem base via mirror (quando o Docker Hub não responde):**
   - Rode o build apontando para o mirror oficial do Google: 
     ```
     docker compose build --build-arg PYTHON_IMAGE=mirror.gcr.io/library/python:3.11-slim backend
     ```
   - O mirror entrega as mesmas camadas do Docker Hub e costuma funcionar melhor em redes corporativas restritas.
5. **Forçar novo pull das bases:**
   - `docker pull nginx:alpine`
   - `docker pull node:20-alpine`
   - `docker pull python:3.11-slim`
   - Depois: `docker-compose build --pull`

---

### ❌ Problema: Erro `KeyError: 'ContainerConfig'` ao executar `docker-compose`

**Causa:** O binário antigo `docker-compose` (v1) não é compatível com versões recentes do Docker Engine e falha ao recriar os containers.

**Solução recomendada:**
1. **Use o plugin novo `docker compose` (v2):**
   - Execute os comandos com espaço: `docker compose up -d`, `docker compose build`, etc.
   - O `Makefile` já usa automaticamente esse formato; se preferir o binário legado, defina `DOCKER_COMPOSE=docker-compose` ao rodar o `make`.
2. **Alternativa temporária (se precisar ficar no v1):** force a API suportada exportando `DOCKER_API_VERSION=1.41` antes de rodar o comando, ex.:
   ```bash
   export DOCKER_API_VERSION=1.41
   docker-compose up -d
   ```
   Isso reduz a chance do erro em daemons mais novos, mas o recomendado continua sendo migrar para o plugin v2.

---

### ❌ Problema: "Cannot connect to the Docker daemon"

**Causa:** Docker Desktop não está rodando

**Solução:**
- Abra o Docker Desktop
- Aguarde até ver o ícone da baleia na bandeja do sistema
- Tente novamente

---

### ❌ Problema: "Port 80 is already in use"

**Causa:** Outra aplicação está usando a porta 80

**Solução:**

**Opção 1:** Pare o serviço que está usando a porta 80
- Windows: Geralmente é o IIS. Abra "Serviços" e pare o "IIS Admin Service"
- Linux: Pode ser Apache ou Nginx. Execute: `sudo systemctl stop apache2` ou `sudo systemctl stop nginx`

**Opção 2:** Mude a porta do SOC Dashboard
1. Edite o arquivo `docker-compose.yml`
2. Localize a linha `"80:80"` na seção do nginx
3. Altere para `"8080:80"` (ou outra porta disponível)
4. Salve e execute: `docker-compose up -d`
5. Acesse em: `http://localhost:8080`

---

### ❌ Problema: "Error response from daemon: Get https://...: unauthorized"

**Causa:** Credenciais inválidas no arquivo `.env`

**Solução:**
1. Abra o arquivo `.env`
2. Verifique se todas as credenciais estão corretas
3. Certifique-se de não ter espaços antes ou depois dos valores
4. Salve e reinicie: `docker-compose restart`

---

### ❌ Problema: Dashboard mostra "Nenhum alerta encontrado"

**Causa:** Fontes de dados não configuradas ou sem permissões

**Solução:**
1. Verifique se as fontes foram adicionadas no Painel Administrativo
2. Teste a conectividade manualmente:
   - Elasticsearch: Acesse a URL no navegador
   - Tenable: Verifique se as API Keys estão ativas
   - Defender: Confirme as permissões no Azure AD
   - OpenCTI: Teste o token na interface do OpenCTI
3. Veja os logs para erros: `docker-compose logs backend`

---

### ❌ Problema: "Out of memory" ou sistema lento

**Causa:** Recursos insuficientes

**Solução:**
1. Aumente a RAM alocada ao Docker:
   - **Windows/macOS:** Docker Desktop → Settings → Resources → Memory (aumente para 6GB)
2. Feche outros programas pesados
3. Reinicie o Docker: `docker-compose restart`

---

### ❌ Problema: Não consigo fazer login

**Causa:** Banco de dados não inicializou corretamente

**Solução:**
Pare tudo
docker-compose down

Remova os volumes
docker-compose down -v

Inicie novamente (criará novo banco)
docker-compose up -d

Aguarde 2 minutos e tente novamente

**Nota:** Isso apaga todos os dados! Use apenas como último recurso.

---

## ❓ Perguntas Frequentes (FAQ)

### 1. Preciso ter todas as 4 ferramentas configuradas?

**Resposta:** Não! O sistema funciona mesmo se você configurar apenas uma ou algumas das ferramentas. Por exemplo, se você só usa Tenable e Defender, configure apenas essas duas.

---

### 2. Posso usar sem Docker?

**Resposta:** Tecnicamente sim, mas não é recomendado. Você precisaria instalar:
- Python 3.11
- Node.js 20
- PostgreSQL 16
- Redis 7
- Nginx

E configurar tudo manualmente. Docker facilita muito!

---

### 3. Como faço backup dos dados?

**Resposta:**
Backup do banco de dados
docker-compose exec postgres pg_dump -U soc_admin soc_dashboard > backup_$(date +%Y%m%d).sql

Restaurar backup
cat backup_20241204.sql | docker-compose exec -T postgres psql -U soc_admin soc_dashboard

---

### 4. Posso acessar de outros computadores na rede?

**Resposta:** Sim!

1. Descubra o IP do servidor:
   - Windows: `ipconfig`
   - Linux/macOS: `ip addr` ou `ifconfig`
   
2. Acesse de outro computador usando: `http://IP_DO_SERVIDOR`
   - Exemplo: `http://192.168.1.100`

3. **Importante:** Configure firewall para permitir porta 80

---

### 5. Como atualizar para nova versão?

**Resposta:**
Baixe a nova versão
git pull

Reconstrua as imagens
docker-compose build

Reinicie
docker-compose up -d

---

### 6. O sistema consome muitos recursos?

**Resposta:** Uso médio:
- **RAM:** 2-3 GB durante operação normal
- **CPU:** 10-20% em background, 50-80% durante correlação intensa
- **Disco:** ~5 GB (aumenta com dados históricos)

---

### 7. Os dados ficam armazenados onde?

**Resposta:** Em volumes Docker:
- Localização (Linux): `/var/lib/docker/volumes/`
- Localização (Windows): `\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\`
- Localização (macOS): `~/Library/Containers/com.docker.docker/Data/`

**Para persistência:** Sempre use `docker-compose down` (sem `-v`) para NÃO apagar volumes.

---

### 8. Como funciona a correlação?

**Resposta:** O sistema:
1. Busca eventos críticos de cada fonte (CVSS ≥ 7, Risk Score ≥ 70, etc)
2. Agrupa por ativo (servidor/IP)
3. Calcula score de risco baseado em:
   - Número de alertas
   - Severidade individual
   - Presença de exploits
   - Inteligência de ameaças (OpenCTI)
4. Prioriza ativos com múltiplos indicadores

---

### 9. Posso customizar os thresholds?

**Resposta:** Sim! Edite o arquivo `.env`:
CVSS_HIGH_THRESHOLD=8.0 # Mais rigoroso
RISK_SCORE_CRITICAL_THRESHOLD=85 # Menos rigoroso
Reinicie: `docker-compose restart`

---

### 10. Tem suporte em português?

**Resposta:** A interface está em português! Os dados brutos (alertas, técnicas MITRE) vêm das ferramentas originais em inglês.

---

## 📞 Suporte e Ajuda

### Onde buscar ajuda?

1. **Documentação:** Leia este README completo
2. **Logs:** Sempre verifique os logs primeiro:
docker-compose logs -f backend
docker-compose logs -f frontend
3. **GitHub Issues:** Reporte problemas em https://github.com/brunodbz/dashboard/issues
4. **Comunidade:** Participe das discussões

### Como reportar um problema?

Ao abrir uma issue, inclua:
1. **Sistema Operacional:** Windows 11, Ubuntu 22.04, macOS 14, etc
2. **Versão do Docker:** `docker --version`
3. **Logs completos:** `docker-compose logs > logs.txt`
4. **Passos para reproduzir:** O que você fez antes do erro acontecer
5. **Screenshot:** Se aplicável

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🙏 Agradecimentos

- Elastic por documentação completa da API
- Tenable pela integração via Python SDK
- Microsoft pelo suporte a Graph API
- OpenCTI pela plataforma open-source

---

## 📊 Status do Projeto

![Status](https://img.shields.io/badge/status-stable-green) ![Tests](https://img.shields.io/badge/tests-passing-green) ![Coverage](https://img.shields.io/badge/coverage-85%25-yellowgreen)

**Última atualização:** Dezembro 2025  
**Versão:** 1.0.0  
**Mantenedor:** Bruno (@brunodbz)

---

**🛡️ Proteja sua infraestrutura com inteligência correlacionada!**

