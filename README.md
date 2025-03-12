# Uiara - Identificação de Áudios Suspeitos

## Introdução
O Uiara é uma aplicação fullstack desenvolvida para auxiliar magistrados na identificação de áudios suspeitos. A plataforma permite que o usuário envie um áudio para análise, onde um modelo de Inteligência Artificial verifica se o áudio é sintético (gerado por outra IA) ou humano. Com base no resultado, o backend gera uma análise detalhada e a disponibiliza para download. Além disso, os dados dos áudios processados são armazenados em um banco de dados para referência futura.

## Tecnologias Utilizadas
- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **Banco de Dados:** PostgreSQL
- **Containerização:** Docker e Docker Compose
- **Autenticação:** JWT
- **Machine Learning:** TensorFlow e Librosa

## Estrutura do Projeto
```
📂 uiara
 ├── 📂 controller       # Contém a lógica da aplicação e as funções chamadas pelas rotas.
 ├── 📂 models           # Define os modelos do banco de dados usando SQLAlchemy.
 ├── 📂 routes           # Contém os endpoints da API organizados por funcionalidade.
 ├── 📂 schemas          # Define os formatos dos dados que a API recebe e retorna.
 ├── 📂 trained_model    # Implementação do modelo de IA para classificação de áudios.
 ├── 📂 config.py        # Configurações globais do projeto, como caminhos e variáveis.
 ├── 📂 database.py      # Configuração do banco de dados e conexão com PostgreSQL.
 ├── 📂 main.py          # Ponto de entrada do backend FastAPI.
 ├── 📂 validation.py    # Implementação de regras de validação para entrada de dados.
```

## Instalação e Configuração
### 1. Clonar o repositório
```sh
$ git clone https://github.com/viniciusleitef/uiara
$ cd uiara
```
### 2. Construir as imagens Docker
```sh
$ docker build -t detectai_fastapi_image:latest -f docker/Dockerfile.fastapi .
$ docker build -t detectai_vite_image:latest -f docker/Dockerfile.vite .
```
### 3. Rodar o Docker Compose
```sh
$ cd ./Docker
$ docker-compose up -d
```
### 4. Criar a tabela de status
Acesse `http://localhost:8302/docs` e faça uma requisição para `POST /createStatus`.

### 5. Criar conta na plataforma e conceder permissões de admin
```sh
$ docker exec -it detectai_postgres bash
$ psql -U postgres -d detectai
$ \dt
$ SELECT * FROM users;
$ UPDATE users SET type = 'admin' WHERE id = 1;
```

### 6. Adicionar modelos na plataforma
Acesse `http://localhost:8305/admin` e adicione um modelo de IA treinado.

## Configuração do `.env`
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
```env
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_SERV=...
EMAIL_FROM=...
VITE_API_URL=http://localhost:8302/
VITE_HAVE_AUTH=true
CHAVE_DO_SITE=...
CHAVE_SECRETA_CAPTCHA=...
SECRET_KEY=...
NGROK_AUTH_TOKEN=...
SQLALCHEMY_DATABASE_URL=postgresql://postgres:postgres@detectai_postgres:5433/detectai
```