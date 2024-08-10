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
        const prompt = `Give me 10 fun facts about ${animal}. Return this as html without backticks.`
        const resp = await generativeModel.generateContent(prompt);
        const html = resp.response.candidates[0].content.parts[0].text;
        res.send(html);
    } catch (error) {
        console.error('Error during /greet:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.post('/gemini-instruction', async (req, res) => {
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

        const prompt = `
            Generate a JSON response that includes a single quiz overview for the topic "${topic}". 
            The JSON should include:
            1. quizTitle: A title related to the topic.
            2. quizDescription: A brief description of the quiz.
            3. topicName: The name of the topic.
            4. imageUrl: A valid image URL related to the topic that ends with .png, .jpg, or .jpeg.
            5. questions: A list of 5 questions related to the topic.
            Each question should include:
              - questionNumber: A sequential number starting from 1.
              - questionText: The text of the question.
              - choices: A list of 4 multiple-choice answers.
              - correctChoice: The correct answer.
              - reason: A brief explanation of why the correct answer is correct.
              - links: A list of URLs where the user can learn more about the question.
              
            Format the JSON response exactly like this example:

            {
              "QuizOverviews": [
                {
                  "quizTitle": "Elasticsearch Fundamentals",
                  "quizDescription": "Test your knowledge of Elasticsearch basics, including indexing, searching, and querying.",
                  "topicNAME": "Elastic Search",
                  "imageUrl": "https://www.elastic.co/blog/wp-content/uploads/2021/03/elasticsearch-logo.png",
                  "questions": [
                    {
                      "questionNumber": 1,
                      "questionText": "What is Elasticsearch primarily used for?",
                      "choices": [
                        "Storing and retrieving data",
                        "Building web applications",
                        "Managing databases",
                        "Analyzing network traffic"
                      ],
                      "correctChoice": "Storing and retrieving data",
                      "reason": "Elasticsearch is a search and analytics engine designed for storing and retrieving data quickly and efficiently.",
                      "links": [
                        "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html"
                      ]
                    },
                    {
                      "questionNumber": 2,
                      "questionText": "What is a document in Elasticsearch?",
                      "choices": [
                        "A single row in a table",
                        "A collection of related data",
                        "A file stored on disk",
                        "A unit of code"
                      ],
                      "correctChoice": "A collection of related data",
                      "reason": "A document in Elasticsearch represents a unit of data, typically a JSON object, containing information about a specific entity.",
                      "links": [
                        "https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html"
                      ]
                    },
                    {
                      "questionNumber": 3,
                      "questionText": "What is an index in Elasticsearch?",
                      "choices": [
                        "A data structure for storing documents",
                        "A query language for searching data",
                        "A type of data field",
                        "A network connection"
                      ],
                      "correctChoice": "A data structure for storing documents",
                      "reason": "An index in Elasticsearch is a logical grouping of documents, similar to a database table.",
                      "links": [
                        "https://www.elastic.co/guide/en/elasticsearch/reference/current/indices.html"
                      ]
                    },
                    {
                      "questionNumber": 4,
                      "questionText": "What is a shard in Elasticsearch?",
                      "choices": [
                        "A physical partition of an index",
                        "A logical grouping of documents",
                        "A type of data field",
                        "A network connection"
                      ],
                      "correctChoice": "A physical partition of an index",
                      "reason": "Shards are used to distribute data across multiple nodes, improving scalability and performance.",
                      "links": [
                        "https://www.elastic.co/guide/en/elasticsearch/reference/current/shard.html"
                      ]
                    },
                    {
                      "questionNumber": 5,
                      "questionText": "What is a replica in Elasticsearch?",
                      "choices": [
                        "A copy of a shard",
                        "A type of data field",
                        "A network connection",
                        "A query language"
                      ],
                      "correctChoice": "A copy of a shard",
                      "reason": "Replicas provide redundancy and fault tolerance, ensuring data availability even if a node fails.",
                      "links": [
                        "https://www.elastic.co/guide/en/elasticsearch/reference/current/replica.html"
                      ]
                    }
                  ]
                }
              ]
            }
        `;

        const resp = await generativeModel.generateContent(prompt);
        const responseText = resp.response.candidates[0].content.parts[0].text;
        res.json(JSON.parse(responseText)); // Parse the response to JSON and send it
    } catch (error) {
        console.error('Error during /gemini-instruction:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`codelab-geminiai: listening on port ${port}`);
});