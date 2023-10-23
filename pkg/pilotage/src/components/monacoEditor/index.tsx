import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { editor } from 'monaco-editor';
import debounce from 'lodash/debounce';
import { message } from 'antd';
import Image from 'next/image';

import styles from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { fileContentChanged } from '@/stores/slices/workspaceFile.slice';
import { WorkspaceScatteredFileResponse } from '@/graphql/generated/types';
import { getLanguageByFileExtension } from '@/utils';
import warningNoti from '@/assets/icons/warning-noti.svg';

type Props = {
    path?: string;
};

export default function MonacoEditor({ path }: Props) {
    const monacoRef = useRef<Monaco>();
    const dispatch = useAppDispatch();

    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);
    const [messageApi, contextHolder] = message.useMessage();

    const [workspaceFile, setWorkspaceFile] = useState<WorkspaceScatteredFileResponse>();
    const [value, setValue] = useState<string>('Content here');
    const [editorLanguage, setEditorLanguage] = useState<string>('plaintext');

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

        console.log('editorLanguage', editorLanguage);

        setEditorLanguage(editorLanguage?.editorKey || 'plaintext');
    }, []);

    const saveToRedux = (value: string) => {
        if (!path) return;

        dispatch(
            fileContentChanged({
                filePath: workspaceFile?.path as string,
                content: value,
            }),
        );
    };

    const onChange = debounce((value: string | undefined) => {
        if (!value || !path) return;

        setValue(value);

        saveToRedux(value);
    }, 500);

    const handleEditorWillMount = (monaco: Monaco) => {
        const tek4Theme: editor.IStandaloneThemeData = {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#111319',
            },
        };

        monaco.editor.defineTheme('tek4Theme', tek4Theme);

        monacoRef.current = monaco;
    };

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: any) => {
        editor.focus();
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
                theme={'tek4Theme'}
            />
        </div>
    );
}
