import { sectionIcons } from "./sectionIcons";

export function resolveSectionIcon(zone) {
    return sectionIcons[zone] || sectionIcons.template;
}
