import express from 'express';
import Connection from './db/db.js';
import cors from 'cors';
import Routes from './routes/route.js';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8000;
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Routes);

Connection();
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));