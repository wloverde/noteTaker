const note = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { readFromFile, readAndAppend} = require('../helpers/fsUtils');
//  GET route to retrieve notes
note.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


// POST Route to submit notes
note.post('/', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (req.body) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting Note');
    }
});

note.delete('/:id', (req, res) => {
    console.log("delete started");
    readFromFile('./db/db.json').then((data) => {


    const requestedID = req.params.id;
    console.log(requestedID);
    let db = JSON.parse(data);
    let result = db.filter(element => requestedID !== element.id);

    // for (let i = 0; i < db.length; i++) {
    //     if (requestedID === db[i].id) {
    //         // return res.json(db[i]);
    //         db[i].pop;
    //     }
    // }
    fs.writeFile(`./db/db.json`, JSON.stringify(result), (err) =>
    err
      ? console.error(err)
      : console.log(
          `Deleted Successfully`
        )
    )
    return res.json('Successfully deleted');
    })
});


module.exports = note;
