import "./index.scss";
import { useState } from "react";
import { blockIcons } from "/src/assets/block-icons/map.js";
import chevron from "/src/assets/icons/chevron1.svg";

function BlockItem({
                       id,
                       parentId = null,
                       type,
                       blockType,
                       label,
                       children = [],
                       isActive = false,
                       onSelect,
                   }) {
    const isContainer = children.length > 0;
    const [expanded, setExpanded] = useState(true);

    const IconSrc = blockIcons[blockType];

    const handleHeaderClick = (e) => {
        e.stopPropagation();

        onSelect?.({ id, parentId, type });

        if (isContainer) {
            setExpanded((p) => !p);
        }
    };

    return (
        <section
            id="blockItem"
            className={`${isActive ? "active" : ""} ${type}`}
        >
            <div
                className="blockItemHeader"
                onClick={handleHeaderClick}
            >
                {isContainer && (
                    <img
                        src={chevron}
                        className={`chevron ${expanded ? "open" : ""}`}
                        alt=""
                        draggable={false}
                    />
                )}

                {IconSrc && (
                    <img
                        src={IconSrc}
                        className="blockIcon"
                        alt=""
                        draggable={false}
                    />
                )}

                <span className="blockLabel">{label}</span>
            </div>

            {expanded && isContainer && (
                <div className="blockChildren">
                    {children.map((child) => (
                        <BlockItem
                            key={child.id}
                            {...child}
                            parentId={id}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default BlockItem;
