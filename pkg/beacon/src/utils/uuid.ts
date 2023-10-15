export function shortenUUID(uuid: string) {
    const params = uuid.split("-");

    return `${params[0]}-${params[1]}`;
}
