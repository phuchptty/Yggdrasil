export function filterPreProcess(filter: any) {
    const newObj = {};

    for (const key in filter) {
        const value = filter[key];

        if (value && value.length !== 0) {
            newObj[key] = value;
        }
    }

    return newObj;
}
