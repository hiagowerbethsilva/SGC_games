# SGC Games

Sistema de Gestão Comercial para uma loja de games, consoles e jogos.

O SGC Games é uma aplicação web desenvolvida em Java com Spring Boot, com o objetivo de gerenciar clientes, produtos, usuários, vendas, estoque e relatórios de uma loja que vende consoles PlayStation, Xbox, Nintendo e seus respectivos jogos.

## Objetivo do Projeto

O objetivo do sistema é permitir que uma loja de games consiga controlar suas principais operações comerciais, incluindo cadastro de clientes, cadastro de produtos, registro de vendas, baixa automática de estoque, autenticação de usuários e geração de relatórios.

## Tecnologias Utilizadas

* Java 21
* Spring Boot
* Spring MVC
* Spring Data JPA
* MySQL
* Maven
* Lombok
* BCrypt
* HTML
* CSS
* JavaScript puro
* Git e GitHub

## Funcionalidades Implementadas

### Autenticação de Usuários

* Cadastro de usuários
* Login no sistema
* Senha criptografada com BCrypt
* Geração de token de autenticação
* Token com tempo de expiração
* Validação de token

### Gestão de Clientes

* Cadastro de clientes
* Listagem de clientes
* Edição de clientes
* Exclusão de clientes
* Validação de CPF único
* Validação de email
* Bloqueio de exclusão de cliente com vendas registradas

### Gestão de Produtos

* Cadastro de produtos
* Listagem de produtos
* Edição de produtos
* Exclusão de produtos
* Controle de preço
* Controle de quantidade em estoque
* Controle de estoque mínimo
* Consulta de produtos com estoque baixo
* Bloqueio de venda quando o estoque é insuficiente

### Registro de Vendas

* Seleção de cliente
* Seleção de produtos
* Adição de itens à venda
* Cálculo automático do subtotal dos itens
* Cálculo automático do valor total da venda
* Registro do usuário responsável pela venda
* Atualização automática do estoque após a venda
* Bloqueio de venda sem itens

### Relatórios

* Relatório de vendas por período
* Relatório de vendas por cliente
* Relatório de vendas por produto
* Representação gráfica das vendas anuais

## Arquitetura do Sistema

O projeto utiliza arquitetura em camadas, separando responsabilidades para facilitar manutenção, organização e evolução do sistema.

Fluxo da aplicação:

```text
Interface Web → Controller → Service → Repository → Banco de Dados
```

### Camada de Apresentação

Localizada em:

```text
src/main/resources/static
```

Contém a interface web do sistema, desenvolvida com HTML, CSS e JavaScript puro.

Arquivos principais:

```text
index.html
style.css
app.js
```

### Camada Controller

Localizada em:

```text
src/main/java/com/example/SGC/Games/Controller
```

Responsável por receber as requisições HTTP e chamar os serviços correspondentes.

Controllers principais:

```text
ClientesController
ProdutosController
UsuariosController
VendasController
RelatoriosController
GlobalExceptionHandler
```

### Camada Service

Localizada em:

```text
src/main/java/com/example/SGC/Games/Service
```

Responsável pelas regras de negócio do sistema.

Services principais:

```text
ClientesService
ProdutosService
UsuariosService
VendasService
RelatoriosService
```

### Camada Repository

Localizada em:

```text
src/main/java/com/example/SGC/Games/Repository
```

Responsável pela comunicação com o banco de dados utilizando Spring Data JPA.

Repositories principais:

```text
ClientesRepository
ProdutosRepository
UsuariosRepository
VendasRepository
ItemVendasRepository
```

### Camada Model

Localizada em:

```text
src/main/java/com/example/SGC/Games/model
```

Responsável por representar as entidades do sistema.

Entidades principais:

```text
Clientes
Produtos
Usuarios
Vendas
ItemVendas
```

## Design Pattern Utilizado

O projeto utiliza o padrão de projeto Repository.

Esse padrão foi aplicado nas interfaces da camada Repository, como:

```text
ClientesRepository
ProdutosRepository
UsuariosRepository
VendasRepository
ItemVendasRepository
```

O Repository Pattern foi escolhido porque separa a lógica de acesso ao banco de dados da lógica de negócio. Dessa forma, os Services não precisam conhecer detalhes da persistência, apenas utilizam os métodos fornecidos pelos repositories.

Benefícios:

* Melhor organização do código
* Baixo acoplamento
* Maior facilidade de manutenção
* Separação clara de responsabilidades
* Reutilização dos métodos de persistência

## Banco de Dados

O sistema utiliza MySQL como banco de dados.

Nome do banco:

```text
sgc_games
```

Tabelas principais:

```text
usuarios
clientes
produtos
vendas
itens_venda
```

### Modelo Lógico Simplificado

```text
CLIENTES
- id
- nome
- cpf
- email
- telefone
- endereco

PRODUTOS
- id
- nome
- descricao
- preco
- quantidade_estoque
- estoque_minimo
- tipo
- plataforma

USUARIOS
- id
- username
- senha
- perfil
- token
- token_expiracao

VENDAS
- id
- data_venda
- valor_total
- cliente_id
- usuario_id

ITENS_VENDA
- id
- quantidade
- preco_unitario
- subtotal
- venda_id
- produto_id
```

### Relacionamentos

```text
Cliente 1:N Venda
Usuario 1:N Venda
Venda 1:N ItemVenda
Produto 1:N ItemVenda
```

## Script SQL

O projeto possui um script SQL para criação do banco de dados e das tabelas.

Arquivo:

```text
script-sgc-games.sql
```

Esse script pode ser executado no MySQL Workbench ou em outro cliente MySQL.

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/hiagowerbethsilva/SGC_games.git
```

### 2. Entrar na pasta do projeto

```bash
cd SGC_games
```

Caso o projeto esteja dentro de uma subpasta, entre na pasta onde está o arquivo `pom.xml`.

### 3. Criar o banco de dados

No MySQL Workbench, execute:

```sql
CREATE DATABASE IF NOT EXISTS sgc_games;
```

Ou execute o arquivo:

```text
script-sgc-games.sql
```

### 4. Configurar o banco no application.properties

Arquivo:

```text
src/main/resources/application.properties
```

Exemplo de configuração:

```properties
spring.application.name=SGC-Games

spring.datasource.url=jdbc:mysql://localhost:3306/sgc_games?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_DO_MYSQL
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Troque `SUA_SENHA_DO_MYSQL` pela senha do seu MySQL.

### 5. Executar o projeto

Pelo terminal:

```bash
mvn spring-boot:run
```

Ou pelo VS Code/IDE, execute a classe principal:

```text
SgcGamesApplication
```

### 6. Acessar no navegador

Com o Spring Boot rodando, acesse:

```text
http://localhost:8080
```

## Como Usar o Sistema

### Login

Ao abrir o sistema, o usuário deve informar username e senha.

Caso seja o primeiro acesso, é possível criar um usuário inicial na tela de login.

### Clientes

No menu Clientes, é possível cadastrar, listar, editar e excluir clientes.

O sistema valida CPF duplicado e email inválido.

### Produtos

No menu Produtos, é possível cadastrar consoles e jogos, informando nome, descrição, preço, estoque, estoque mínimo, tipo e plataforma.

Também é possível consultar produtos com estoque baixo.

### Vendas

No menu Vendas, o operador seleciona um cliente, escolhe produtos, informa a quantidade e adiciona os itens à venda.

Ao finalizar, o sistema calcula automaticamente o total e reduz o estoque dos produtos vendidos.

### Relatórios

No menu Relatórios, é possível consultar:

* Vendas por período
* Vendas por cliente
* Vendas por produto
* Gráfico anual de vendas

## Endpoints Principais

### Usuários

```text
POST /usuarios
POST /usuarios/login
GET /usuarios
GET /usuarios/{id}
GET /usuarios/validar-token?token=...
```

### Clientes

```text
POST /clientes
GET /clientes
GET /clientes/{id}
PUT /clientes/{id}
DELETE /clientes/{id}
```

### Produtos

```text
POST /produtos
GET /produtos
GET /produtos/{id}
PUT /produtos/{id}
DELETE /produtos/{id}
GET /produtos/estoque-baixo
```

### Vendas

```text
POST /vendas
GET /vendas
GET /vendas/{id}
```

### Relatórios

```text
GET /relatorios/periodo?inicio=2026-01-01T00:00:00&fim=2026-12-31T23:59:59
GET /relatorios/cliente/{clienteId}
GET /relatorios/produto/{produtoId}
GET /relatorios/anual?ano=2026
```

## Regras de Negócio

* CPF do cliente não pode ser duplicado
* Email do cliente deve ser válido
* Cliente com vendas registradas não pode ser removido
* Produto não pode ter preço negativo
* Produto não pode ter estoque negativo
* Estoque mínimo deve ser controlado
* Venda não pode ser realizada sem itens
* Venda não pode ser realizada sem cliente
* Venda não pode ser realizada sem usuário responsável
* Venda não pode ocorrer se o estoque for insuficiente
* Valor total da venda é calculado automaticamente
* Estoque é atualizado automaticamente após a venda
* Senha do usuário é criptografada com BCrypt
* Token de autenticação possui tempo de expiração

## Documentação

A documentação técnica do projeto contém:

* Visão geral do sistema
* Arquitetura em camadas
* Tecnologias utilizadas
* Design Pattern aplicado
* Regras de negócio
* Casos de uso
* Plano de testes
* Diagrama de classes
* Diagrama de domínio
* Diagrama lógico do banco
* Manual do usuário
* Instruções para executar o sistema

## Casos de Uso

Principais casos de uso implementados:

* Cadastrar cliente
* Consultar clientes
* Cadastrar produto
* Consultar produtos
* Realizar venda
* Consultar vendas
* Emitir relatórios
* Gerenciar usuários

## Plano de Testes

Testes recomendados:

```text
CT01 - Cadastrar cliente com dados válidos
CT02 - Tentar cadastrar cliente com CPF repetido
CT03 - Tentar cadastrar cliente com email inválido
CT04 - Cadastrar produto com dados válidos
CT05 - Tentar cadastrar produto com preço negativo
CT06 - Realizar venda com estoque disponível
CT07 - Tentar realizar venda com estoque insuficiente
CT08 - Verificar baixa automática de estoque
CT09 - Consultar relatório por cliente
CT10 - Consultar relatório por período
CT11 - Consultar relatório por produto
CT12 - Visualizar gráfico anual de vendas
CT13 - Fazer login com usuário válido
CT14 - Fazer login com senha inválida
CT15 - Validar token de autenticação
```

## Estrutura do Projeto

```text
SGC-Games
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.example.SGC.Games
│   │   │       ├── Controller
│   │   │       ├── Service
│   │   │       ├── Repository
│   │   │       ├── model
│   │   │       └── SgcGamesApplication.java
│   │   └── resources
│   │       ├── static
│   │       │   ├── index.html
│   │       │   ├── style.css
│   │       │   └── app.js
│   │       └── application.properties
├── script-sgc-games.sql
├── pom.xml
└── README.md
```

## Repositório GitHub

Link do repositório:

```text
https://github.com/hiagowerbethsilva/SGC_games
```

## Autor

Projeto desenvolvido para fins acadêmicos na disciplina de desenvolvimento de sistemas.

Aluno: Hiago Werbeth, fellipe eduardo, warley kerlon e yuri oliveira

## Status do Projeto

Projeto em versão final acadêmica, com funcionalidades principais implementadas e pronto para apresentação.
