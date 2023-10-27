import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { editor } from 'monaco-editor';
import debounce from 'lodash/debounce';
import { message } from 'antd';
import styles from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { changeFileState } from '@/stores/slices/workspaceFile.slice';
import { getLanguageByFileExtension } from '@/utils';
import { FileContentResponse, FileState, GetFileContentResponseDto, SaveFileContentResponse } from '@/types';
import { Socket } from 'socket.io-client';
import { BeaconEvent } from '@/constants/beaconEvent';

type Props = {
    path?: string;
    beaconSocket?: Socket;
};

export default function MonacoEditor({ path, beaconSocket }: Props) {
    const monacoRef = useRef<Monaco>();
    const editorRef = useRef<editor.IStandaloneCodeEditor>();

    const dispatch = useAppDispatch();

    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);
    const [messageApi, contextHolder] = message.useMessage();

    const [workspaceFile, setWorkspaceFile] = useState<GetFileContentResponseDto>();
    const [value, setValue] = useState<string>('Getting started...');
    const [editorLanguage, setEditorLanguage] = useState<string>('plaintext');

    // Use for reduce redux dispatch
    const [currentFileState, setCurrentFileState] = useState<FileState>(FileState.OPENED);

    const fetchFileContent = () => {
        if (!path || !beaconSocket) return;

        beaconSocket.emit(
            BeaconEvent.GET_FILE_CONTENT,
            {
                params: {
                    path: path,
                },
            },
            (res: FileContentResponse) => {
                if (res.success) {
                    setValue(res.data.content);
                    setWorkspaceFile(res.data);
                } else {
                    messageApi.error('Lỗi khi lấy nội dung file!');
                }
            },
        );
    };

    useEffect(() => {
        const file = workspaceFiles.find((item) => item.path === path);

        if (!file) return;

        setValue(file.content);
        setWorkspaceFile(file);

        // Set editor language
        const editorLanguage = getLanguageByFileExtension(file.name);

        if (!editorLanguage) {
            messageApi.warning({
                content: 'Định dạng file không hỗ trợ!',
            });
        }

        setEditorLanguage(editorLanguage?.editorKey || 'plaintext');

        // Fetch file content every 1 second
        const fetchFileInterval = setInterval(() => {
            if (currentFileState !== FileState.CHANGED) {
                fetchFileContent();
            }
        }, 2500);

        return () => {
            clearInterval(fetchFileInterval);
        };
    }, []);

    const saveFile = () => {
        if (!path || !beaconSocket) return;

        const value = editorRef.current?.getValue();

        beaconSocket.emit(
            BeaconEvent.SAVE_FILE_CONTENT,
            {
                params: {
                    path: path,
                    content: value || '',
                },
            },
            (res: SaveFileContentResponse) => {
                if (res.success) {
                    setCurrentFileState(FileState.SAVED);
                    dispatch(changeFileState({ path: path, state: FileState.SAVED }));
                } else {
                    messageApi.error('Lỗi khi lưu file!');
                }
            },
        );
    };

    const onChange = debounce((value: string | undefined) => {
        if (!value || !path) return;

        setValue(value);

        // change file state
        if (currentFileState !== FileState.CHANGED) {
            setCurrentFileState(FileState.CHANGED);
            dispatch(changeFileState({ path: path, state: FileState.CHANGED }));
        }
    }, 500);

    const handleEditorWillMount = (monaco: Monaco) => {
        const yggdrasilTheme: editor.IStandaloneThemeData = {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#111319',
            },
        };

        monaco.editor.defineTheme('yggdrasilTheme', yggdrasilTheme);

        monacoRef.current = monaco;
    };

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        editor.focus();

        editorRef.current = editor;

        // Bind ctrl S to editor
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            saveFile();
        });
    };

    return (
        <div id={'editorContainer'} className={styles.container}>
            {contextHolder}

            <Editor
                className={styles.editor}
                language={editorLanguage}
                value={value}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                onChange={onChange}
                theme={'yggdrasilTheme'}
            />
        </div>
    );
}
