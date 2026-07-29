'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#ffffff',
                        color: '#111111',
                        borderRadius: '0px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                    },
                    success: {
                        iconTheme: {
                            primary: '#111111',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
            {children}
        </Provider>
    );
}
