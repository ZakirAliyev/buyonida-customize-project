// src/utils/treeMapper.js

export function mapBlock(block) {
    return {
        id: block.id,
        type: "block",
        blockType: block.type,
        label: block.type,
        children: (block.children || []).map(mapBlock),
    };
}

export function mapSection(section, zoneName) {
    return {
        id: section.id,
        type: "section",
        zone: zoneName,
        label:
            section.type === "announcement_bar"
                ? "Announcement bar"
                : section.type,
        children: (section.blocks || []).map(mapBlock),
    };
}

export function mapZone(zone) {
    return {
        id: zone.id,
        type: "zone",
        zone: zone.zone,
        label:
            zone.zone === "header"
                ? "Header"
                : zone.zone === "main"
                    ? "Main content"
                    : "Footer",
        children: (zone.sections || []).map(section =>
            mapSection(section, zone.zone)
        ),
    };
}

export function mapPageToTree(pageData) {
    return {
        id: "home-page",
        type: "page",
        label: "Home page",
        children: (pageData.zones || []).map(mapZone),
    };
}
