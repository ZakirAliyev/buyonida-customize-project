import {renderLiquid} from "../../../theme/engine/renderLiquid";

export function renderBlock(block, selectedId) {
    const childrenHtml = block.children?.map(b => renderBlock(b, selectedId)).join("") ?? "";

    const flexDirection = block.settings?.direction === "horizontal" ? "row" : "column";

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
            <button class="delete-btn" data-delete="${block.id}" data-delete-type="block">×</button>
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

export function renderPreview(sections, selectedId) {
    return sections.map(section => {
        if (section.type === "announcement_bar") {
            return `
                <div class="announcement-bar section-wrapper ${section.id === selectedId ? "selected" : ""}"
                     data-id="${section.id}">
                    <div class="section-overlay"></div>
                    <button class="delete-btn" data-delete="${section.id}" data-delete-type="section">×</button>
                    <div class="announcement-content">
                        ${section.settings?.text ?? "Announcement bar"}
                    </div>
                </div>
            `;
        }

        return (section.blocks ?? []).map(b => renderBlock(b, selectedId)).join("");
    }).join("");
}
