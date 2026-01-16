import {useMemo} from "react";
import {findBlock} from "../utils/blockFinder";

export function useSelection(selectedId, sections) {
    const selectedSectionId = useMemo(() => {
        if (!selectedId) return null;

        const direct = sections.find(s => s.id === selectedId);
        if (direct) return direct.id;

        for (const sec of sections) {
            if (findBlock(sec.blocks ?? [], selectedId)) {
                return sec.id;
            }
        }
        return null;
    }, [selectedId, sections]);

    const selectedBlock = useMemo(() => {
        if (!selectedId) return null;
        for (const sec of sections) {
            const found = findBlock(sec.blocks ?? [], selectedId);
            if (found) return found;
        }
        return null;
    }, [selectedId, sections]);

    return {selectedSectionId, selectedBlock};
}
