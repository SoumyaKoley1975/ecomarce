import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
    _id?: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token: string;
    wishlist?: string[];
    addressBook?: Address[];
}

interface AuthState {
    userInfo: UserInfo | null;
    loading: boolean;
    error: string | null;
}

const getInitialUser = (): UserInfo | null => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('userInfo');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

const initialState: AuthState = {
    userInfo: getInitialUser(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<UserInfo>) {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
            if (typeof window !== 'undefined') {
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            }
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.userInfo = null;
            state.loading = false;
            state.error = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('cartItems');
            }
        },
        updateProfileSuccess(state, action: PayloadAction<UserInfo>) {
            if (state.userInfo) {
                state.userInfo = { ...state.userInfo, ...action.payload };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
                }
            }
        },
        setAddresses(state, action: PayloadAction<Address[]>) {
            if (state.userInfo) {
                state.userInfo.addressBook = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
                }
            }
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateProfileSuccess,
    setAddresses
} = authSlice.actions;

export const setCredentials = loginSuccess;
export const updateProfile = updateProfileSuccess;

export default authSlice.reducer;
