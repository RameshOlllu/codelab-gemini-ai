require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

const GeminiInterface = require('./gemini/ai_interface.js');
const gemini = new GeminiInterface();
const getJsonData = require('./utils/jsonreader.js');

app.use(cors());  // Add cors middleware
app.use(express.json());  // Add JSON parsing middleware

// Route to handle GET requests to the root path (/)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/gemini', async (req, res) => {
    try{
    console.log('Hello Gemini');
    let output = await gemini.generateStory(req.query.prompt);
    res.send(output);
} catch (error) {
    console.error('Error during /greet:', error);
    res.status(500).send('An error occurred while processing your request.');
}
});

app.post('/gemini/suggest', async (req, res) => {
    let grades = req.body.grades;
    if(!grades) {
        grades = getJsonData('student1.json');
    }

    const prompt = `
        I have json data of my grades for each topic in a subject of different examinations.
        
        **Json Data: ** ${grades}

        1. Analyze the data in detail and tell me what should I do to improve myself.
        2. Do any kinf of calculations and show me the data instead of asking me to calculate.
        3. Make sure you send the entire response strictly in html.
    `;
    // console.log(prompt)

    try {
        let output = await gemini.generateStory(prompt);
        res.send(output);
    } catch (error) {
        console.log(error);
        res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Error</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #dc3545;
                }
                p {
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <h1>Oops! An error occurred.</h1>
            <p>Sorry, something went wrong while processing your request.</p>
        </body>
        </html>
    `);
    }

    
});

app.post('/gemini/quiz', async (req, res) => {
    let topics = req.body.topics;
    let sampleJson = getJsonData('SampleJson.json');

    const prompt = `
        I have a list of topics and example json response, based on the topics given and structure of the example json response generate only one quiz for each topic.
        
        **Topics: ** ${topics}

        **Example Json Response: ** ${sampleJson}

        1. Each quiz must contain a maximum of 5 questions.
        2. For each quiz generate quizTitle, quizDescription, topicName, imageURL (any related image from the web and image URL related to the topic that ends with .png, .jpg, or .jpeg.) and array of objects questions.
        3. The question object should contain questionNumber, questionText, choices (Must be an array of length 4), correctChoice (must be in choices array), reason (reson why the correctChoice is the right one), links(Array of links which can be used to learn more about the question).
        4. The instructions I have follow the structure of the example json, So follow the structure of the given example json and generate the quiz for each topic.
        5. Make sure you send the entire response strictly in json.
        6. Strictly generate one quiz for given topic.
        7. In the response do not include characters like single quotes(') or any other special characters which can break the dart code while parsing the response.
    `;
    // console.log(prompt)

    try {
        let output = await gemini.generateStory(prompt);
        res.send(output);
    } catch (error) {
        console.log(error);
        res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Error</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #dc3545;
                }
                p {
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <h1>Oops! An error occurred.</h1>
            <p>Sorry, something went wrong while processing your request.</p>
        </body>
        </html>
    `);
    }

    
});

app.post('/gemini/learningpath', async (req, res) => {
    let studentData = req.body;
    let sampleJson = getJsonData('LearningPath.json');

    const prompt = `
        Based on the topic title generate a learning path based on given example json response.
        
        **StudentData: ** ${studentData}

        **Example Json Response: ** ${sampleJson}

        1. Follow the structure of the given example json and generate the response.
        2. Make sure you send the entire response strictly in json.
    `;
    // console.log(prompt)

    try {
        let output = await gemini.generateStory(prompt);
        res.send(output);
    } catch (error) {
        console.log(error);
        res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Error</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #dc3545;
                }
                p {
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <h1>Oops! An error occurred.</h1>
            <p>Sorry, something went wrong while processing your request.</p>
        </body>
        </html>
    `);
    }
});

app.post('/gemini/ideas', async (req, res) => {
    let studentData = req.body;
    let sampleJson = getJsonData('ideas.json');

    const prompt = `
        Analyze the provided student data and generate personalized recommendations. Consider the user's learning history, performance, and demographics to suggest suitable learning paths, areas for improvement, and potential topics of interest. Provide recommendations in a structured format as provided in the sample response, including topic suggestions, learning resource recommendations, and performance improvement strategies
        
        **StudentData: ** ${studentData}

        **Example Json Response: ** ${sampleJson}

        1. Strictly follow the structure of the given example json to generate the response.
        2. Make sure you send the entire response strictly in json.
    `;
    // console.log(prompt)

    try {
        let output = await gemini.generateStory(prompt);
        res.send(output);
    } catch (error) {
        console.log(error);
        res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Error</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #dc3545;
                }
                p {
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <h1>Oops! An error occurred.</h1>
            <p>Sorry, something went wrong while processing your request.</p>
        </body>
        </html>
    `);
    }
});

// Start the server and listen for connections on the specified port
app.listen(port, () => {
  console.log(`New Server is listening on port ${port}`);
});
