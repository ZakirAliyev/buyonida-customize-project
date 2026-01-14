const icons = import.meta.glob("./*.svg", { eager: true });

export const blockIcons = Object.fromEntries(
    Object.entries(icons).map(([path, mod]) => {
        const name = path.split("/").pop().replace(".svg", "");
        return [name, mod.default];
    })
);
