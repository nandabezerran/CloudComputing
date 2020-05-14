# Photo-App Docker

Aplicação web hospedada no docker
## Iniciando serviços com docker compose
* Crie um arquivo docker-compose.yaml 
	> Insira no corpo do arquivo
	```
	version: "3"
  services:
    node:
      image: pedroln97/photo-app-image-node
      restart: unless-stopped
      depends_on: 
        - postgres
      environment:
        DATABASE_URL: postgres://user:pass@postgres:5432/db
        NODE_ENV: development
        PORT: 3000
      ports:
        - "3000:3000"
      command: node server.js
      networks:
        app-net: 
             ipv4_address: 172.16.238.10

      

    angular: 
        image: pedroln97/photo-app-image-angular 
        ports:  
          - '4200:4200'
        networks: 
          app-net: 
             ipv4_address: 172.16.238.12

     

    postgres:
      image: pedroln97/photo-app-image-postgres
      restart: unless-stopped
      volumes: 
        - .:/data
      ports: 
        - "5432:5432"
      networks:
        app-net: 
            ipv4_address: 172.16.238.11
            


  networks: 
    app-net: 
       driver: bridge 
       ipam:  
            driver: default
            config:  
               - subnet: 172.16.238.0/24
  ```
	> docker-compose up
  
## Criação Imagens
* Faça um clone do repositório
	> git clone https://github.com/nandabezerran/CloudComputing.git
	> git checkout gcp_relationaldb
* Criando imagem do node
	> cd CloudComputing
	> cd BackEnd-T01
	> sudo nano DockerFile
	> Insira no corpo do arquivo
    ```
    FROM node:10

    # Create app directory
    WORKDIR /usr/src/app

    # Install app dependencies
    # A wildcard is used to ensure both package.json AND package-lock.json are copied
    # where available (npm@5+)
    COPY package*.json ./

    RUN npm install
    # If you are building your code for production
    # RUN npm ci --only=production

    # Bundle app source
    COPY . .

    EXPOSE 3000
    CMD [ "node", "server.js" ]
    ```
	> docker build -t photo-app-image-node .

* Criando imagem do angular
	> cd CloudComputing
	> cd FrontEnd-T01
	> cd photo-app
	> sudo nano DockerFile 
	> Insira no corpo do arquivo
    ```
    FROM node:12.7-alpine
       
       RUN mkdir -p /app
       WORKDIR /app
       
       COPY package.json /app/
       
       RUN ["npm", "install"]
       
       COPY . /app
      
       EXPOSE 4200/tcp
      
       CMD ["npm", "start", "--", "--host", "0.0.0.0", "--disableHostCheck", "true", "--proxy-config", "proxy.conf.json", "--prod", "--aot", "--optimization"]
    ```
	> docker build -t photo-app-image-angular . 

* Criando imagem postgrees
	> Crie uma pasta Postgres na raiz do ambiente docker
	> Crie um arquivo init.sql
	> Insira no corpo do arquivo
  	```
  	CREATE TABLE photos (
  		id bigserial NOT NULL,
  		likes text[],
  		user_id text,
  		photo_url text,
  		date text
  	)
  	```
	> sudo nano DockerFile 
	> Insira no corpo do arquivo 
    ```
    FROM postgres:9.4
    ENV POSTGRES_USER postgres
    ENV POSTGRES_PASSWORD admin
    ENV POSTGRES_DB photo-app 
    COPY init.sql /docker-entrypoint-initdb.d/
    ```
	> docker build -t photo-app-image-postgres .

## Adicionando credenciais
* Adiciona os dois arquivos de credenciais na pasta util no backend
	> cd CloudComputing
	> cd BackEnd-T01
	> cd util


