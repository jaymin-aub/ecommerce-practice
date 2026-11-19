export interface CartItemDto {
  readonly productId: number;
  readonly title: string;
  readonly price: number;
  readonly thumbnail: string;
  readonly quantity: number;
  readonly itemTotal: number;
}

export interface CartSummaryDto {
  readonly userId: number;
  readonly items: readonly CartItemDto[];
  readonly totalQuantity: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly grandTotal: number;
}

export interface AddToCartDto {
  readonly productId: number;
  readonly quantity?: number;
}

export interface UpdateCartItemDto {
  readonly quantity: number;
}
