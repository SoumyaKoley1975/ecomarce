import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    sku: string;
    category: string;
}

interface WishlistState {
    items: WishlistItem[];
}

const getInitialWishlist = (): WishlistItem[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('wishlistItems');
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

const initialState: WishlistState = {
    items: getInitialWishlist()
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlistItems(state, action: PayloadAction<WishlistItem[]>) {
            state.items = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('wishlistItems', JSON.stringify(action.payload));
            }
        },
        toggleWishlistItem(state, action: PayloadAction<WishlistItem>) {
            const exist = state.items.find(item => item._id === action.payload._id);
            if (exist) {
                state.items = state.items.filter(item => item._id !== action.payload._id);
            } else {
                state.items.push(action.payload);
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('wishlistItems', JSON.stringify(state.items));
            }
        },
        clearWishlist(state) {
            state.items = [];
            if (typeof window !== 'undefined') {
                localStorage.removeItem('wishlistItems');
            }
        }
    }
});

export const { setWishlistItems, toggleWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
