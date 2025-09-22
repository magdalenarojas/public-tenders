import { Tender, Product, Order } from "@prisma/client";

export type TenderWithOrders = Tender & {
  orders: (Order & {
    product: Product;
  })[];
};

export type ProductWithOrders = Product & {
  orders: (Order & {
    tender: Tender;
  })[];
};

export type OrderWithDetails = Order & {
  tender: Tender;
  product: Product;
};

export interface TenderFormData {
  client: string;
  awardDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  margin?: number;
  products: {
    productId: string;
    quantity: number;
    price?: number;
    observation?: string;
  }[];
}

export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
  salePrice: number;
  costPrice: number;
}

export interface TenderSummary {
  id: string;
  client: string;
  awardDate: Date;
  totalMargin: number;
  totalRevenue: number;
  totalCost: number;
  productCount: number;
}
