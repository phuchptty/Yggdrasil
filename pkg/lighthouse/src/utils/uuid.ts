/**
 * Convert uuid to base64url
 *
 * @example in: `f32a91da-c799-4e13-aa17-8c4d9e0323c9` out: `8yqR2seZThOqF4xNngMjyQ`
 */
export function uuidToBase64(uuid: string) {
    return Buffer.from(uuid.replace(/-/g, ""), "hex").toString("base64url");
}

/**
 * Convert base64url to uuid
 *
 * @example in: `8yqR2seZThOqF4xNngMjyQ` out: `f32a91da-c799-4e13-aa17-8c4d9e0323c9`
 */
export function base64toUUID(base64: string) {
    const hex = Buffer.from(base64, "base64url").toString("hex");

    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}

export function shortenUUID(uuid: string) {
    const params = uuid.split("-");

    return `${params[0]}-${params[1]}`;
}
