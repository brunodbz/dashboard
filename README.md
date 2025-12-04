# SOC Dashboard - Correlação de Eventos de Segurança

Dashboard profissional para Security Operations Center (SOC) com integração de múltiplas ferramentas de segurança e correlação inteligente de eventos críticos.

## 🚀 Funcionalidades

- ✅ **Integração com 4 plataformas**: Elasticsearch SIEM, Tenable, Microsoft Defender, OpenCTI
- ✅ **Correlação inteligente** de eventos críticos por ativo
- ✅ **Dashboard em tempo real** com atualização automática
- ✅ **Painel administrativo** completo
- ✅ **Gerenciamento de usuários** com 3 níveis de acesso (Admin, Analyst, Viewer)
- ✅ **Configuração de fontes** de dados via interface
- ✅ **Exportação** para Excel e PDF
- ✅ **Containerizado** com Docker para fácil deploy
- ✅ **Autenticação** JWT com roles-based access control

## 📊 Métricas Monitoradas

### Elasticsearch SIEM
- Risk Score ≥ 70 (High/Critical)
- Event Severity: critical/high
- Host/User Risk Level: Critical/High

### Tenable
- CVSS Score ≥ 7.0 (High: 7.0-8.9, Critical: 9.0-10.0)
- VPR Score ≥ 7.0
- Exploits disponíveis

### Microsoft Defender
- Severity: High/Critical
- Incidentes de alta prioridade
- Técnicas MITRE ATT&CK

### OpenCTI
- Confidence ≥ 75
- Indicators de alta severidade
- Threat Intelligence em tempo real

## 🛠️ Stack Tecnológico

**Backend:**
- FastAPI (Python 3.11)
- PostgreSQL 16
- Redis 7
- SQLAlchemy (async)
- Pydantic
- JWT Authentication

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Query
- Axios

**Infraestrutura:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Alembic (migrations)

## 📦 Instalação

### Pré-requisitos
- Docker 24+
- Docker Compose 2.0+
- 4GB RAM mínimo
- Credenciais das plataformas de segurança

### Passo 1: Clone o repositório
git clone https://github.com/brunodbz/soc-dashboard.git
cd soc-dashboard

### Passo 2: Configure variáveis de ambiente
cp .env.example .env
nano .env # Edite com suas credenciais

### Passo 3: Build e inicialização
Build das imagens
make build

Iniciar containers
make up

Ver logs
make logs

### Passo 4: Acesse o dashboard

http://localhost

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123` (ALTERE IMEDIATAMENTE!)

## 🔧 Comandos Úteis
Parar containers
make down

Reiniciar
make restart

Limpar tudo (volumes e containers)
make clean

Ver logs em tempo real
make logs

Executar migrações
make migrate

## 📁 Estrutura do Projeto
soc-dashboard/
├── backend/
│ ├── app/
│ │ ├── api/ # Endpoints REST
│ │ ├── integrations/ # Conectores (Elastic, Tenable, etc)
│ │ ├── services/ # Lógica de negócio
│ │ └── models.py # Modelos de dados
│ └── Dockerfile
├── frontend/
│ ├── src/
│ │ ├── components/ # Componentes React
│ │ ├── services/ # API client
│ │ └── types/ # TypeScript types
│ └── Dockerfile
├── nginx/
│ └── nginx.conf
└── docker-compose.yml

## 🔐 Segurança

- Autenticação JWT com expiração configurável
- Role-Based Access Control (RBAC)
- Senhas hasheadas com bcrypt
- CORS configurável
- Security headers no Nginx
- Validação de dados com Pydantic

## 📈 Performance

- Refresh automático a cada 60 segundos
- Query caching com React Query
- Conexões assíncronas ao banco
- Redis para cache de sessões
- Compressão gzip habilitada

## 🚦 Troubleshooting

### Containers não iniciam
docker-compose logs backend
docker-compose logs frontend

### Erro de conexão com APIs
Verifique as credenciais no `.env` e conectividade de rede.

### Problema com migrações
docker-compose exec backend alembic revision --autogenerate -m "descrição"
docker-compose exec backend alembic upgrade head

## 📄 Licença

MIT License - veja LICENSE para detalhes

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores, abra uma issue primeiro.


