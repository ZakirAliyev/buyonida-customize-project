import { useMemo } from "react";
import { renderBlockTree } from "../renderBlock.js";

function PreviewCanvas({
                           sections,
                           selectedId,
                           onSelect,
                           onDeleteBlock,
                           onDeleteSection
                       }) {
    const html = useMemo(() => {
        return sections
            .map(section => {
                // ✅ ANNOUNCEMENT BAR = SECTION
                if (section.type === "announcement_bar") {
                    return `
                        <div 
                            class="section-wrapper announcement-bar ${
                        section.id === selectedId ? "selected" : ""
                    }"
                            data-id="${section.id}"
                            data-kind="section"
                        >
                            <div class="section-overlay"></div>
                            <button 
                                class="delete-btn"
                                data-delete-section="${section.id}"
                            >×</button>

                            <div class="announcement-placeholder">
                                Announcement bar
                            </div>
                        </div>
                    `;
                }

                // NORMAL SECTION
                const blocksHtml = section.blocks
                    .map(block => renderBlockTree(block, selectedId))
                    .join("");

                return `
                    <div 
                        class="section-wrapper section ${
                    section.id === selectedId ? "selected" : ""
                }"
                        data-id="${section.id}"
                        data-kind="section"
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
                // ✅ DELETE SECTION
                const sectionId = e.target.dataset.deleteSection;
                if (sectionId) {
                    onDeleteSection(sectionId);
                    return;
                }

                // ✅ DELETE BLOCK
                const blockId = e.target.dataset.deleteBlock;
                if (blockId) {
                    onDeleteBlock(blockId);
                    return;
                }

                // ✅ SELECT
                const wrapper = e.target.closest(".section-wrapper");
                if (!wrapper) return;

                onSelect(wrapper.dataset.id);
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default PreviewCanvas;
