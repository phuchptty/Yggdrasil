type LanguageStartFile = {
    name: string;
    mimeType: string;
    content?: string;
    postCreateCommand?: string[];
    postCreateImage?: string;
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
        postCreateCommand: ["touch", "/mnt/workspace/main.cpp"],
    },
    python: {
        name: "main.py",
        content: ``,
        mimeType: "text/x-python",
        postCreateCommand: ["touch", "/mnt/workspace/main.py"],
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
        postCreateCommand: ["/bin/sh", "-c", "yarn init -y; yarn; touch index.js"],
        postCreateImage: "node:18-alpine",
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
