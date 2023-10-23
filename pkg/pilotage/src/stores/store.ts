import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth.slice';
import workspaceSlice from './slices/workspace.slice';
import workspaceFileSlice from './slices/workspaceFile.slice';

export const store = configureStore({
    reducer: {
        authSlice,
        workspaceSlice,
        workspaceFileSlice: workspaceFileSlice,
    },
    devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
