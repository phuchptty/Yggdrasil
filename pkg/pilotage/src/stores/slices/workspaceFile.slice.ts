import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WorkspaceFileState = {
    openFiles: string[]; // file path
    workspaceFiles: WorkspaceScatteredFileResponse[];
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
        addWorkspaceFile: (state, file: PayloadAction<WorkspaceScatteredFileResponse>) => {
            // Check if file already exists
            if (state.workspaceFiles.find((f) => f.path === file.payload.path)) return;

            state.workspaceFiles.push(file.payload);
        },
        openNewFile: (state, path: PayloadAction<string>) => {
            if (state.openFiles.includes(path.payload)) {
                return;
            }

            // find file in workspaceFiles
            const file = state.workspaceFiles.find((file) => file.path === path.payload);

            if (!file) {
                return;
            }

            state.openFiles.push(file.path);
        },
        closeFile: (state, path: PayloadAction<string>) => {
            const index = state.openFiles.findIndex((f) => f === path.payload);

            if (index === -1) {
                return;
            }

            state.openFiles.splice(index, 1);
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
        addNewFile: (state, payload: PayloadAction<Playground_SaveWorkspaceFileInput>) => {
            state.workspaceFiles.push({
                _id: payload.payload._id,
                name: payload.payload.name,
                path: payload.payload.path,
                content: payload.payload.content,
                size: 0,
                actualSize: 0,
                fileType: Playground_FileType.Text, // TODO: support many file types
                metaData: {},
            });

            state.openFiles.push(payload.payload.path);
        },
        setCurrentFile: (state, payload: PayloadAction<string>) => {
            state.currentFile = payload.payload;
        },
    },
});

export const { reset, setCurrentFile, openNewFile, addWorkspaceFile, closeFile, fileContentChanged, addNewFile, removeMemorizeFile } =
    workspaceFileSlice.actions;

export default workspaceFileSlice.reducer;
