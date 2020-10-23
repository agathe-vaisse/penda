const express = require('express')
const languageJson = require('./backend-data/languages');
const randomWords = require('./backend-data/random-words.json');
const app = express()
const port = 8080

app.get('/api/languages', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(languageJson)
})

app.post('/api/words', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    const randomWord = randomWords[req.query.language];
    res.send(`{"value":"${randomWord}"}`)
})

app.listen(port, () => {
    console.log(`Fake language API listening at http://localhost:${port}`)
})
