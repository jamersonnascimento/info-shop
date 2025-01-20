Documentação será atualizada e implementada em breve!
# info-shop
Um aplicativo mobile desenvolvido em React-Native. Ele é um app de loja de informática. Este é meu protótipo para criação de um software completo, com frontend e backend
=======
Dependências e Configuração do Ambiente
Pré-requisitos
Antes de começar, certifique-se de ter o Node.js e o npm (Node Package Manager) instalados em seu sistema. Você pode baixá-los em nodejs.org.

Clonando o Repositório
Primeiro, clone o repositório do seu projeto para o novo PC:
git clone https://github.com/jamersonnascimento/info-shop.git
cd info-shop

Dependências Utilizadas
Aqui está a lista de dependências que seu projeto utiliza, conforme especificado no package.json:
{
  "dependencies": {
    "@expo/metro-runtime": "~4.0.0",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@react-native-community/masked-view": "^0.1.11",
    "@react-navigation/bottom-tabs": "^7.2.0",
    "@react-navigation/native": "^7.0.14",
    "@react-navigation/native-stack": "^7.2.0",
    "@react-navigation/stack": "^7.1.1",
    "expo": "~52.0.23",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.5",
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

Instalando Dependências
A seguir, instale as dependências do projeto. No diretório do seu projeto, execute:
npm install

Instalando Dependências Individuais:
npm install @expo/metro-runtime@~4.0.0
npm install @react-native-async-storage/async-storage@^2.1.0
npm install @react-native-community/masked-view@^0.1.11
npm install @react-navigation/bottom-tabs@^7.2.0
npm install @react-navigation/native@^7.0.14
npm install @react-navigation/native-stack@^7.2.0
npm install @react-navigation/stack@^7.1.1
npm install expo@~52.0.23
npm install expo-status-bar@~2.0.0
npm install react@18.3.1
npm install react-dom@18.3.1
npm install react-native@0.76.5
npm install react-native-gesture-handler@~2.20.2
npm install react-native-reanimated@^3.16.6
npm install react-native-safe-area-context@^4.12.0
npm install react-native-screens@^4.4.0
npm install react-native-vector-icons@^10.2.0
npm install react-native-web@~0.19.13

Instalando Dependências de Desenvolvimento:
npm install --save-dev @babel/core@^7.26.0
npm install --save-dev @babel/plugin-transform-private-methods@^7.25.9
npm install --save-dev babel-preset-expo@^12.0.4
npm install --save-dev metro-react-native-babel-preset@^0.77.0

Comando Único para Instalar Todas as Dependências
Se você preferir, também pode copiar as dependências diretamente do package.json e executar o comando de instalação de uma vez:
npm install

Configuração do AsyncStorage
O projeto utiliza AsyncStorage para armazenamento local de dados, certifique-se de seguir as instruções de instalação e configuração:
npm install @react-native-async-storage/async-storage
Importe e utilize o AsyncStorage no seu projeto conforme necessário, como mostrado no seu exemplo de LoginForm.

Estrutura do Projeto
Aqui está um resumo da estrutura de arquivos do seu projeto:
src/
|-- components/
|   |-- BottomNavigation.js
|   |-- CategoryItem.js
|   |-- EmptyCartMessage.js
|   |-- EmptyFavoritesMessage.js
|   |-- LoginForm.js
|   |-- ProductItem.js
|
|-- context/
|   |-- CartContext.js
|
|-- navigation/
|   |-- AppNavigator.js
|
|-- screens/
|   |-- AccountScreen.js
|   |-- CartScreen.js
|   |-- CategoriesScreen.js
|   |-- CustomerServiceScreen.js
|   |-- FavoritesScreen.js
|   |-- HardwareProductsScreen.js
|   |-- HomeScreen.js
|   |-- PCsDesktopGamerScreen.js
|   |-- PeripheralsAccessoriesScreen.js
|
|-- App.js
|-- index.js
|-- babel.config.js
|-- app.json
|-- .gitignore



>>>>>>> 17ac5e7 (Create README.md)
