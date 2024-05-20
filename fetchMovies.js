const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = "mongodb+srv://codexun:TeamCodexun07@codexun.egmx5.mongodb.net/?retryWrites=true&w=majority";
const TELEGRAM_BOT_TOKEN = "6951265744:AAFbjyOh4wjIGqx4yRPgdEJp1MWgvf3MUZI";
const TELEGRAM_CHANNEL_ID = "-1001580057771";

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
