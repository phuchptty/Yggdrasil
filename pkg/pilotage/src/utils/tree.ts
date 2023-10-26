import { DataNode } from 'rc-tree/lib/interface';
import { FileType, ListFileItem } from '@/types';

export function convertDataToAntDesignTree(data: ListFileItem[]) {
    const treeStruct = data.reduce((acc: DataNode[], item) => {
        const path = item.path;

        const pathParts = path.split('/');

        let parent = acc;

        pathParts.forEach((part, index) => {
            const key = `${index}-${part}`;

            const existingNode = parent.find((node) => node.key === key);
            const fullPath = pathParts.slice(0, index + 1).join('/'); // join path parts with delimiter

            if (existingNode) {
                // This will gonna never happen
                // parent = existingNode.children;
            } else {
                const newNode = {
                    title: part,
                    key: fullPath,
                    isLeaf: index === pathParts.length - 1 && item.type === FileType.FILE,
                    children: [],
                };

                parent.push(newNode);

                parent = newNode.children;
            }
        });

        return acc;
    }, []);

    // Sort tree
    return treeStruct.sort((a, b) => {
        // Priority to folders

        // If both are folders
        if (!a.isLeaf && !b.isLeaf) {
            // Alphabetical order
            // @ts-ignore
            if (a.title > b.title) {
                return 1;
            }
        }

        if (a.isLeaf && !b.isLeaf) {
            return 1;
        }

        // both file order
        if (a.isLeaf && b.isLeaf) {
            // @ts-ignore
            if (a.title > b.title) {
                return 1;
            }
        }

        return -1;
    });
}
