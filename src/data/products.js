/*
Este arquivo contém dados estáticos sobre os produtos, incluindo informações como nome, preço, 
descrição e referências para imagens. Ele serve como uma fonte de dados local que pode ser usada 
quando a API não está disponível ou como complemento aos dados da API.
*/
export const productsData = [
  {
    id: '1',
    name: 'Headset Gamer HyperX Cloud III Wireless',
    price: 'R$ 999,99',
    discountPrice: 'R$ 699,99',
    installments: 'R$ 823,52 em até 12x',
    image: null, // Removido require de imagem local que não existe
    imageUrl: 'https://www.dropbox.com/scl/fi/6bis8e7628l1mi51wj5da/Headset-Gamer-Hyper-X-Cloud-III-Wireless.jpg?rlkey=mc1xf3ug53zs1kfqsd87jmvit&st=af2e1514&dl=1',
    category: 'Produtos para Gamers',
    description: 'Headset gamer sem fio com som surround 7.1, microfone com cancelamento de ruído e bateria de longa duração.',
    estoque: 15
  },
  {
    id: '2',
    name: 'PC Gamer Pichau Far Cry',
    price: 'R$ 7.066,80',
    discountPrice: 'R$ 5.490,30',
    installments: 'R$ 6.459,18 em até 12x',
    image: null, // Removido require de imagem local que não existe
    imageUrl: 'https://www.dropbox.com/scl/fi/p72bs2py20ruh5mvknxos/pc-completo-pichau-far-cry-0034.jpg?rlkey=cnutw3l54525o9icxpit0cjnp&st=6kird0xr&dl=1',
    category: 'PCs Desktop e Gamer',
    description: 'PC Gamer completo com processador de última geração, placa de vídeo potente e sistema de refrigeração avançado.',
    estoque: 8
  },
  {
    id: '3',
    name: 'Placa de Vídeo RTX 3070',
    price: 'R$ 3.999,99',
    discountPrice: 'R$ 3.199,99',
    installments: 'R$ 3.599,99 em até 12x',
    image: null, // Removido require de imagem local que não existe
    imageUrl: 'https://www.dropbox.com/scl/fi/m2tvo222t3qumcr4uvcbj/Placa-de-V-deo-RTX-3070.jpg?rlkey=hgkvluhezodp7pfbn3jdndgqu&st=v32e85q2&dl=1',
    category: 'Hardware',
    description: 'Placa de vídeo NVIDIA RTX 3070 com 8GB de memória GDDR6, ideal para jogos em 4K e ray tracing.',
    estoque: 12
  },
  {
    id: '4',
    name: 'Monitor Gamer 27" 144Hz',
    price: 'R$ 1.899,99',
    discountPrice: 'R$ 1.599,99',
    installments: 'R$ 1.799,99 em até 12x',
    image: null, // Removido require de imagem local que não existe
    imageUrl: 'https://via.placeholder.com/500x500?text=Monitor+Gamer',
    category: 'Monitores',
    description: 'Monitor gamer de 27 polegadas com taxa de atualização de 144Hz, tempo de resposta de 1ms e tecnologia anti-tearing.',
    estoque: 20
  },
  {
    id: '5',
    name: 'Teclado Mecânico RGB',
    price: 'R$ 499,99',
    discountPrice: 'R$ 399,99',
    installments: 'R$ 449,99 em até 12x',
    image: null, // Removido require de imagem local que não existe
    imageUrl: 'https://via.placeholder.com/500x500?text=Teclado+Mecanico',
    category: 'Periféricos',
    description: 'Teclado mecânico com switches Cherry MX, iluminação RGB personalizável e construção em alumínio.',
    estoque: 25
  }
];

// Função para obter todos os produtos
export const getAllProducts = () => {
  return productsData;
};

// Função para obter um produto pelo ID
export const getProductById = (id) => {
  return productsData.find(product => product.id === id);
};

// Função para obter produtos por categoria
export const getProductsByCategory = (category) => {
  return productsData.filter(product => product.category === category);
};