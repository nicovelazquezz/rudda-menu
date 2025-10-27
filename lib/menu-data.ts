export interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  options?: string[]
  category: string
}

export interface MenuCategory {
  id: string
  name: string
  itemCount: number
  image: string
}

export const menuCategories: MenuCategory[] = [
  {
    id: "huevos-king",
    name: "Huevos King",
    itemCount: 6,
    image: "/eggs-breakfast.jpg",
  },
  {
    id: "power-bowls",
    name: "Power Bowls",
    itemCount: 10,
    image: "/yogurt-bowl-berries.jpg",
  },
  {
    id: "pancakes-waffles",
    name: "Pancakes & Waffles",
    itemCount: 4,
    image: "/pancakes-stack.jpg",
  },
  {
    id: "ensaladas",
    name: "Ensaladas",
    itemCount: 3,
    image: "/fresh-salad-bowl.jpg",
  },
  {
    id: "tartas",
    name: "Tartas Artesanales",
    itemCount: 12,
    image: "/savory-tart.jpg",
  },
  {
    id: "wraps",
    name: "Wraps",
    itemCount: 3,
    image: "/wrap-sandwich.jpg",
  },
  {
    id: "rituales",
    name: "Rituales Rudda",
    itemCount: 7,
    image: "/breakfast-toast-coffee.jpg",
  },
  {
    id: "smoothies",
    name: "Smoothies",
    itemCount: 6,
    image: "/fruit-smoothie.png",
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    itemCount: 5,
    image: "/gourmet-sandwich.png",
  },
  {
    id: "tostones",
    name: "Tostones",
    itemCount: 4,
    image: "/avocado-toast.png",
  },
  {
    id: "dulces",
    name: "Dulces & Salados",
    itemCount: 3,
    image: "/golden-croissant.png",
  },
  {
    id: "coffee",
    name: "Coffee & Drinks",
    itemCount: 20,
    image: "/specialty-coffee-latte-art.jpg",
  },
  {
    id: "tea",
    name: "Tea Selection",
    itemCount: 5,
    image: "/loose-leaf-tea.jpg",
  },
]

const menuItems: MenuItem[] = [
  // HUEVOS KING
  {
    id: "hk-1",
    name: "Hongos & Verdes",
    description:
      "Huevos en su punto justo —clara suave y yema cremosa— o revueltos a elección. Sobre salteado de espinacas y champiñones, con oliva y parmesano. Acompañados con pan de masa madre.",
    price: "9500",
    category: "huevos-king",
  },
  {
    id: "hk-2",
    name: "Champi & Bacon",
    description:
      "Huevos en su punto justo o revueltos. Panceta ahumada crocante, champiñones salteados. Acompañados con pan de masa madre.",
    price: "10200",
    category: "huevos-king",
  },
  {
    id: "hk-3",
    name: "Green King",
    description:
      "Huevos en su punto justo o revueltos. Burrata, tomates cherry asados y aceite de albahaca. Acompañados con pan de masa madre.",
    price: "11500",
    category: "huevos-king",
  },
  {
    id: "hk-4",
    name: "Ricotta & Morrones",
    description:
      "Huevos en su punto justo o revueltos. Ricota cremosa, morrones asados y toque de romero. Acompañados con pan de masa madre.",
    price: "9800",
    category: "huevos-king",
  },
  {
    id: "hk-5",
    name: "Salmón Ahumado",
    description:
      "Huevos en su punto justo o revueltos. Salmón, cream cheese, alcaparras y eneldo. Acompañados con pan de masa madre.",
    price: "12500",
    category: "huevos-king",
  },
  {
    id: "hk-6",
    name: "Protein King",
    description:
      "Huevos en su punto justo o revueltos. Vegetales verdes (espinaca, brócoli, zucchini), tofu dorado, soja texturizada y quinoa. Acompañados con pan de masa madre.",
    price: "10800",
    category: "huevos-king",
  },

  // POWER BOWLS
  {
    id: "pb-1",
    name: "Yogur Natural",
    description: "Yogur natural con frutos rojos frescos y frutos secos. Podés sumar un scoop de proteína en polvo.",
    price: "7200",
    category: "power-bowls",
  },
  {
    id: "pb-2",
    name: "Greek Bowl",
    description: "Yogur griego, miel, frutas de estación y semillas. Podés sumar un scoop de proteína en polvo.",
    price: "7800",
    category: "power-bowls",
  },
  {
    id: "pb-3",
    name: "Protein Bowl",
    description: "Yogurt natural con scoop de proteína en polvo, mantequilla de maní, arándanos y chía.",
    price: "8500",
    category: "power-bowls",
  },
  {
    id: "pb-4",
    name: "Chía Pudding",
    description: "Avena y banana, con yogur de cacao y almendras. Podés sumar un scoop de proteína en polvo.",
    price: "7500",
    category: "power-bowls",
  },
  {
    id: "pb-5",
    name: "Avena Tropical",
    description:
      "Avena, leche de coco, banana, almendras y coco en escamas. Podés sumar un scoop de proteína en polvo.",
    price: "7800",
    category: "power-bowls",
  },
  {
    id: "pb-6",
    name: "Granola",
    description: "Yogur natural, frutas de estación y granola casera. Podés sumar un scoop de proteína en polvo.",
    price: "7200",
    category: "power-bowls",
  },
  {
    id: "pb-7",
    name: "Açaí",
    description: "Pulpa de açaí, mango, granola y semillas. Podés sumar un scoop de proteína en polvo.",
    price: "9200",
    category: "power-bowls",
  },
  {
    id: "pb-8",
    name: "Peanut",
    description:
      "Suave mezcla de crema de maní, yogur griego natural, avena, leche vegetal y cacao amargo. Con banana. Podés sumar un scoop de proteína en polvo.",
    price: "8200",
    category: "power-bowls",
  },
  {
    id: "pb-9",
    name: "Energy",
    description: "Avena, banana, soja texturizada, semillas y frutos secos. Podés sumar un scoop de proteína en polvo.",
    price: "8500",
    category: "power-bowls",
  },
  {
    id: "pb-10",
    name: "Matcha",
    description:
      "Yogur natural, matcha, arándanos, kiwi, frutillas y frutos secos. Podés sumar un scoop de proteína en polvo.",
    price: "8800",
    category: "power-bowls",
  },

  // PANCAKES & WAFFLES
  {
    id: "pw-1",
    name: "Almendra & Banana",
    description:
      "3 unidades. Pancakes de harina de almendras, avena o tradicional / Waffles tradicionales. Con yogur natural, banana y almendras. Podés sumar un scoop de proteína en polvo.",
    price: "8500",
    category: "pancakes-waffles",
  },
  {
    id: "pw-2",
    name: "Cacao & Avena",
    description:
      "3 unidades. Pancakes de harina de almendras, avena o tradicional / Waffles tradicionales. Con banana caramelizada, cream cheese de cacao y miel. Podés sumar un scoop de proteína en polvo.",
    price: "9200",
    category: "pancakes-waffles",
  },
  {
    id: "pw-3",
    name: "Frutales",
    description:
      "3 unidades. Pancakes de harina de almendras, avena o tradicional / Waffles tradicionales. Con cream cheese y frutas frescas. Podés sumar un scoop de proteína en polvo.",
    price: "8800",
    category: "pancakes-waffles",
  },
  {
    id: "pw-4",
    name: "Protein",
    description:
      "3 unidades. Suave mezcla de avena, banana y proteína en polvo. Con topping de frutos secos y mantequilla de maní.",
    price: "9500",
    category: "pancakes-waffles",
  },

  // ENSALADAS
  {
    id: "en-1",
    name: "Completa de Pollo",
    description:
      "Mix de verdes, quinoa, arroz yamaní, huevo mollet, cherry, pollo asado, queso azul, palta y vinagreta de limón. Podés sumar proteínas: cous cous, lentejas, soja texturizada, pollo o tofu.",
    price: "11500",
    category: "ensaladas",
  },
  {
    id: "en-2",
    name: "Verduras Asadas",
    description:
      "Mix de verdes, huevo mollet, brócoli, cabutia, palta, cebolla morada encurtida y vinagreta de limón. Podés sumar proteínas: cous cous, lentejas, soja texturizada, pollo o tofu.",
    price: "10200",
    category: "ensaladas",
  },
  {
    id: "en-3",
    name: "Salmón",
    description:
      "Mix de verdes, tomates cherry, salmón, arroz especiado, cream cheese y vinagreta de limón. Podés sumar proteínas: cous cous, lentejas, soja texturizada, pollo o tofu.",
    price: "13500",
    category: "ensaladas",
  },

  // TARTAS ARTESANALES
  {
    id: "ta-1",
    name: "Calabaza, Cebolla y Curry",
    description: "Tarta artesanal clásica o integral.",
    price: "6500",
    category: "tartas",
  },
  {
    id: "ta-2",
    name: "Acelga",
    description: "Tarta artesanal clásica o integral.",
    price: "6200",
    category: "tartas",
  },
  {
    id: "ta-3",
    name: "Verduras Asadas",
    description: "Tarta artesanal clásica o integral.",
    price: "6800",
    category: "tartas",
  },
  {
    id: "ta-4",
    name: "Caprese",
    description: "Tarta artesanal clásica o integral.",
    price: "7200",
    category: "tartas",
  },
  {
    id: "ta-5",
    name: "Humita",
    description: "Tarta artesanal clásica o integral.",
    price: "6800",
    category: "tartas",
  },
  {
    id: "ta-6",
    name: "Cebolla Caramelizada y Queso",
    description: "Tarta artesanal clásica o integral.",
    price: "6500",
    category: "tartas",
  },
  {
    id: "ta-7",
    name: "Jamón y Queso",
    description: "Tarta artesanal clásica.",
    price: "6200",
    category: "tartas",
  },

  // WRAPS
  {
    id: "wr-1",
    name: "Veggie",
    description:
      "Tortilla de trigo, brócoli, espinaca, zanahoria, hummus, palta y semillas de girasol. Acompañado con papas gajo al horno o ensalada.",
    price: "9500",
    category: "wraps",
  },
  {
    id: "wr-2",
    name: "Thai de Pollo",
    description:
      "Tortilla de trigo, pollo salteado con salsa de maní, repollo morado, zanahoria, brotes y cilantro. Acompañado con papas gajo al horno o ensalada.",
    price: "10800",
    category: "wraps",
  },
  {
    id: "wr-3",
    name: "Proteico",
    description:
      "Tortilla de trigo, atún natural o tofu grillado, mix de verdes, huevo, quinoa, palta y aderezo de yogur. Acompañado con papas gajo al horno o ensalada.",
    price: "10500",
    category: "wraps",
  },

  // RITUALES RUDDA
  {
    id: "rr-1",
    name: "Clásico",
    description:
      "Dos tostadas de pan de masa madre con dos dips a elección: mermelada, dulce de leche, queso crema, manteca o mantequilla de maní. Incluye infusión clásica y jugo de naranja.",
    price: "6500",
    category: "rituales",
  },
  {
    id: "rr-2",
    name: "Avocado Toast",
    description: "Pan de masa madre, puré de palta y huevo revuelto. Incluye infusión clásica y jugo de naranja.",
    price: "8500",
    category: "rituales",
  },
  {
    id: "rr-3",
    name: "Petit Avocado",
    description:
      "Tostada de masa madre con palta, tomates cherry, huevo mollet y semillas. Incluye infusión clásica y jugo de naranja.",
    price: "9200",
    category: "rituales",
  },
  {
    id: "rr-4",
    name: "Omelette",
    description: "Omelette con ricotta, palta y cherry. Incluye infusión clásica y jugo de naranja.",
    price: "8800",
    category: "rituales",
  },
  {
    id: "rr-5",
    name: "Power Brunch",
    description: "Dos huevos, panceta, cherry, hongos, pan de masa madre. Incluye infusión clásica y jugo de naranja.",
    price: "11500",
    category: "rituales",
  },
  {
    id: "rr-6",
    name: "Mini Brunch",
    description:
      "Dos tostadas, huevo, palta, jamón natural, yogur natural y frutas. Incluye infusión clásica y jugo de naranja.",
    price: "10800",
    category: "rituales",
  },
  {
    id: "rr-7",
    name: "Pan de Garaje",
    description: "Medialuna o croissant. Incluye infusión clásica y jugo de naranja.",
    price: "5500",
    category: "rituales",
  },

  // SMOOTHIES
  {
    id: "sm-1",
    name: "Energizante",
    description: "Mango, durazno, frutilla y zanahoria. Podés sumar un scoop extra de proteína en polvo.",
    price: "6500",
    category: "smoothies",
  },
  {
    id: "sm-2",
    name: "Depurativo",
    description:
      "Kiwi, manzana, jengibre, pepino, menta, apio y espinaca. Podés sumar un scoop extra de proteína en polvo.",
    price: "6800",
    category: "smoothies",
  },
  {
    id: "sm-3",
    name: "Antioxidante",
    description: "Maracuyá, ananá, durazno, limón y jengibre. Podés sumar un scoop extra de proteína en polvo.",
    price: "6500",
    category: "smoothies",
  },
  {
    id: "sm-4",
    name: "Proteico",
    description: "Banana, scoop de proteína, avena y leche vegetal. Podés sumar un scoop extra de proteína en polvo.",
    price: "7200",
    category: "smoothies",
  },
  {
    id: "sm-5",
    name: "Young",
    description: "Maracuyá, kale, banana, ananá y chía. Podés sumar un scoop extra de proteína en polvo.",
    price: "6800",
    category: "smoothies",
  },
  {
    id: "sm-6",
    name: "Coconut",
    description: "Mango, ananá y leche de coco. Podés sumar un scoop extra de proteína en polvo.",
    price: "7200",
    category: "smoothies",
  },

  // SANDWICHES
  {
    id: "sw-1",
    name: "Tostado Premium",
    description: "Pan de miga, jamón natural y queso tybo. Acompañado con papas gajo al horno o ensalada.",
    price: "8500",
    category: "sandwiches",
  },
  {
    id: "sw-2",
    name: "Veggie",
    description: "Pan brioche, vegetales asados, espinaca y hummus. Acompañado con papas gajo al horno o ensalada.",
    price: "9200",
    category: "sandwiches",
  },
  {
    id: "sw-3",
    name: "Club Crispy",
    description:
      "Pan brioche, pollo crispy, panceta ahumada, pepinillos y salsa tártara. Acompañado con papas gajo al horno o ensalada.",
    price: "11500",
    category: "sandwiches",
  },
  {
    id: "sw-4",
    name: "Argento",
    description:
      "Pan brioche, mayonesa ahumada, carne braseada y tomates asados. Acompañado con papas gajo al horno o ensalada.",
    price: "12200",
    category: "sandwiches",
  },
  {
    id: "sw-5",
    name: "Croque Monsieur",
    description:
      "Pan de masa madre gratinado con jamón natural, queso tybo y suave salsa bechamel. Acompañado con papas gajo al horno o ensalada.",
    price: "10800",
    category: "sandwiches",
  },

  // TOSTONES
  {
    id: "to-1",
    name: "Avocado Toast",
    description: "Pan de masa madre con palta cremosa y toppings frescos.",
    price: "7500",
    category: "tostones",
  },
  {
    id: "to-2",
    name: "Tostón Burrata Ibérico",
    description: "Pan de masa madre con burrata cremosa y jamón ibérico.",
    price: "9800",
    category: "tostones",
  },
  {
    id: "to-3",
    name: "Tostón Tomates Asados",
    description: "Pan de masa madre con tomates cherry asados y hierbas.",
    price: "7200",
    category: "tostones",
  },
  {
    id: "to-4",
    name: "Huevos Revueltos",
    description: "Pan de masa madre con huevos revueltos cremosos.",
    price: "7800",
    category: "tostones",
  },

  // DULCES & SALADOS
  {
    id: "ds-1",
    name: "Medialuna Artesanal",
    description: "Medialuna de manteca artesanal recién horneada.",
    price: "2500",
    category: "dulces",
  },
  {
    id: "ds-2",
    name: "Medialuna con Jamón y Queso",
    description: "Medialuna rellena con jamón natural y queso.",
    price: "3800",
    category: "dulces",
  },
  {
    id: "ds-3",
    name: "Croissant de Manteca",
    description: "Croissant francés de manteca hojaldrado.",
    price: "3200",
    category: "dulces",
  },

  // COFFEE & DRINKS
  {
    id: "cf-1",
    name: "Espresso",
    description: "Shot único de café espresso.",
    price: "2200",
    category: "coffee",
  },
  {
    id: "cf-2",
    name: "Espresso Doble",
    description: "Shot doble de café espresso.",
    price: "2800",
    category: "coffee",
  },
  {
    id: "cf-3",
    name: "Americano",
    description: "Espresso con agua caliente.",
    price: "2500",
    category: "coffee",
  },
  {
    id: "cf-4",
    name: "Americano Doble",
    description: "Espresso doble con agua caliente.",
    price: "3200",
    category: "coffee",
  },
  {
    id: "cf-5",
    name: "Cappuccino",
    description: "Espresso con leche vaporizada y espuma.",
    price: "3500",
    category: "coffee",
  },
  {
    id: "cf-6",
    name: "Cappuccino Doble",
    description: "Espresso doble con leche vaporizada y espuma.",
    price: "4200",
    category: "coffee",
  },
  {
    id: "cf-7",
    name: "Cortado",
    description: "Espresso con un toque de leche.",
    price: "2800",
    category: "coffee",
  },
  {
    id: "cf-8",
    name: "Flat White",
    description: "Espresso doble con microespuma de leche.",
    price: "3800",
    category: "coffee",
  },
  {
    id: "cf-9",
    name: "Latte",
    description: "Espresso con leche vaporizada.",
    price: "3800",
    category: "coffee",
  },
  {
    id: "cf-10",
    name: "Iced Americano Doble",
    description: "Espresso doble con agua fría y hielo.",
    price: "3500",
    category: "coffee",
  },
  {
    id: "cf-11",
    name: "Iced Cappuccino",
    description: "Espresso con leche fría y hielo.",
    price: "4200",
    category: "coffee",
  },
  {
    id: "cf-12",
    name: "Iced Latte",
    description: "Espresso con leche fría y hielo.",
    price: "4200",
    category: "coffee",
  },
  {
    id: "cf-13",
    name: "Espresso Tonic",
    description: "Espresso con agua tónica y hielo.",
    price: "4500",
    category: "coffee",
  },
  {
    id: "cf-14",
    name: "Cold Brew",
    description: "Café de extracción en frío.",
    price: "4800",
    category: "coffee",
  },
  {
    id: "cf-15",
    name: "Mocha Latte",
    description: "Latte con chocolate.",
    price: "4500",
    category: "coffee",
  },
  {
    id: "cf-16",
    name: "Caramel Latte",
    description: "Latte con caramelo.",
    price: "4500",
    category: "coffee",
  },
  {
    id: "cf-17",
    name: "Matcha Latte Frío",
    description: "Matcha con leche fría y hielo.",
    price: "4800",
    category: "coffee",
  },
  {
    id: "cf-18",
    name: "Bulletproof Coffee",
    description: "1 shot de café con MCT Oil y Ghee.",
    price: "5200",
    category: "coffee",
  },
  {
    id: "cf-19",
    name: "Coco MCT Latte",
    description: "2 shots de café con leche de coco y MCT Oil.",
    price: "5500",
    category: "coffee",
  },
  {
    id: "cf-20",
    name: "Limonada Menta",
    description: "Limonada fresca con menta.",
    price: "4200",
    category: "coffee",
  },

  // TEA SELECTION
  {
    id: "te-1",
    name: "Frutos del Bosque",
    description: "Té negro de India, rosa mosqueta, arándano, hibiscus, frutilla.",
    price: "3500",
    category: "tea",
  },
  {
    id: "te-2",
    name: "Verde Fresco",
    description: "Té verde Sencha, limón, cardamomo, menta, lemongrass, cedrón.",
    price: "3500",
    category: "tea",
  },
  {
    id: "te-3",
    name: "Chai Especiado",
    description:
      "Té negro de India, canela, cardamomo, naranja, jengibre, anís estrellado, clavo de olor, pimienta rosa.",
    price: "3800",
    category: "tea",
  },
  {
    id: "te-4",
    name: "Rooibos Tentación",
    description: "Rooibos de Sudáfrica, canela, cascarilla de cacao, pimienta rosa.",
    price: "3800",
    category: "tea",
  },
  {
    id: "te-5",
    name: "Earl Grey",
    description: "Combinación de tés negros de Sri Lanka e India, azahar, pétalos de rosa, bergamota.",
    price: "3500",
    category: "tea",
  },
]

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.category === categoryId)
}

export function getAllMenuItems(): MenuItem[] {
  return menuItems
}
