export interface Product {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  price: number;
  image: string;
  stock: number;
  createdAt: string;
  updateAt: string;
  description: string;
  colors: any[];
  comments: any[];
  brandId: string;
  categoryId: string;
  brand: Brand;
  category: Category;
}

export interface Brand {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  createdAt: string;
  updateAt: string;
}

export interface Category {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  createdAt: string;
  updateAt: string;
}
