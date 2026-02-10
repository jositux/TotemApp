import type { Product } from "./store-context"

export const products: Product[] = [
  {
    id: "1",
    name: "Funda Artística Abstracta",
    price: 299,
    image: "/case-1.jpg",
    category: "Arte",
    description: "Funda con diseño artístico abstracto de alta calidad. Protección completa contra caídas y arañazos.",
    colors: ["#6B46C1", "#3182CE", "#E53E3E"]
  },
  {
    id: "2",
    name: "Funda Negra Elegante",
    price: 249,
    image: "/case-2.jpg",
    category: "Clásico",
    description: "Funda negra mate con acabado premium. Diseño minimalista y elegante.",
    colors: ["#1A202C", "#2D3748", "#4A5568"]
  },
  {
    id: "3",
    name: "Funda Transparente Pro",
    price: 199,
    image: "/case-3.jpg",
    category: "Transparente",
    description: "Muestra el diseño original de tu teléfono con esta funda transparente ultra delgada.",
    colors: ["transparent", "#F7FAFC", "#EDF2F7"]
  },
  {
    id: "4",
    name: "Funda Gaming RGB",
    price: 399,
    image: "/case-4.jpg",
    category: "Gaming",
    description: "Funda con diseño gamer y detalles RGB. Perfecta para amantes de los videojuegos.",
    colors: ["#E53E3E", "#38B2AC", "#805AD5"]
  },
  {
    id: "5",
    name: "Funda Naturaleza",
    price: 279,
    image: "/case-5.jpg",
    category: "Naturaleza",
    description: "Diseño inspirado en la naturaleza con materiales eco-friendly.",
    colors: ["#276749", "#2F855A", "#48BB78"]
  },
  {
    id: "6",
    name: "Funda Anime Edition",
    price: 349,
    image: "/case-6.jpg",
    category: "Anime",
    description: "Funda con ilustración de anime exclusiva. Edición limitada.",
    colors: ["#D53F8C", "#B794F4", "#63B3ED"]
  },
  {
    id: "7",
    name: "Funda Roja Pasión",
    price: 259,
    image: "/case-7.jpg",
    category: "Colores",
    description: "Funda roja vibrante con textura suave al tacto.",
    colors: ["#C53030", "#E53E3E", "#FC8181"]
  },
  {
    id: "8",
    name: "Funda Mármol Luxury",
    price: 329,
    image: "/case-8.jpg",
    category: "Premium",
    description: "Diseño de mármol elegante. Acabado premium y protección de grado militar.",
    colors: ["#E2E8F0", "#CBD5E0", "#A0AEC0"]
  }
]

export const categories = [
  "Todos",
  "Arte",
  "Clásico",
  "Transparente",
  "Gaming",
  "Naturaleza",
  "Anime",
  "Colores",
  "Premium"
]
