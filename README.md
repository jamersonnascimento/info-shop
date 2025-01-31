# Documentação da Aplicação Mobile (React Native)
Este documento abordará tudo que é preciso para a utilização da aplicação mobile da loja de informática.

# Olá! Sejam bem-vindos! 👋

## 🚀 Sobre mim

Olá, sou Jamerson Nascimento, e sou um programador apaixonado por tecnologia eletrônica. Eu moro em Camaragibe e atualmente sou um estudante fullstack em programação.

## 🛠 Habilidades
React Native, JavaScript, Node.js, Express, PostgreSQL, HTML, CSS (aprendendo)

# 1. Visão Geral

- **Nome do Projeto:** Computer Shop Mobile
- **Descrição:** Aplicação mobile desenvolvida em React Native para uma loja de informática.
- **Autor:** Jamerson Nascimento
- **Data de Criação:** 30/01/2025
- **Versão:** 0.67

# 2. Introdução

Bem-vindo à documentação da aplicação mobile desenvolvida em React Native para a loja de informática. Esta aplicação tem como objetivo permitir aos clientes visualizar e comprar produtos diretamente pelo smartphone, além de gerenciar pedidos e acompanhar status de compras.

Nossa aplicação foi projetada com foco na experiência do usuário, garantindo uma navegação fluida e intuitiva. A aplicação ainda está em desenvolvimento, portanto, existem várias funcionalidades para serem implementadas. A aplicação ainda não está usando API para o banco de dados, usando apenas o banco local diretamente pelo React-Native. 

# 3. O que preciso para usar a aplicação?

### Requisitos de Hardware:

- Para dispositivos móveis com as seguintes especificações mínimas:
- Sistema Operacional: Android 7.0+ ou iOS 12+
- Memória RAM: 2 GB ou superior
- Espaço de armazenamento: 100 MB de espaço livre
- Conexão com a Internet

### Requisitos de Software:

- **Requisitos de software:**
- *Sistema Operacional para Desenvolvimento:*
  - Windows, macOS ou Linux
- *Ferramenta de Desenvolvimento:*
  - Node.js (versão 16+)
  - React Native CLI ou Expo CLI
  - Emuladores Android/iOS ou dispositivos físico



- **Dependências:**
  - *Aqui estão as dependências utilizadas no projeto, conforme especificado no arquivo package.json:*
  ```
  {
  "dependencies": {
    "@expo/metro-runtime": "~4.0.1",
    "@react-native-async-storage/async-storage": "^1.23.1",
    "@react-native-community/masked-view": "^0.1.11",
    "@react-navigation/bottom-tabs": "^7.2.0",
    "@react-navigation/native": "^7.0.14",
    "@react-navigation/native-stack": "^7.2.0",
    "@react-navigation/stack": "^7.1.1",
    "expo": "~52.0.25",
    "expo-cli": "^6.3.12",
    "expo-status-bar": "~2.0.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "^0.76.6",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "^3.16.6",
    "react-native-safe-area-context": "^4.12.0",
    "react-native-screens": "^4.4.0",
    "react-native-vector-icons": "^10.2.0",
    "react-native-web": "~0.19.13"
  },
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@babel/plugin-transform-private-methods": "^7.25.9",
    "babel-preset-expo": "^12.0.4",
    "metro-react-native-babel-preset": "^0.77.0"
  }
}
```
 
# 4. Estrutura de Pastas do Projeto
```
Info-Shop/ [pasta raíz]
├── .expo/  #Arquivos de configuração gerados pelo Expo
├── .gitignore  #Arquivo para especificar quais arquivos e pastas devem ser ignorados pelo Git
├── App.js  #Arquivo principal do aplicativo, ponto de entrada
├── app.json  #Arquivo de configuração do aplicativo Expo
├── assets/  #Pasta para armazenar arquivos de mídia como imagens, fontes, etc
├── babel.config.js  #Arquivo de configuração do Babel para transpilar código JavaScript moderno
├── LICENCE  #Arquivo contendo a licença do projeto
├── package.json  #Arquivo de gerenciamento de dependências e scripts do npm
├── README.md  #Documento de explicação e instruções do projeto
├── src/
│       ├── assets  
│       │ ├── images/  #Pasta para armazenar imagens utilizadas no projeto
│       ├── components
│       │ ├── BottomNavigation.js  #Componente de navegação inferior do aplicativo
│       │ ├── CartItem.js  #Componente para exibir um item no carrinho de compras
│       │ ├── CategoryItem.js  #Componente para exibir uma categoria de produtos
│       │ ├── EmptyCartMessage.js  #Componente para exibir uma mensagem quando o carrinho está vazio
│       │ ├── EmptyFavoritesMessage.js  #Componente para exibir uma mensagem quando os favoritos estão vazios
│       │ ├── LoginForm.js  #Componente para o formulário de login
│       │ ├── ProductItem.js  #Componente para exibir um produto individual
│       │ ├── SearchBar.js  #Componente da barra de pesquisa
│       ├── context/
│       │ ├── CartContext.js  #Contexto do React para gerenciar o estado do carrinho de compras
│       ├── navigation/
│       │ ├── AppNavigator.js  #Arquivo de navegação principal para definir as rotas do aplicativo
│       ├──screens/
│       │ ├── AccountScreen.js  #Tela da conta do usuário
│       │ ├── CartScreen.js  #Tela do carrinho de compras
│       │ ├── CategoriesScreen.js  #Tela de categorias de produtos
│       │ ├── CustomerServiceScreen.js  #Tela de serviço ao cliente
│       │ ├── FavoritesScreen.sj  #Tela de produtos favoritos
│       │ ├── HardwareProductsScreen.js  #Tela de produtos de hardware
│       │ ├── HomeScreen.js  #Tela inicial do aplicativo
│       │ ├── OrderSummaryScreen.js  #Tela de resumo do pedido
│       │ ├── PCsDesktopGamerScreen.js  #Tela de PCs desktop gamers
│       │ ├── PeripheralsACcessoriesScreen.js  #Tela de periféricos e acessórios
│       ├── services/
│       │ ├──  api.js  #Arquivo para chamadas de API e serviços de backend (será implementado depois!)
│       ├── styles/
│       │ ├── colors.js  #Arquivo de configuração das cores utilizadas no aplicativo (para ser usado no futuro)

```
 # 5. Tecnologias Utilizadas

1. **React Native**: Framework para desenvolvimento de aplicativos móveis multiplataforma (Android e iOS).

2. **Expo**: Ferramenta que facilita o desenvolvimento e teste de aplicativos React Native. Expo-CLI é uma interface de linha de comando para gerenciar projetos Expo.

3. **React Navigation**: Biblioteca de navegação, incluindo:
@react-navigation/native - Biblioteca principal para navegação em aplicativos React Native.
@react-navigation/bottom-tabs - Biblioteca para criar navegação por abas na parte inferior da tela.
@react-navigation/native-stack - Biblioteca para criar navegação em pilha (stack navigation) com integração nativa.
@react-navigation/stack -Biblioteca para criar navegação em pilha (stack navigation).

4. **Async Storage**: Armazenamento assíncrono local:
@react-native-async-storage/async-storage - Biblioteca para armazenamento local de dados em dispositivos móveis, substituindo o AsyncStorage do React Native.

5. **Gesture Handler**: Manipulação de gestos na interface:
react-native-gesture-handler - Biblioteca para manipulação de gestos em aplicativos React Native.

6. **Reanimated**: Animações fluidas:
react-native-reanimated - Biblioteca para animações em aplicativos React Native.

7. **Safe Area Context**: Ajuste automático para áreas seguras da tela:
react-native-safe-area-context - Biblioteca para lidar com áreas seguras em dispositivos móveis.

8. **React Native Screens**: Otimização de telas nativas:
react-native-screens - Biblioteca para otimizar a navegação em aplicativos React Native, utilizando componentes nativos de tela.

9. **Masked View**: Exibição de máscaras visuais:
@react-native-community/masked-view - Componente para criar visualizações mascaradas, usado principalmente em navegação

10. **React Native Vector Icons**: Ícones personalizados:
react-native-vector-icons - Biblioteca para uso de ícones vetoriais em aplicativos React Native.
 
11. **React Native Web**: Suporte para execução em navegadores:
react-native-web - Biblioteca para rodar aplicativos React Native na web.

12. **Babel**: Transpiler para ES6+:
@babel/core
@babel/plugin-transform-private-methods
babel-preset-expo

13. **Metro**: Utilizado pelo Expo para empacotar e servir o código JavaScript.:
@expo/metro-runtime
metro-react-native-babel-preset

14. **Git**: Um sistema de controle de versão amplamente utilizado para rastrear as alterações no código-fonte e colaborar em projetos de software.

15. **GitHub**: Uma plataforma de hospedagem de código-fonte que permite o armazenamento, colaboração e gerenciamento de projetos baseados em Git.

Essas são as principais tecnologias e ferramentas utilizadas no projeto. É importante lembrar que a escolha das tecnologias pode evoluir conforme o projeto avança e escala. Portanto, este documento deve ser atualizado regularmente, refletindo as preferências e necessidades da equipe de desenvolvimento.


# 6. Instalação e Configuração

*Pré-requisitos*
Antes de começar, certifique-se de ter o Node.js e o npm (Node Package Manager) instalados em seu sistema. Você pode baixá-los em nodejs.org.
A seguir, você encontrará instruções detalhadas sobre como instalar e configurar o projeto em um ambiente local.

1. **Clone o repositório:**

    Primeiramente, clone o repositório do projeto para sua máquina local usando o seguinte comando do Git:

    ```
    git clone https://github.com/jamersonnascimento/info-shop.git
    ```

2. **Acesse a pasta do projeto:**

    Entre na pasta do projeto utilizando o comando:

    ```
    cd info-shop
    ```

    Obs.: Lembre-se que você poderá escolher qualquer caminho de diretório, bem como qualquer nome!

3. **Instale as dependências:**

    Utilize o Node.js e o npm (gerenciador de pacotes do Node.js) para instalar as dependências necessárias do projeto. Rode o seguinte comando na pasta raiz do projeto:

    ```
    npm install
    ```

4. **Configuração do AsyncStorage:**

    O projeto utiliza AsyncStorage para armazenamento local de dados. Para instalar e configurar o AsyncStorage, execute:

5. **Inicie a aplicação:**

    Com todas as dependências instaladas e o banco de dados configurado, você pode iniciar a aplicação com o seguinte comando:

    ```
    npx expo start
    ```
    Fique esperto! Note a sintaxe do script dentro de `package.json`:
    ```
    "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
    },
    ```
Pronto! Agora o projeto está instalado e configurado em seu ambiente local e pronto para ser usado.

# 7. Funcionalidades

1. **Tela Inicial** (HomeScreen)
Exibição de Produtos em Destaque: Mostra uma lista de produtos em destaque para o usuário.
Categorias de Produtos: Permite ao usuário navegar por diferentes categorias de produtos.
2. **Tela de Categorias** (CategoriesScreen)
Listagem de Categorias: Exibe todas as categorias de produtos disponíveis.
Navegação para Produtos da Categoria: Permite ao usuário selecionar uma categoria e ver os produtos correspondentes.
3. **Tela de Produtos de Hardware** (HardwareProductsScreen)
Listagem de Produtos de Hardware: Exibe uma lista de produtos de hardware disponíveis para compra.
4. **Tela de PCs Desktop Gamer** (PCsDesktopGamerScreen)
Listagem de PCs Desktop Gamer: Exibe uma lista de PCs desktop gamer disponíveis para compra.
5. **Tela de Periféricos e Acessórios** (PeripheralsAccessoriesScreen)
Listagem de Periféricos e Acessórios: Exibe uma lista de periféricos e acessórios disponíveis para compra.
6. **Tela do Carrinho de Compras** (CartScreen)
Exibição de Itens no Carrinho: Mostra todos os itens que o usuário adicionou ao carrinho.
Atualização de Quantidade: Permite ao usuário atualizar a quantidade de cada item no carrinho.
Remoção de Itens: Permite ao usuário remover itens do carrinho.
Mensagem de Carrinho Vazio: Exibe uma mensagem quando o carrinho está vazio.
7. **Tela de Favoritos** (FavoritesScreen)
Exibição de Produtos Favoritos: Mostra todos os produtos que o usuário marcou como favoritos.
Remoção de Favoritos: Permite ao usuário remover produtos da lista de favoritos.
Mensagem de Favoritos Vazia: Exibe uma mensagem quando a lista de favoritos está vazia.
8. **Tela de Conta do Usuário** (AccountScreen)
Informações da Conta: Exibe informações da conta do usuário.
Formulário de Login (LoginForm): Permite ao usuário fazer login na sua conta.
9. **Tela de Atendimento ao Cliente** (CustomerServiceScreen)
Informações de Contato: Exibe informações de contato para atendimento ao cliente.
10. **Tela de Resumo do Pedido** (OrderSummaryScreen)
Resumo do Pedido: Exibe um resumo do pedido do usuário, incluindo itens, preços e total.

**Componentes Reutilizáveis**
- *BottomNavigation*: Componente para a navegação inferior do aplicativo.
- *CartItem*: Componente para exibir um item no carrinho de compras.
- *CategoryItem*: Componente para exibir uma categoria de produto.
- *EmptyCartMessage*: Componente para exibir uma mensagem quando o carrinho está vazio.
- *EmptyFavoritesMessage*: Componente para exibir uma mensagem quando a lista de favoritos está vazia.
- *LoginForm*: Componente para o formulário de login.
- *ProductItem*: Componente para exibir um item de produto.
- *SearchBar*: Componente para a barra de pesquisa.

**Contexto**
- *CartContext*: Contexto para gerenciar o estado do carrinho de compras, incluindo funções para adicionar, remover e atualizar itens no carrinho.
- *Serviços*
api.js: Arquivo para configurar chamadas de API (atualmente vazio. No futuro, a aplicação será conectada com o banco de dados através de uma API CRUD, usando o Axios).
- *Estilos*
colors.js: Arquivo para definir cores e estilos (atualmente vazio).
Essas funcionalidades fornecem uma base sólida para o aplicativo InfoShop, permitindo aos usuários navegar, pesquisar, adicionar produtos ao carrinho, gerenciar favoritos e acessar informações da conta e atendimento ao cliente.

# 8. Contribuição

O seu interesse em contribuir para o projeto é muito bem-vindo. Siga as diretrizes abaixo para abrir problemas (issues) ou enviar solicitações de pull (pull requests):

#### Abrindo Problemas (Issues)

1. **Verifique Problemas Existentes**: Antes de abrir um novo problema, verifique se o problema já não foi relatado. Se encontrar um problema semelhante, você pode adicionar um comentário para fornecer informações adicionais.

2. **Descreva Detalhadamente**: Ao abrir um problema, forneça uma descrição clara e detalhada do problema encontrado. Inclua etapas reproduzíveis, mensagens de erro e informações sobre o ambiente em que o problema ocorre (sistema operacional, versão do Node.js, etc.).

3. **Etiquetas (Labels)**: Use etiquetas apropriadas para categorizar o problema. Por exemplo, você pode adicionar etiquetas como "bug" para problemas técnicos, "melhoria" para sugestões de melhorias ou "documentação" para problemas relacionados à documentação.

#### Enviando Solicitações de Pull (Pull Requests)

Se você deseja contribuir com código para o projeto, siga estas etapas ao enviar solicitações de pull (pull requests):

1. **Fork do Repositório**: Faça um fork do repositório para sua própria conta no GitHub.

2. **Clone o Repositório Forked**: Clone o seu fork do repositório para o seu ambiente de desenvolvimento local.

   ```bash
   git clone https://github.com/seu-usuario/seu-fork.git
   ```

3. **Crie uma Branch**: Crie uma branch para a sua contribuição e dê a ela um nome descritivo.

   ```bash
   git checkout -b nome-da-sua-branch
   ```

4. **Faça as Modificações**: Faça as modificações necessárias no código. Certifique-se de seguir as convenções de código e padrões existentes no projeto.

5. **Teste as Modificações**: Certifique-se de testar as suas modificações localmente para garantir que não haja problemas.

6. **Commit e Push**: Commit suas mudanças e envie para o seu repositório forked.

   ```bash
   git add .
   git commit -m "Descrição curta das mudanças"
   git push origin nome-da-sua-branch
   ```

7. **Solicitação de Pull**: No GitHub, vá até o repositório original e clique em "New Pull Request". Selecione a sua branch como a branch de origem e descreva suas mudanças de forma clara e concisa.

8. **Revisão e Discussão**: Outros colaboradores revisarão suas mudanças e podem fornecer feedback ou solicitar alterações. Esteja aberto a discussões construtivas e esteja disposto a fazer as alterações necessárias.

9. **Mesclar (Merge)**: Após a revisão e aprovação, um mantenedor do projeto mesclará suas mudanças na branch principal.

Lembre-se de que é importante seguir as diretrizes de contribuição específicas do projeto, se houver. Este é um processo geral para contribuir com projetos de código aberto, mas cada projeto pode ter suas próprias regras e convenções.

Obrigado por considerar a contribuição para o projeto! Suas contribuições ajudam a melhorar a qualidade do software e beneficiam toda a comunidade de desenvolvedores.

# 9. Licença

 **Licença MIT:**:
   - Permite que qualquer pessoa utilize, modifique e distribua o código, mesmo em projetos comerciais, desde que inclua o aviso de licença no software resultante. Esta é uma licença permissiva.
   Leia o arquivo `LICENCE.MD` para maiores informações.
   
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# 10. Contato

Se você tiver algum feedback, por favor nos deixe saber por meio de jameswebbinformatica@gmail.com

# 11. Agradecimentos

Gostaríamos de expressar nossa sincera gratidão a todas as pessoas que contribuíram e apoiaram este projeto ao longo do tempo. Suas ideias, feedback, e esforços foram inestimáveis para o sucesso deste empreendimento. Queremos fazer menção especial ao professor João, cuja orientação e assistência foram fundamentais para a criação desta aplicação.

Agradecemos a todos os nossos colaboradores, desenvolvedores da comunidade, e a todos aqueles que testaram e deram feedback. Seu comprometimento e entusiasmo foram essenciais para tornar este projeto o que é hoje.
