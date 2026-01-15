import { useState } from "react";

export function useBlockSelection(sections) {
    const [selectedId, setSelectedId] = useState(null);

    function findBlock(blocks, id) {
        for (const block of blocks) {
            if (block.id === id) {
                return { kind: "block", data: block };
            }
            if (block.children?.length) {
                const found = findBlock(block.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    function findSection(sections, id) {
        for (const section of sections) {
            if (section.id === id) {
                return { kind: "section", data: section };
            }
        }
        return null;
    }

    let selectedItem = null;

    if (selectedId && sections?.length) {
        selectedItem =
            findSection(sections, selectedId) ||
            findBlock(sections[0]?.blocks || [], selectedId);
    }

    return {
        selectedId,
        setSelectedId,
        selectedItem
    };
}
