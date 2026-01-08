export function renderLiquid(template, data) {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
        return data[key] ?? "";
    });
}
