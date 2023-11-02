import cppImage from "@/assets/icons/languages/c-.png";
import pythonImage from "@/assets/icons/languages/python.png";
import nodejsImage from "@/assets/icons/languages/node-js.png";
import languageImage from "@/assets/images/language.jpg";

interface LanguageConfig {
    name: string;
    editorKey: string;
    extension: string[];
    entryFile?: string;
}

const languages: LanguageConfig[] = [
    { name: 'Text', editorKey: 'plaintext', extension: ['.txt'] },
    { name: 'HTML', editorKey: 'html', extension: ['.html'], entryFile: 'index.html' },
    { name: 'CSS', editorKey: 'css', extension: ['.css'] },
    { name: 'SASS', editorKey: 'scss', extension: ['.sass', '.scss'] },
    { name: 'JavaScript', editorKey: 'javascript', extension: ['.js'], entryFile: 'main.js' },
    { name: 'TypeScript', editorKey: 'typescript', extension: ['.ts'], entryFile: 'main.ts' },
    { name: 'Python 3', editorKey: 'python', extension: ['.py'], entryFile: 'main.py' },
    { name: 'Java', editorKey: 'java', extension: ['.java'], entryFile: 'main.java' },
    { name: 'C', editorKey: 'c', extension: ['.c'], entryFile: 'main.c' },
    { name: 'C++', editorKey: 'cpp', extension: ['.cpp', '.h'], entryFile: 'main.cpp' },
    { name: 'C#', editorKey: 'csharp', extension: ['.cs'], entryFile: 'main.cs' },
    { name: 'Go', editorKey: 'go', extension: ['.go'], entryFile: 'main.go' },
    { name: 'Rust', editorKey: 'rust', extension: ['.rs'], entryFile: 'main.rs' },
    { name: 'PHP', editorKey: 'php', extension: ['.php'], entryFile: 'index.php' },
    { name: 'Dockerfile', editorKey: 'dockerfile', extension: ['.dockerfile'] },
    { name: 'Lua', editorKey: 'lua', extension: ['.lua'], entryFile: 'main.lua' },
    { name: 'Ruby', editorKey: 'ruby', extension: ['.rb'], entryFile: 'main.rb' },
    { name: 'JSON', editorKey: 'json', extension: ['.json'] },
    { name: 'XML', editorKey: 'xml', extension: ['.xml'] },
    { name: 'YAML', editorKey: 'yaml', extension: ['.yaml', '.yml'] },
];

export function getLanguageByFileExtension(fileName: string): LanguageConfig | null {
    const extension = fileName.substring(fileName.lastIndexOf('.'));

    const language = languages.find((lang) => lang.extension.includes(extension));

    return language ? language : null;
}

export function getLanguageByEditorKey(editorKey: string): LanguageConfig | null {
    const language = languages.find((lang) => lang.editorKey === editorKey);

    return language ? language : null;
}

export function getLanguageIcon(key: string){
    let image;

    switch (key) {
        case 'cpp':
            image = cppImage;
            break;

        case 'python':
            image = pythonImage;
            break;

        case 'nodejs':
            image = nodejsImage;
            break;

        default:
            image = languageImage;
    }

    return image;
}