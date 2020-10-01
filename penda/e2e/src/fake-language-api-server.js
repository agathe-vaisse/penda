const express = require('express')
const languageJson = require('./backend-data/languages');
const app = express()
const port = 8080

app.get('/api/languages', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(languageJson)
})

app.listen(port, () => {
    console.log(`Fake language API listening at http://localhost:${port}`)
})
