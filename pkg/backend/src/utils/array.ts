// This function merge require _id on each object
export function mergeArrays(array1: any[], array2: any[]) {
    const mergedMap = {};

    // Function to add or override objects in the map
    const addToMap = (obj: any) => {
        const _id = obj._id;
        mergedMap[_id] = obj;
    };

    // Add objects from the first array to the map
    array1.forEach(addToMap);

    // Add or override objects from the second array to the map
    array2.forEach(addToMap);

    // Convert the map back to an array
    return Object.values(mergedMap);
}
