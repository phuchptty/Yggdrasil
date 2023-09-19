type LanguageStartFile = {
    name: string;
    mimeType: string;
    content?: string;
};

const languageStartFile: Record<string, LanguageStartFile> = {
    c: {
        name: "main.c",
        content: ``,
        mimeType: "text/plain",
    },
    cpp: {
        name: "main.cpp",
        content: ``,
        mimeType: "text/plain",
    },
    python: {
        name: "main.py",
        content: ``,
        mimeType: "text/x-python",
    },
    java: {
        name: "Main.java",
        content: ``,
        mimeType: "text/x-java",
    },
    javascript: {
        name: "main.js",
        content: ``,
        mimeType: "text/javascript",
    },
    typescript: {
        name: "main.ts",
        content: ``,
        mimeType: "text/plain",
    },
    csharp: {
        name: "main.cs",
        content: ``,
        mimeType: "text/plain",
    },
    go: {
        name: "main.go",
        content: ``,
        mimeType: "text/plain",
    },
    dart: {
        name: "main.dart",
        content: ``,
        mimeType: "text/plain",
    },
};

export default languageStartFile;
