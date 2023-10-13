import internal from "stream";

type ReadStreamToStringResponse = {
    actualSize: number;
    content: string;
};

export function readStreamToString(stream: internal.Readable): Promise<ReadStreamToStringResponse> {
    return new Promise((resolve, reject) => {
        let fileSize = 0;
        const fileArrBuffer = [];

        stream.on("data", function (chunk) {
            fileSize += chunk.length;
            fileArrBuffer.push(chunk);
        });

        stream.on("end", function () {
            const totalBuffer = Buffer.concat(fileArrBuffer);

            const fileContent = totalBuffer.toString("utf-8");

            resolve({
                actualSize: fileSize,
                content: fileContent,
            });
        });

        stream.on("error", function (err: any) {
            reject(err);
        });
    });
}
