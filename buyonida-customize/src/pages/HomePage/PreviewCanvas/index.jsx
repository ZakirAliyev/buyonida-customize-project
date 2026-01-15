import { useMemo } from "react";
import { renderBlockTree } from "../renderBlock.js";

function PreviewCanvas({
                           sections,
                           selectedId,
                           onSelect,
                           onDelete
                       }) {
    const html = useMemo(() => {
        return sections
            .map(section => {
                if (section.type === "announcement_bar") {
                    return `
                        <div 
                            class="section-wrapper announcement-bar ${
                        section.id === selectedId ? "selected" : ""
                    }"
                            data-id="${section.id}"
                        >
                            <div class="section-overlay"></div>
                            <button class="delete-btn" data-delete="${section.id}">×</button>

                            <div class="announcement-placeholder">
                                Announcement bar
                            </div>
                        </div>
                    `;
                }

                const blocksHtml = section.blocks
                    .map(block => renderBlockTree(block, selectedId))
                    .join("");

                return `
                    <div 
                        class="section-wrapper section ${
                    section.id === selectedId ? "selected" : ""
                }"
                        data-id="${section.id}"
                    >
                        <div class="section-overlay"></div>
                        ${blocksHtml}
                    </div>
                `;
            })
            .join("");
    }, [sections, selectedId]);

    return (
        <div
            className="preview-canvas"
            onClick={(e) => {
                const delId = e.target.dataset.delete;
                if (delId) {
                    onDelete(delId);
                    return;
                }

                const wrapper = e.target.closest(".section-wrapper");
                if (!wrapper) return;

                onSelect(wrapper.dataset.id);
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default PreviewCanvas;
