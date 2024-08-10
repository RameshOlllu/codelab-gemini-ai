import express from 'express';

const app = express();
app.get('/', async (req, res) => {
    res.send('Hello world! Start using gemini AI');
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`codelab-gemini-ai: listening on port ${port}`);
});