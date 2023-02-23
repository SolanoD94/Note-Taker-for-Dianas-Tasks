const express = require('express');
const fs = require('fs');
const path = require('path'); 
const db = require('./db/db.json');
const uuid = require('./helpers/uuid');
const {readFromFile, writeToFile, readAndAppend} = require('./helpers/fsUtils');

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for Notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for Api Json file
app.get('/api/notes', (req, res) =>{
    res.json(db);
    console.info(`${req.method} request received`);
});


// POST route for Api Json file
app.post('/api/notes', (req, res) =>{
  
  console.info(`${req.method} request received`);

    const {title, text} = req.body;
    if (req.body) {
          const newNote = {
            title,
            text,
            note_id: uuid(),
          };

          readAndAppend(newNote, './db/db.json');
          
          const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);

          res.status(201).json(response);
        } else {
          res.status(500).json('Error in posting note. Note must have a title and some body text.');
        }

});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);