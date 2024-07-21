import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.handler.js';
import routerAnime from './routes/animes.js';
import routerStudio from './routes/studios.js';
import routerDirector from './routes/director.js';
import routerCharacter from './routes/character.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use('/animes', routerAnime);
app.use('/studios', routerStudio);
app.use('/director', routerDirector);
app.use('/character', routerCharacter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`El puerto está siendo escuchado correctamente en http://localhost:${PORT}`)
});