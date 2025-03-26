# Coleção Postman para Testes de Pedidos e Itens de Pedido

Este diretório contém uma coleção Postman para testar as APIs de Pedidos e Itens de Pedido da InfoShop.

## Como Usar

1. Instale o [Postman](https://www.postman.com/downloads/) caso ainda não tenha instalado.
2. Abra o Postman e clique em "Import" no canto superior esquerdo.
3. Selecione o arquivo `InfoShop_Orders_Collection.postman_collection.json` para importar.
4. Após a importação, a coleção "InfoShop - Pedidos e Itens" estará disponível no seu workspace.

## Configuração do Ambiente

A coleção utiliza uma variável de ambiente `base_url` que deve ser configurada:

1. Clique no ícone de engrenagem (⚙️) no canto superior direito do Postman.
2. Clique em "Add" para criar um novo ambiente.
3. Dê um nome ao ambiente (ex: "InfoShop Local").
4. Adicione a variável `base_url` com o valor `http://localhost:8080` (ou o endereço onde sua API está rodando).
5. Clique em "Save" para salvar o ambiente.
6. Selecione o ambiente criado no dropdown no canto superior direito do Postman.

## Estrutura da Coleção

A coleção está organizada em três pastas principais:

### 1. Pedidos

Contém requisições para gerenciar pedidos:
- Listar todos os pedidos
- Criar pedido vazio
- Criar pedido a partir do carrinho
- Buscar pedido por ID
- Atualizar status do pedido
- Deletar pedido
- Listar pedidos de um cliente
- Testes de validação

### 2. Itens de Pedido

Contém requisições para gerenciar itens de pedido:
- Listar todos os itens de pedido
- Adicionar item ao pedido
- Buscar item de pedido por ID
- Atualizar quantidade de item
- Deletar item de pedido
- Listar itens de um pedido
- Deletar todos os itens de um pedido
- Testes de validação

### 3. Fluxo Completo

Contém uma sequência de requisições que simulam um fluxo completo de criação e manipulação de um pedido:
1. Criar pedido vazio
2. Adicionar primeiro item ao pedido
3. Adicionar segundo item ao pedido
4. Verificar pedido com itens
5. Atualizar quantidade do primeiro item
6. Verificar pedido atualizado
7. Remover segundo item
8. Verificar pedido após remoção
9. Atualizar status do pedido
10. Verificar pedido finalizado

## Testes de Validação

A coleção inclui vários testes de validação para verificar o comportamento da API em cenários de erro:
- Criar pedido sem cliente
- Criar pedido com cliente inexistente
- Criar pedido de carrinho inexistente
- Adicionar item sem pedido
- Adicionar item sem produto
- Adicionar item com pedido inexistente
- Adicionar item com produto inexistente
- Adicionar item com quantidade zero ou negativa
- Adicionar item com quantidade maior que estoque

## Executando os Testes

Você pode executar as requisições individualmente ou usar o "Runner" do Postman para executar toda a coleção ou pastas específicas em sequência.

Para usar o Runner:
1. Clique no botão "Runner" no canto inferior esquerdo do Postman.
2. Selecione a coleção ou pasta que deseja executar.
3. Configure as opções de execução (iterações, delay, etc.).
4. Clique em "Run" para iniciar os testes.

## Dicas

- Antes de executar os testes, certifique-se de que sua API está rodando e acessível.
- Para testes que envolvem IDs específicos, você pode precisar ajustar os valores nos corpos das requisições para corresponder aos IDs existentes no seu banco de dados.
- A pasta "Fluxo Completo" é especialmente útil para testar a integração entre diferentes endpoints da API.

## Sequência completa do fluxo de testes:

1. Criação de Pessoa : Registra um usuário com seus dados pessoais
2. Criação de Cliente : Associa a pessoa a um cliente com credenciais
3. Criação de Endereço : Adiciona um endereço ao cliente
4. Criação de Categorias : Cria categorias para classificar produtos
5. Criação de Produtos : Registra produtos e os associa às categorias
6. Criação de Carrinho : Cria um carrinho para o cliente
7. Adição de Itens ao Carrinho : Adiciona produtos ao carrinho
8. Verificação do Carrinho : Consulta o carrinho com seus itens
9. Criação de Pedido : Converte o carrinho em um pedido
10. Verificação do Pedido : Consulta o pedido com seus itens
11. Atualização do Status do Pedido : Finaliza o pedido