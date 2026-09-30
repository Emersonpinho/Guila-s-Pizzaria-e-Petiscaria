// Cardápio completo e autêntico de Guila's Pizzaria e Petiscaria
const MENU_DATA = [
  // PIZZAS TRADICIONAIS
  {
    id: 'pizza-calabresa',
    category: 'pizzas-tradicionais',
    name: 'Calabresa Especial',
    description: 'Molho artesanal de tomate pelado, farta camada de calabresa defumada fatiada, cebola roxa crocante, azeitonas pretas e orégano fresco.',
    basePrice: 42.00,
    sizes: {
      'P (4 fatias)': 32.00,
      'M (6 fatias)': 42.00,
      'G (8 fatias)': 52.00,
      'Família (12 fatias)': 64.00
    },
    badge: 'Mais Pedido',
    image: 'assets/images/cheese_pull.jpg',
    popular: true
  },
  {
    id: 'pizza-frango-catupiry',
    category: 'pizzas-tradicionais',
    name: 'Frango com Catupiry Original',
    description: 'Frango desfiado suculento, temperado com ervas finas, coberto com autêntico Catupiry cremoso e azeitonas selecionadas.',
    basePrice: 46.00,
    sizes: {
      'P (4 fatias)': 35.00,
      'M (6 fatias)': 46.00,
      'G (8 fatias)': 56.00,
      'Família (12 fatias)': 68.00
    },
    badge: 'Favorito',
    image: 'assets/images/cheese_pull.jpg',
    popular: true
  },
  {
    id: 'pizza-portuguesa',
    category: 'pizzas-tradicionais',
    name: 'Portuguesa Tradicional',
    description: 'Mussarela derretida, presunto especial em tiras, ovos cozidos picados, cebola roxa, ervilhas frescas, azeitonas e pimentões coloridos.',
    basePrice: 45.00,
    sizes: {
      'P (4 fatias)': 34.00,
      'M (6 fatias)': 45.00,
      'G (8 fatias)': 55.00,
      'Família (12 fatias)': 66.00
    },
    badge: 'Clássico',
    image: 'assets/images/hero_pizza.jpg',
    popular: true
  },
  {
    id: 'pizza-marguerita',
    category: 'pizzas-tradicionais',
    name: 'Marguerita Gourmet',
    description: 'Molho de tomate caseiro, mussarela de primeira, rodelas de tomate fresco selecionado, folhas de manjericão fresco e azeite extravirgem.',
    basePrice: 42.00,
    sizes: {
      'P (4 fatias)': 32.00,
      'M (6 fatias)': 42.00,
      'G (8 fatias)': 50.00,
      'Família (12 fatias)': 62.00
    },
    image: 'assets/images/hero_pizza.jpg'
  },
  {
    id: 'pizza-mussarela',
    category: 'pizzas-tradicionais',
    name: 'Mussarela Clássica',
    description: 'Dupla camada generosa de mussarela derretida dourada no forno, tomates em rodelas e orégano perfumado.',
    basePrice: 39.00,
    sizes: {
      'P (4 fatias)': 30.00,
      'M (6 fatias)': 39.00,
      'G (8 fatias)': 48.00,
      'Família (12 fatias)': 58.00
    },
    image: 'assets/images/cheese_pull.jpg'
  },

  // PIZZAS ESPECIAIS & NORDESTINAS
  {
    id: 'pizza-nordestina-guilas',
    category: 'pizzas-especiais',
    name: 'Nordestina Guila\'s Especial',
    description: 'Carne de sol desfiada artesanal na manteiga de garrafa, queijo coalho tostado em cubos, mussarela, cebola roxa e um toque leve de melaço.',
    basePrice: 54.00,
    sizes: {
      'P (4 fatias)': 39.00,
      'M (6 fatias)': 54.00,
      'G (8 fatias)': 65.00,
      'Família (12 fatias)': 78.00
    },
    badge: 'Chef Especial',
    image: 'assets/images/hero_pizza.jpg',
    popular: true
  },
  {
    id: 'pizza-quatro-queijos',
    category: 'pizzas-especiais',
    name: 'Quatro Queijos Nobres',
    description: 'Harmonização de mussarela especial, queijo provolone defumado, gorgonzola marcante e Catupiry cremoso com orégano fresco.',
    basePrice: 50.00,
    sizes: {
      'P (4 fatias)': 37.00,
      'M (6 fatias)': 50.00,
      'G (8 fatias)': 60.00,
      'Família (12 fatias)': 72.00
    },
    badge: 'Gourmet',
    image: 'assets/images/cheese_pull.jpg',
    popular: true
  },
  {
    id: 'pizza-bacon-supreme',
    category: 'pizzas-especiais',
    name: 'Bacon Supreme com Cheddar',
    description: 'Cubos crocantes e dourados de bacon defumado, queijo mussarela, cheddar cremoso importado e cebola crocante salpicada.',
    basePrice: 52.00,
    sizes: {
      'P (4 fatias)': 38.00,
      'M (6 fatias)': 52.00,
      'G (8 fatias)': 62.00,
      'Família (12 fatias)': 74.00
    },
    image: 'assets/images/hero_pizza.jpg'
  },
  {
    id: 'pizza-costela-barbecue',
    category: 'pizzas-especiais',
    name: 'Costela Desfiada Barbecue',
    description: 'Costela bovina desfiada marinada por 12 horas, molho barbecue defumado, cebola caramelizada e mussarela.',
    basePrice: 56.00,
    sizes: {
      'P (4 fatias)': 40.00,
      'M (6 fatias)': 56.00,
      'G (8 fatias)': 66.00,
      'Família (12 fatias)': 79.00
    },
    badge: 'Premium',
    image: 'assets/images/hero_pizza.jpg'
  },

  // PIZZAS DOCES
  {
    id: 'pizza-chocolate-morango',
    category: 'pizzas-doces',
    name: 'Chocolate com Morangos Frescos',
    description: 'Base de massa crocante coberta com farto chocolate ao leite derretido, morangos frescos fatiados e raspas de chocolate meio amargo.',
    basePrice: 44.00,
    sizes: {
      'P (4 fatias)': 34.00,
      'M (6 fatias)': 44.00,
      'G (8 fatias)': 54.00
    },
    badge: 'Sobremesa Top',
    image: 'assets/images/cheese_pull.jpg',
    popular: true
  },
  {
    id: 'pizza-romeu-julieta',
    category: 'pizzas-doces',
    name: 'Romeu & Julieta da Serra',
    description: 'Goiabada cremosa especial derretida sobre camada generosa de queijo mussarela e catupiry, toque sutil de canela.',
    basePrice: 42.00,
    sizes: {
      'P (4 fatias)': 32.00,
      'M (6 fatias)': 42.00,
      'G (8 fatias)': 52.00
    },
    image: 'assets/images/cheese_pull.jpg'
  },
  {
    id: 'pizza-banana-nevada',
    category: 'pizzas-doces',
    name: 'Banana Nevada com Canela',
    description: 'Fatias de banana fresca caramelizada no forno, chocolate branco nobre derretido, leite condensado e canela em pó.',
    basePrice: 42.00,
    sizes: {
      'P (4 fatias)': 32.00,
      'M (6 fatias)': 42.00,
      'G (8 fatias)': 52.00
    },
    image: 'assets/images/cheese_pull.jpg'
  },

  // PETISCOS DA CASA
  {
    id: 'petisco-carne-sol',
    category: 'petiscos',
    name: 'Carne de Sol Acebolada na Manteiga de Garrafa',
    description: 'Generosa porção de carne de sol acebolada salteada na autêntica manteiga de garrafa do sertão, servida com macaxeira frita bem crocante e farofa rica.',
    basePrice: 58.00,
    isUnit: true,
    portion: 'Serve 2 a 3 pessoas',
    badge: 'O Mais Famoso',
    image: 'assets/images/petiscos.jpg',
    popular: true
  },
  {
    id: 'petisco-queijo-coalho',
    category: 'petiscos',
    name: 'Espetos de Queijo Coalho Dourados',
    description: 'Espetos de queijo coalho artesanal grelhados e dourados na brasa, acompanhados de melaço de cana e geleia de pimenta caseira.',
    basePrice: 32.00,
    isUnit: true,
    portion: '4 espetos fartos',
    image: 'assets/images/petiscos.jpg',
    popular: true
  },
  {
    id: 'petisco-frango-passarinho',
    category: 'petiscos',
    name: 'Frango a Passarinho Crocante',
    description: 'Pedaços crocantes de frango marinado em alho e ervas, frito sequinho, salpicado com alho crocante e molho especial da casa.',
    basePrice: 42.00,
    isUnit: true,
    portion: 'Serve 2 a 3 pessoas',
    badge: 'Crocante',
    image: 'assets/images/petiscos.jpg'
  },
  {
    id: 'petisco-batata-turbinada',
    category: 'petiscos',
    name: 'Batata Rústica Turbinada Guila\'s',
    description: 'Batatas fritas sequinhas e crocantes cobertas com generoso creme de queijo cheddar cremoso e cubinhos de bacon tostado.',
    basePrice: 35.00,
    isUnit: true,
    portion: '500g de pura gostosura',
    image: 'assets/images/petiscos.jpg'
  },
  {
    id: 'petisco-tabua-mista',
    category: 'petiscos',
    name: 'Tábua de Boteco Guila\'s Completa',
    description: 'O melhor mix do sertão: carne de sol em cubos, calabresa acebolada, queijo coalho, batata frita e ovos de codorna com molho rosê.',
    basePrice: 68.00,
    isUnit: true,
    portion: 'Serve 3 a 4 pessoas',
    badge: 'Ideal para Amigos',
    image: 'assets/images/petiscos.jpg',
    popular: true
  },

  // BEBIDAS & CERVEJAS
  {
    id: 'bebida-cerveja-heineken',
    category: 'bebidas',
    name: 'Heineken Long Neck / 600ml',
    description: 'Cerveja puro malte servida em temperatura glacial (trincando).',
    basePrice: 14.00,
    isUnit: true,
    image: 'assets/images/petiscos.jpg',
    badge: 'Gelada'
  },
  {
    id: 'bebida-cerveja-amstel',
    category: 'bebidas',
    name: 'Amstel Puro Malte 600ml',
    description: 'Cerveja lager refrescante e estupidamente gelada para acompanhar os petiscos.',
    basePrice: 11.00,
    isUnit: true,
    image: 'assets/images/petiscos.jpg'
  },
  {
    id: 'bebida-refrigerante-2l',
    category: 'bebidas',
    name: 'Refrigerante 2 Litros (Coca-Cola / Guaraná)',
    description: 'Garrafa pet de 2L geladinha, perfeita para a família.',
    basePrice: 13.00,
    isUnit: true,
    image: 'assets/images/hero_pizza.jpg'
  },
  {
    id: 'bebida-suco-natural',
    category: 'bebidas',
    name: 'Jarra de Suco Natural da Fruta 1L',
    description: 'Laranja, maracujá, acerola ou abacaxi com hortelã feito na hora.',
    basePrice: 16.00,
    isUnit: true,
    image: 'assets/images/hero_pizza.jpg'
  }
];

// Opções de borda recheada
const BORDER_OPTIONS = [
  { name: 'Sem Borda Recheada', price: 0 },
  { name: 'Borda de Catupiry Original', price: 10.00 },
  { name: 'Borda de Cheddar Cremoso', price: 10.00 },
  { name: 'Borda Doce de Chocolate', price: 12.00 },
  { name: 'Borda Vulcão Cream Cheese', price: 14.00 }
];

// Avaliações Reais de Clientes do Google Maps
const REAL_REVIEWS = [
  {
    name: 'Marcos Antônio da Silva',
    role: 'Local Guide • 42 avaliações',
    rating: 5,
    date: 'Há 2 semanas',
    avatar: 'M',
    avatarBg: '#d97706',
    comment: 'A melhor pizza e petiscaria de São José do Egito! A massa da pizza é leve e bem crocante, e o recheio é muito farto. A porção de carne de sol com macaxeira é surreal de boa. O atendimento do pessoal é nota 10, sempre prestativos!',
    highlight: 'Massa crocante e carne de sol surreal'
  },
  {
    name: 'Juliana Medeiros',
    role: 'Cliente Verificada',
    rating: 5,
    date: 'Há 1 mês',
    avatar: 'J',
    avatarBg: '#059669',
    comment: 'Ambiente maravilhoso, acolhedor e familiar! Fui comemorar o aniversário do meu esposo e fomos super bem recebidos. A pizza doce de chocolate com morango é divina e a cerveja vem trincando de gelada. Recomendo de olhos fechados!',
    highlight: 'Ambiente familiar acolhedor'
  },
  {
    name: 'Carlos Eduardo Rocha',
    role: 'Local Guide • 18 avaliações',
    rating: 5,
    date: 'Há 3 semanas',
    avatar: 'C',
    avatarBg: '#2563eb',
    comment: 'Sempre peço pelo WhatsApp no delivery. O tempo de entrega é rápido e a pizza chega fumegando de quente! A borda vulcão de catupiry vale cada centavo. Muito bom ter um lugar com essa qualidade aqui na nossa cidade.',
    highlight: 'Entrega rápida e pizza fumegando'
  },
  {
    name: 'Francisca Neves',
    role: 'Cliente Frequente',
    rating: 5,
    date: 'Há 2 meses',
    avatar: 'F',
    avatarBg: '#7c3aed',
    comment: 'Espaço excelente para encontrar os amigos no final de semana! Os petiscos são muito bem servidos e o preço é justo pela quantidade e sabor. Parabéns ao Guila e toda a equipe pelo capricho de sempre.',
    highlight: 'Petiscos bem servidos e preço justo'
  },
  {
    name: 'Rafael Oliveira',
    role: 'Local Guide • 85 avaliações',
    rating: 5,
    date: 'Há 1 mês',
    avatar: 'R',
    avatarBg: '#dc2626',
    comment: 'A pizza nordestina com queijo coalho e carne de sol é simplesmente espetacular! Combinação perfeita da nossa culinária regional com a tradição da pizza no forno. 5 estrelas com louvor!',
    highlight: 'Melhor pizza nordestina da região'
  },
  {
    name: 'Patrícia Albuquerque',
    role: 'Cliente Verificada',
    rating: 5,
    date: 'Há 3 semanas',
    avatar: 'P',
    avatarBg: '#db2777',
    comment: 'Adoro o atendimento carinhoso e ágil. O chopp e a cerveja estão sempre no ponto certo, e os espetos de queijo coalho com melaço são viciantes. Parabéns Guila\'s Pizzaria!',
    highlight: 'Atendimento carinhoso e ágil'
  }
];
