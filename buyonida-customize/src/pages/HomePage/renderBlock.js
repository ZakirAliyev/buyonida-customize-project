import { renderLiquid } from "../../theme/engine/renderLiquid.js";

export function renderBlockTree(block, selectedId) {
    let childrenHtml = "";

    if (block.children?.length) {
        childrenHtml = block.children
            .map(child => renderBlockTree(child, selectedId))
            .join("");
    }

    const flexDirection =
        block.settings?.direction === "horizontal" ? "row" : "column";

    const alignItems =
        block.settings?.alignment === "left"
            ? "flex-start"
            : block.settings?.alignment === "center"
                ? "center"
                : "flex-end";

    const justifyContent =
        block.settings?.position === "left"
            ? "flex-start"
            : block.settings?.position === "center"
                ? "center"
                : "flex-end";

    return `
        <div class="section-wrapper ${block.id === selectedId ? "selected" : ""}" data-id="${block.id}">
            <div class="section-overlay"></div>
            <button class="delete-btn" data-delete="${block.id}">×</button>
            ${renderLiquid(block.template, {
        ...block.settings,
        flexDirection,
        alignItems,
        justifyContent,
        target: block.settings?.newTab ? "_blank" : "",
        children: childrenHtml
    })}
        </div>
    `;
}
