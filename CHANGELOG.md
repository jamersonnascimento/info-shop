# Changelog

Todos as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2024-03-19

### Adicionado
- Sistema de navegação em abas (Tab Navigator)
  - Ícones intuitivos para cada seção principal
  - Navegação fluida entre telas
  - Organização lógica das rotas

### Melhorado
- **Sistema de Tema**
  - Implementação de tema centralizado em `src/styles/theme.js`
  - Paleta de cores consistente
  - Sistema de espaçamento padronizado
  - Tipografia unificada
  - Sistema de sombras para elevação

### Novos Componentes
- **Button Component** (`src/components/Button.js`)
  - Múltiplas variantes (primary, secondary, outline)
  - Diferentes tamanhos (small, medium, large)
  - Estado de loading
  - Estado disabled
  - Customização via props
  - Feedback visual para interações

- **ProductCard Component** (`src/components/ProductCard.js`)
  - Layout moderno e responsivo
  - Suporte a imagens de produtos
  - Sistema de favoritos integrado
  - Exibição de preço formatado
  - Sistema de avaliação com estrelas
  - Efeitos visuais e sombras

### Mudanças Técnicas
- Reorganização da estrutura de navegação
- Implementação de componentes reutilizáveis
- Melhorias na consistência visual
- Otimização de performance

### Próximas Atualizações Planejadas
- [ ] Implementação de gerenciamento de estado (Redux/Context API)
- [ ] Sistema de testes unitários e de integração
- [ ] Cache de imagens
- [ ] Suporte a temas claro/escuro
- [ ] Internacionalização (i18n)
- [ ] Animações avançadas
- [ ] Sistema de feedback de erros
- [ ] Suporte a gestos

### Notas
- Todas as mudanças são compatíveis com versões anteriores
- Melhorias focadas em UX/UI e manutenibilidade do código
- Componentes seguem as melhores práticas de React Native

### Dependências Atualizadas
- @react-navigation/bottom-tabs
- @react-navigation/native
- @react-navigation/stack
- react-native-vector-icons

## [1.0.0] - 2024-03-18

### Adicionado
- Estrutura inicial do projeto
- Configuração básica do React Native com Expo
- Navegação básica entre telas
- Telas principais:
  - Home
  - Categories
  - Favorites
  - Cart
  - Account
  - Product Detail
  - Order Summary
  - Customer Service

### Dependências Iniciais
- React Native
- Expo
- React Navigation
- AsyncStorage
- Axios
- Google Sign-In

---

## Tipos de Alterações

- `Adicionado` para novas funcionalidades.
- `Alterado` para mudanças em funcionalidades existentes.
- `Depreciado` para funcionalidades que serão removidas em breve.
- `Removido` para funcionalidades removidas.
- `Corrigido` para correção de bugs.
- `Segurança` para correções de vulnerabilidades.
- `Melhorado` para melhorias em funcionalidades existentes.

## Convenções de Versionamento

Este projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/):

- MAJOR: quando há mudanças incompatíveis na API
- MINOR: quando há novas funcionalidades mantendo compatibilidade
- PATCH: quando há correções de bugs mantendo compatibilidade 