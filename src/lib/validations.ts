import { ProductFormData, TenderFormData } from "@/types";

export function validateProduct(data: ProductFormData): string[] {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push("El nombre del producto es requerido");
  }

  if (!data.sku.trim()) {
    errors.push("El SKU es requerido");
  }

  if (data.salePrice <= 0) {
    errors.push("El precio de venta debe ser mayor a 0");
  }

  if (data.costPrice <= 0) {
    errors.push("El costo debe ser mayor a 0");
  }

  if (data.salePrice <= data.costPrice) {
    errors.push("El precio de venta debe ser mayor al costo");
  }

  return errors;
}

export function validateTender(data: TenderFormData): string[] {
  const errors: string[] = [];

  if (!data.client.trim()) {
    errors.push("El cliente es requerido");
  }

  if (!data.awardDate) {
    errors.push("La fecha de adjudicación es requerida");
  }

  if (!data.products || data.products.length === 0) {
    errors.push("Debe agregar al menos un producto");
  }

  data.products?.forEach((product, index) => {
    if (!product.productId) {
      errors.push(`El producto ${index + 1} es requerido`);
    }
    if (product.quantity <= 0) {
      errors.push(`La cantidad del producto ${index + 1} debe ser mayor a 0`);
    }
  });

  return errors;
}

export function calculateMargin(
  salePrice: number,
  costPrice: number,
  quantity: number
): number {
  return (salePrice - costPrice) * quantity;
}

export function calculateTotalMargin(
  orders: Array<{
    product: { salePrice: number; costPrice: number };
    quantity: number;
  }>
): number {
  return orders.reduce((total, order) => {
    return (
      total +
      calculateMargin(
        order.product.salePrice,
        order.product.costPrice,
        order.quantity
      )
    );
  }, 0);
}
