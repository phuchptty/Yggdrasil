import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playground_Workspace } from '@/graphql/generated/types';

const initialState = {} as Playground_Workspace;

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        reset: () => initialState,
        setWorkspace: (state, action: PayloadAction<Playground_Workspace>) => {
            state = action.payload;
            return state;
        },
    },
});

export const { reset, setWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
