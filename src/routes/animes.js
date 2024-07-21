
import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerAnime = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const animesFilePath = path.join(_dirname, "../../data/animes.json");

const readAnimesFs = async () => {
    try {
        const animes = await fs.readFile(animesFilePath, "utf8");
        return JSON.parse(animes);
    } catch (err) {
        throw new Error(`Error reading file: ${err.message}`);
    }
};

const writeAnimesFs = async (animes) => {
    try {
        await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2), "utf8");
    } catch (err) {
        throw new Error(`Error writing file: ${err.message}`);
    }
};

// POST /animes
routerAnime.post("/", async (req, res) => {
    try {
        const animes = await readAnimesFs();
        const newAnime = {
            id: animes.length + 1,
            title: req.body.title,
            genre: req.body.genre,
            studioId: req.body.studioId
        };

        animes.push(newAnime);
        await writeAnimesFs(animes);
        res.status(201).json({
            message: "Anime created successfully",
            anime: newAnime
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /animes
routerAnime.get("/", async (req, res) => {
    try {
        const animes = await readAnimesFs();
        res.json(animes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /animes/:id
routerAnime.get("/:animeId", async (req, res) => {
    try {
        const animes = await readAnimesFs();
        const anime = animes.find(a => a.id === parseInt(req.params.animeId, 10));
        if (!anime) return res.status(404).json({ message: "Anime not found" });
        res.json(anime);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /animes/:id
routerAnime.put("/:id", async (req, res) => {
    try {
        const animes = await readAnimesFs();
        const indexAnime = animes.findIndex(a => a.id === parseInt(req.params.id, 10));
        if (indexAnime === -1) return res.status(404).json({ message: "Anime not found" });

        const updatedAnime = {
            ...animes[indexAnime],
            title: req.body.title,
            genre: req.body.genre
        };

        animes[indexAnime] = updatedAnime;
        await writeAnimesFs(animes);
        res.json({
            message: "Anime updated successfully",
            anime: updatedAnime
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /animes/:id
routerAnime.delete("/:id", async (req, res) => {
    try {
        const animes = await readAnimesFs();
        const animeIndex = animes.findIndex(a => a.id === parseInt(req.params.id, 10));
        if (animeIndex === -1) return res.status(404).json({ message: "Anime not found" });

        animes.splice(animeIndex, 1);
        await writeAnimesFs(animes);
        res.json({ message: "Anime deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default routerAnime;
