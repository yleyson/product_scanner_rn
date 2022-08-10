const TextRouter = require('express').Router();

// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');
require('dotenv').config();

// Creates a client

const CONFIG = {
    credentials: {
        private_key: process.env.API_KEY,
        client_email: process.env.CLIENT_EMAIL
    }
}


const client = new vision.ImageAnnotatorClient(CONFIG);



TextRouter.post('/', async (req, res) => {
    console.log(req.body.text)
    let text = ""

    const request2 = {
        image: {
            content: req.body.text
        }
    };

    const request = {
        "requests": [
            {
                "image": {
                    "content": req.body.text
                },
                "features": [
                    {
                        "type": "DOCUMENT_TEXT_DETECTION"
                    }
                ],
                "imageContext": {
                    "languageHints": ["iw"]
                }
            }
        ]
    };

    await client
        .batchAnnotateImages(request)
        .then(response => {
            let [result] = response
            const detections = result.responses[0].fullTextAnnotation;
            console.log(detections.text)
            res.status(201).json(detections.text);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ err });
        });

});

module.exports = TextRouter;
