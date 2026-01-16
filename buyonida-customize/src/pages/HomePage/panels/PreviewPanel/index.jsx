import {renderPreview} from "../../utils/previewRenderer.js";

export default function PreviewPanel({
                                         sections,
                                         selectedId,
                                         setSelectedId,
                                         deleteBlock,
                                         deleteSection
                                     }) {
    const html = renderPreview(sections, selectedId);

    return (
        <div className="preview-area">
            <div
                className="preview-canvas"
                onClick={(e) => {
                    const delId = e.target.dataset.delete;
                    const delType = e.target.dataset.deleteType;

                    if (delId && delType === "block") deleteBlock(delId);
                    if (delId && delType === "section") deleteSection(delId);

                    const wrapper = e.target.closest(".section-wrapper");
                    if (wrapper) setSelectedId(wrapper.dataset.id);
                }}
                dangerouslySetInnerHTML={{__html: html}}
            />
        </div>
    );
}
