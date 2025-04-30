# Info Shop - E-commerce Mobile App

![Info Shop Logo](assets/logo.png)

Um aplicativo de e-commerce moderno e intuitivo construído com React Native e Expo, focado em produtos de tecnologia e informática.

## 🚀 Funcionalidades

- 📱 Interface moderna e responsiva
- 🛍️ Catálogo de produtos organizado por categorias
- ❤️ Sistema de favoritos
- 🛒 Carrinho de compras
- 👤 Perfil de usuário
- 🔍 Busca avançada de produtos
- ⭐ Sistema de avaliações
- 📦 Acompanhamento de pedidos
- 💬 Atendimento ao cliente

## 🛠️ Tecnologias

- React Native
- Expo
- React Navigation
- AsyncStorage
- Axios
- Google Sign-In
- React Native Vector Icons

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS, apenas macOS)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/info-shop.git
cd info-shop
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o projeto:
```bash
npm start
# ou
yarn start
```

4. Use o Expo Go no seu dispositivo móvel ou emulador para testar o aplicativo.

## 📱 Uso

1. Abra o aplicativo
2. Navegue pelas categorias de produtos
3. Adicione produtos aos favoritos
4. Adicione produtos ao carrinho
5. Faça login para finalizar a compra
6. Acompanhe seus pedidos

## 📁 Estrutura do Projeto

```
info-shop/
├── src/
│   ├── api/          # Configurações e chamadas de API
│   ├── assets/       # Recursos estáticos
│   ├── components/   # Componentes reutilizáveis
│   ├── context/      # Contextos do React
│   ├── data/         # Dados estáticos
│   ├── navigation/   # Configuração de rotas
│   ├── screens/      # Telas do aplicativo
│   ├── services/     # Serviços e lógica de negócios
│   ├── styles/       # Estilos e temas
│   └── utils/        # Funções utilitárias
├── assets/           # Recursos do Expo
├── .gitignore
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── README.md
```

## 🎨 Componentes Principais

### Button
Componente de botão reutilizável com múltiplas variantes e estados.
```jsx
<Button
  title="Comprar"
  variant="primary"
  size="medium"
  onPress={() => {}}
/>
```

### ProductCard
Card de produto com imagem, título, preço e avaliação.
```jsx
<ProductCard
  image="url-da-imagem"
  title="Nome do Produto"
  price={99.99}
  rating={4.5}
  onPress={() => {}}
  onFavoritePress={() => {}}
/>
```

## 🔄 Fluxo de Desenvolvimento

1. Crie uma branch para sua feature:
```bash
git checkout -b feature/nova-feature
```

2. Faça commit das suas alterações:
```bash
git commit -m 'Adiciona nova feature'
```

3. Faça push para a branch:
```bash
git push origin feature/nova-feature
```

4. Abra um Pull Request

## 📝 Convenções de Código

- Use ESLint e Prettier para formatação
- Siga o padrão de commits convencionais
- Mantenha os componentes pequenos e reutilizáveis
- Documente funções e componentes complexos
- Use TypeScript para novos arquivos

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, você pode:
- Entrar no nosso [Discord](https://discord.gg/2HFK3RYW) e falar com Jamerson Nascimento
- Abrir uma issue no GitHub
- Enviar um email para jameswebbinformatica@gmail.com

## 🙏 Agradecimentos

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Material Icons](https://material.io/resources/icons/)

---

Desenvolvido com ❤️ por [@JamersonNAscimento]
