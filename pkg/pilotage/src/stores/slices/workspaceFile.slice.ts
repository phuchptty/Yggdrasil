import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileState, GetFileContentResponseDto } from '@/types';

type OpenFile = {
    path: string;
    state: FileState;
};

type WorkspaceFileState = {
    openFiles: OpenFile[]; // file path & file state
    workspaceFiles: GetFileContentResponseDto[];
    currentFile: string; // path of current file
};

const initialState = {
    openFiles: [],
    workspaceFiles: [],
    currentFile: '',
} as WorkspaceFileState;

export const workspaceFileSlice = createSlice({
    name: 'workspaceFile',
    initialState,
    reducers: {
        reset: () => initialState,
        addWorkspaceFile: (state, file: PayloadAction<GetFileContentResponseDto>) => {
            // Check if file already exists
            if (state.workspaceFiles.find((f) => f.path === file.payload.path)) return;

            state.workspaceFiles.push(file.payload);
        },
        openNewFile: (state, path: PayloadAction<string>) => {
            // Check if file already opened
            if (state.openFiles.some((x) => x.path.includes(path.payload))) {
                return;
            }

            // find file in workspaceFiles
            const file = state.workspaceFiles.find((file) => file.path === path.payload);

            if (!file) {
                return;
            }

            state.openFiles.push({
                path: file.path,
                state: FileState.OPENED,
            });
        },
        closeFile: (state, path: PayloadAction<string>) => {
            const index = state.openFiles.findIndex((f) => f.path === path.payload);

            if (index === -1) {
                return;
            }

            state.openFiles.splice(index, 1);

            // Remove from workspaceFiles
            const index2 = state.workspaceFiles.findIndex((f) => f.path === path.payload);
            state.workspaceFiles.splice(index2, 1);
        },
        changeFileState: (state, payload: PayloadAction<OpenFile>) => {
            const index = state.openFiles.findIndex((f) => f.path === payload.payload.path);

            if (index === -1) {
                return;
            }

            state.openFiles[index].state = payload.payload.state;
        },
        removeMemorizeFile: (state, path: PayloadAction<string>) => {
            const index = state.workspaceFiles.findIndex((f) => f.path === path.payload);

            if (index === -1) {
                return;
            }

            state.workspaceFiles.splice(index, 1);
        },
        fileContentChanged: (state, payload: PayloadAction<{ filePath: string; content: string }>) => {
            const index = state.workspaceFiles.findIndex((f) => f.path === payload.payload.filePath);

            if (index === -1) {
                return;
            }

            state.workspaceFiles[index].content = payload.payload.content;
        },
        addNewFile: (state, payload: PayloadAction<GetFileContentResponseDto>) => {
            state.workspaceFiles.push(payload.payload);

            state.openFiles.push({
                path: payload.payload.path,
                state: FileState.OPENED,
            });
        },
        setCurrentFile: (state, payload: PayloadAction<string>) => {
            state.currentFile = payload.payload;
        },
    },
});

export const {
    reset,
    setCurrentFile,
    changeFileState,
    openNewFile,
    addWorkspaceFile,
    closeFile,
    fileContentChanged,
    addNewFile,
    removeMemorizeFile,
} = workspaceFileSlice.actions;

export default workspaceFileSlice.reducer;
