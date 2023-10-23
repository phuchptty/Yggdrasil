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
        deleteWorkspaceFile: (state, action: PayloadAction<string>) => {
            if (!state.workspaceFiles) return;

            const index = state.workspaceFiles.findIndex((f) => f.path === action.payload);

            if (index > -1) {
                state.workspaceFiles.splice(index, 1);
            }
        },
    },
});

export const { reset, setWorkspace, deleteWorkspaceFile } = workspaceSlice.actions;

export default workspaceSlice.reducer;
