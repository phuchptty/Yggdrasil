import isBinaryPath from "is-binary-path";

export const checkNeedConvertMimeType = (mimeType: string) => {
    const needType = [
        "image/vnd.microsoft.icon",
        "image/bmp",
        "image/cis-cod",
        "image/gif",
        "image/jpeg",
        "image/jpeg",
        "image/pipeg",
        "image/svg+xml",
        "image/tiff",
        "image/tiff",
        "image/x-icon",
        "image/x-rgb",
        "image/png",
        "image/avif",
        "image/webp",
        "audio/aac",
        "audio/mpeg",
        "audio/ogg",
        "audio/opus",
        "audio/wav",
        "audio/webm",
        "video/x-msvideo",
        "video/mp4",
        "video/mpeg",
        "video/ogg",
        "video/webm",
        "application/x-bzip",
        "application/x-bzip2",
        "application/zip",
        "application/ogg",
        "application/x-7z-compressed",
        "font/otf",
        "font/ttf",
        "font/woff",
        "font/woff2",
    ];

    return needType.includes(mimeType);
};

export const checkBinaryFile = (fileName: string) => {
    // get extension
    // const extension = fileName.split('.').pop();
    return isBinaryPath(fileName);
};
