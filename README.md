# Astro Orbit Simulator

<div align="center">
  <img src="./frontend/src/assets/AOS-cropped.png" alt="Logo do Astro Orbit Simulator" width="100%">
</div>

## Um simples simulador de órbitas planetárias usando Three.js, React and Astroquery.

Esse simulador permite visualizar as órbitas de planetas no sistema solar utilizando dados de uma API para definir as características dos planetas e da estrela central, que pode ser alterada para algumas estrelas selecionadas.

## Como rodar localmente

> Requisitos: [Node.js](https://nodejs.org/) e [Python 3.9.5+](https://www.python.org/downloads/)

1. Clone o repositório:
   ```bash
   git clone https://github.com/coffee-unb/AstrOrbitS.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd AstrOrbitS
   ```
### Passos para rodar o frontend
1. Navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra o navegador e acesse `http://localhost:5173` para ver o simulador em ação.
### Passos para rodar o backend
1. Navegue até o diretório do backend:
    ```bash
    cd backend
    ```
2. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
3. (Opcional) Crie um ambiente virtual para isolar as dependências:
    ```bash
    python -m venv .venv
    ```
    Se estiver usando um ambiente virtual, ative-o com:
    ```bash
    source .venv/bin/activate
    ```
4. Inicie o servidor:
    ```bash
    uvicorn main:app --reload --port 8000
    ```
5. Abra o navegador e acesse `http://localhost:8000/docs` para ver a documentação da API.