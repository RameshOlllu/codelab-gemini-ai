import express from 'express';
import { VertexAI } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

const auth = new GoogleAuth();

app.get('/greet', async (req, res) => {
    try {
        const project = await auth.getProjectId();

        const vertex = new VertexAI({ project: project });
        const generativeModel = vertex.getGenerativeModel({
            model: 'gemini-1.5-flash'
        });

        const animal = req.query.animal || 'dog';
        const prompt = `Give me 10 fun facts about ${animal}. Return this as html without backticks.`;
        const resp = await generativeModel.generateContent(prompt);
        const html = resp.response.candidates[0].content.parts[0].text;
        res.send(html);
    } catch (error) {
        console.error('Error during /greet:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.post('/gemini-quiz', async (req, res) => {
    try {
        const project = await auth.getProjectId();

        const vertex = new VertexAI({ project: project });
        const generativeModel = vertex.getGenerativeModel({
            model: 'gemini-1.5-flash'
        });

        const topic = req.body.topic;
        if (!topic) {
            return res.status(400).send('Invalid request: Missing "topic" in JSON body.');
        }

        // Use a single-line template literal or concatenation for the prompt
        const prompt = 
            'Generate a JSON response that includes a single quiz overview for the topic "' + topic + '". ' +
            'The JSON should include: ' +
            '1. quizTitle: A title related to the topic. ' +
            '2. quizDescription: A brief description of the quiz. ' +
            '3. topicName: The name of the topic. ' +
            '4. imageUrl: A valid image URL related to the topic that ends with .png, .jpg, or .jpeg. ' +
            '5. questions: A list of 5 questions related to the topic. ' +
            'Each question should include: ' +
            '- questionNumber: A sequential number starting from 1. ' +
            '- questionText: The text of the question. ' +
            '- choices: A list of 4 multiple-choice answers. ' +
            '- correctChoice: The correct answer. ' +
            '- reason: A brief explanation of why the correct answer is correct. ' +
            '- links: A list of URLs where the user can learn more about the question.';

        const resp = await generativeModel.generateContent(prompt);
        const responseText = resp.response.candidates[0].content.parts[0].text;

        // Directly send the responseText without parsing it
        res.send(responseText);
    } catch (error) {
        console.error('Error during /gemini-quiz:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`codelab-geminiai: listening on port ${port}`);
});