const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// Movie Schema
const movieSchema = new mongoose.Schema({
    name: String,
    fileId: String
});

const Movie = mongoose.model('Movie', movieSchema);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error(err);
});

app.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const movies = await Movie.find({ name: { $regex: query, $options: 'i' } });
        const results = movies.map(movie => ({
            name: movie.name,
            link: `https://t.me/c/${TELEGRAM_CHANNEL_ID}/${movie.fileId}`
        }));
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching movies');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
