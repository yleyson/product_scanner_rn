
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

//port
const PORT = process.env.PORT || 5008;

//create server
const server = express();
server.use(express.json({
    limit: '50mb'
})); //enable json support
server.use(cors()); //enable global access
server.use(helmet()); //more defense


server.use('/api/google_text', require('./controllers/api_controller'));


server.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`)
});




