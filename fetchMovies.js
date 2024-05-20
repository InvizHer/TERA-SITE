const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

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
    fetchAndStoreMovies();
}).catch(err => {
    console.error(err);
});

async function fetchAndStoreMovies() {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const messages = response.data.result;

        const movies = messages
            .filter(message => message.message && message.message.video)
            .map(message => ({
                name: message.message.caption || 'Untitled',
                fileId: message.message.video.file_id
            }));

        await Movie.insertMany(movies);
        console.log('Movies stored successfully');
    } catch (error) {
        console.error('Error fetching or storing movies:', error);
    } finally {
        mongoose.connection.close();
    }
}
