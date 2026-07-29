import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    product: string; // ID
    name: string;
    price: number;
    discountPrice?: number;
    quantity: number;
    size?: string;
    color?: string;
    image: string;
    stock: number;
    sku: string;
}

interface Coupon {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
    message?: string;
}

interface CartState {
    cartItems: CartItem[];
    coupon: Coupon | null;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    discountPrice: number;
    totalPrice: number;
}

const getInitialCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cartItems');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
    }
    return [];
};

const decimals = (num: number) => {
    return Math.round(num * 100) / 100;
};

const calculateTotals = (state: CartState) => {
    // Base sum
    state.itemsPrice = decimals(
        state.cartItems.reduce((acc, item) => {
            const activePrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
            return acc + activePrice * item.quantity;
        }, 0)
    );

    // Apply Coupon Discount
    if (state.coupon) {
        if (state.coupon.discountType === 'percentage') {
            state.discountPrice = decimals((state.itemsPrice * state.coupon.discountAmount) / 100);
        } else {
            state.discountPrice = decimals(Math.min(state.coupon.discountAmount, state.itemsPrice));
        }
    } else {
        state.discountPrice = 0;
    }

    // Shipping details ($15 flat, free over $100 after discounts)
    const netBeforeShipping = state.itemsPrice - state.discountPrice;
    state.shippingPrice = netBeforeShipping > 150 || netBeforeShipping === 0 ? 0 : 15;

    // Tax flat 8% of original/discounted total
    state.taxPrice = decimals(netBeforeShipping * 0.08);

    // Final Total
    state.totalPrice = decimals(
        Math.max(0, netBeforeShipping + state.shippingPrice + state.taxPrice)
    );

    if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }
};

const initialState: CartState = {
    cartItems: getInitialCart(),
    coupon: null,
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    discountPrice: 0,
    totalPrice: 0
};

// Compute totals for initial state
calculateTotals(initialState);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const item = action.payload;
            const existItem = state.cartItems.find(
                x => x.product === item.product && x.size === item.size && x.color === item.color
            );

            if (existItem) {
                // limit by stock
                const potentialQty = existItem.quantity + item.quantity;
                existItem.quantity = Math.min(potentialQty, item.stock);
            } else {
                state.cartItems.push(item);
            }

            calculateTotals(state);
        },
        updateQuantity(state, action: PayloadAction<{ product: string; size?: string; color?: string; quantity: number }>) {
            const { product, size, color, quantity } = action.payload;
            const existItem = state.cartItems.find(
                x => x.product === product && x.size === size && x.color === color
            );

            if (existItem) {
                existItem.quantity = Math.max(1, Math.min(quantity, existItem.stock));
            }

            calculateTotals(state);
        },
        removeFromCart(state, action: PayloadAction<{ product: string; size?: string; color?: string }>) {
            const { product, size, color } = action.payload;
            state.cartItems = state.cartItems.filter(
                x => !(x.product === product && x.size === size && x.color === color)
            );

            calculateTotals(state);
        },
        applyCoupon(state, action: PayloadAction<Coupon>) {
            state.coupon = action.payload;
            calculateTotals(state);
        },
        removeCoupon(state) {
            state.coupon = null;
            calculateTotals(state);
        },
        clearCart(state) {
            state.cartItems = [];
            state.coupon = null;
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.taxPrice = 0;
            state.discountPrice = 0;
            state.totalPrice = 0;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cartItems');
            }
        }
    }
});

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
