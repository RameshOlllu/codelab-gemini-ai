import express from 'express';
const app = express();

import { VertexAI } from '@google-cloud/vertexai';

import { GoogleAuth } from 'google-auth-library';
const auth = new GoogleAuth();

app.get('/greet', async (req, res) => {
    const project = await auth.getProjectId();

    const vertex = new VertexAI({ project: project });
    const generativeModel = vertex.getGenerativeModel({
        model: 'gemini-1.5-flash'
    });

    const animal = req.query.animal || 'dog';
    const prompt = `Give me 10 fun facts about ${animal}. Return this as html without backticks.`
    const resp = await generativeModel.generateContent(prompt);
    const html = resp.response.candidates[0].content.parts[0].text;
    res.send(html);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`codelab-geminiai: listening on port ${port}`);
});