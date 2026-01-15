import { useState } from "react";

export function useBlockSelection(sections) {
    const [selectedId, setSelectedId] = useState(null);

    function findBlock(blocks, id) {
        for (const block of blocks) {
            if (block.id === id) return block;
            if (block.children?.length) {
                const found = findBlock(block.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    const selectedBlock =
        selectedId && sections?.length
            ? findBlock(sections[0].blocks, selectedId)
            : null;

    return {
        selectedId,
        setSelectedId,
        selectedBlock
    };
}
