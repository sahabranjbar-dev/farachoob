export interface Brand {
  id?: string;
  farsiTitle?: string;
  englishTitle?: string;
  createdAt?: string;
  updateAt?: string;
}

export interface Category {
  id?: string;
  farsiTitle?: string;
  englishTitle?: string;
  createdAt?: string;
  updateAt?: string;
}

export interface Product {
  id?: string;
  farsiTitle?: string;
  englishTitle?: string;
  price?: number | undefined | null;
  stock?: number | undefined | null;
  createdAt?: Date | null;
  updateAt?: Date | null;
  description?: any;
  comments?: any[];
  brandId?: any;
  categoryId?: any;
  brand?: any;
  category?: any;
  variations?: Variation[];
}

export interface Variation {
  id?: string;
  productId?: string;
  colorName?: string;
  colorCode?: string;
  price?: number;
  stock?: number;
  images?: Image[];
}

export interface Image {
  id?: string;
  url?: string;
  variationId?: string;
}
