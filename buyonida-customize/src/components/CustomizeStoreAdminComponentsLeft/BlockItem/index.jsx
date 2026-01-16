import "./index.scss";
import { useState } from "react";
import { blockIcons } from "/src/assets/block-icons/map.js";
import { resolveSectionIcon } from "/src/assets/section-icons/resolveSectionIcon.js";
import chevron from "/src/assets/icons/chevron1.svg";

function BlockItem({
                       id,
                       parentId = null,
                       type,              // page | zone | section | block
                       zone = "main",
                       blockType = null,  // button | group | text ...
                       label,
                       children = [],
                       isActive = false,
                       onSelect,
                       onDelete
                   }) {
    const isContainer = Array.isArray(children) && children.length > 0;

    const isCollapsible =
        isContainer && (type === "section" || blockType === "group");

    const [expanded, setExpanded] = useState(true);

    let IconSrc = null;

    if (type === "section") {
        IconSrc = resolveSectionIcon(zone);
    }

    if (type === "block") {
        IconSrc = blockIcons[blockType] || blockIcons.icon;
    }

    const showIcon = type !== "page";

    const handleHeaderClick = (e) => {
        e.stopPropagation();

        onSelect?.({
            id,
            parentId,
            type,
            zone,
            blockType,
        });

        if (isCollapsible) {
            setExpanded((p) => !p);
        }
    };

    // PAGE node render olunmur, children-i qaytarır
    if (type === "page") {
        return (
            <>
                {children.map((child) => (
                    <BlockItem
                        key={child.id}
                        {...child}
                        parentId={id}
                        onSelect={onSelect}
                        onDelete={onDelete}
                    />
                ))}
            </>
        );
    }

    return (
        <section
            id="blockItem"
            className={`${type} ${isActive ? "active" : ""}`}
        >
            <div
                className="blockItemHeader"
                onClick={handleHeaderClick}
            >
                {isCollapsible && (
                    <img
                        src={chevron}
                        className={`chevron ${expanded ? "open" : ""}`}
                        draggable={false}
                    />
                )}

                {showIcon && IconSrc && (
                    <img
                        src={IconSrc}
                        className="blockIcon"
                        draggable={false}
                    />
                )}

                <span className="blockLabel">{label}</span>

                {/* ✅ SECTION DELETE (announcement bar və digərləri) */}
                {type === "section" && (
                    <button
                        className="deleteSectionBtn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.({ id, type: "section" });
                        }}
                    >
                        ×
                    </button>
                )}

                {/* ✅ BLOCK DELETE (button, text, group...) */}
                {type === "block" && (
                    <button
                        className="deleteBlockBtn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.({ id, type: "block" });
                        }}
                    >
                        ×
                    </button>
                )}
            </div>

            {expanded && isContainer && (
                <div className="blockChildren">
                    {children.map((child) => (
                        <BlockItem
                            key={child.id}
                            {...child}
                            parentId={id}
                            onSelect={onSelect}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default BlockItem;
