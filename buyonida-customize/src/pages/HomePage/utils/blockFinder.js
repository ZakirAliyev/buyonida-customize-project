export function findBlock(blocks, id) {
    for (const block of blocks) {
        if (block.id === id) return block;
        if (block.children?.length) {
            const found = findBlock(block.children, id);
            if (found) return found;
        }
    }
    return null;
}
