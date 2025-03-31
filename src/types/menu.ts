export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface MenuItemInput extends Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 