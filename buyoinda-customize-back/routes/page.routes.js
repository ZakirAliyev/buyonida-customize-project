const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const HomePage = require("../models/pages/HomePage");

const router = express.Router();

/**
 * GET — Home page data (MongoDB-dən oxuyur)
 */
router.get("/page/home", async (req, res) => {
    try {
        const home = await HomePage.findOne({ page: "home" });
        res.json(home);
    } catch (e) {
        res.status(500).json({ message: "Error loading page" });
    }
});

/**
 * INIT — ilk dəfə home page yaradılması
 * (yalnız bir dəfə çağırılır)
 */
router.post("/page/home/init", async (req, res) => {
    try {
        const exists = await HomePage.findOne({ page: "home" });

        if (exists) return res.json(exists);

        const created = await HomePage.create({
            page: "home",
            sections: [
                {
                    id: 1,
                    type: "section",
                    settings: {},
                    blocks: []
                }
            ]
        });

        res.json(created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Init failed" });
    }
});

/**
 * ADD BLOCK
 */
router.post("/page/home/add/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const { parentId } = req.body;

        let home = await HomePage.findOne({ page: "home" });

        const componentDir = path.join(__dirname, `../components/${type}`);
        const template = fs.readFileSync(path.join(componentDir, "template.liquid"), "utf8");
        const schema = JSON.parse(
            fs.readFileSync(path.join(componentDir, "schema.json"), "utf8")
        );

        const newBlock = {
            id: crypto.randomUUID(),
            type,
            template,
            settings: schema.settings,
            ...(type === "group" ? { children: [] } : {})
        };

        const blocks = home.sections[0].blocks;

        function findBlock(list, id) {
            for (const b of list) {
                if (b.id === id) return b;
                if (b.children) {
                    const f = findBlock(b.children, id);
                    if (f) return f;
                }
            }
            return null;
        }

        if (!parentId) {
            blocks.push(newBlock);
        } else {
            const parent = findBlock(blocks, parentId);
            if (!parent)
                return res.status(400).json({ message: "Invalid parentId" });

            if (!parent.children)
                parent.children = [];
            parent.children.push(newBlock);
        }

        await home.save();
        res.json(home);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Add block failed" });
    }
});

/**
 * DELETE BLOCK
 */
router.delete("/page/home/block/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const home = await HomePage.findOne({ page: "home" });

        function removeBlock(list, id) {
            return list.filter(b => {
                if (b.id === id) return false;
                if (b.children) b.children = removeBlock(b.children, id);
                return true;
            });
        }

        home.sections[0].blocks = removeBlock(home.sections[0].blocks, id);

        await home.save();
        res.json(home);
    } catch (e) {
        res.status(500).json({ message: "Delete failed" });
    }
});

/**
 * UPDATE BLOCK SETTINGS
 */
router.put("/page/home/block/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { settings } = req.body;

        const home = await HomePage.findOne({ page: "home" });

        function findBlock(list, id) {
            for (const b of list) {
                if (b.id === id) return b;
                if (b.children) {
                    const f = findBlock(b.children, id);
                    if (f) return f;
                }
            }
            return null;
        }

        const block = findBlock(home.sections[0].blocks, id);
        if (!block) return res.status(404).json({ message: "Not found" });

        block.settings = settings;

        home.markModified("sections");

        await home.save();
        res.json(home);
    } catch (e) {
        res.status(500).json({ message: "Update failed" });
    }
});

module.exports = router;
