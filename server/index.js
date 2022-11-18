const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const path = require('path');

const fs = require('fs');

const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');

const data = require('./data.json');
const renderMarkup = (str) => {
    const dataScript = `<script>window.initialData = ${JSON.stringify(data)}</script>`
    return template.replace('<!--HTML_PLACEHOLDER-->', str).replace('<!-- INITIAL_DATA_PLACEHOLDER -->', dataScript);
}

const server = (port) => {
    const app = express();
    app.use(express.static('dist'));
    app.get('/search', (req, res) => {
        res.status(200).send(renderMarkup(renderToString(SSR)));
    });

    app.listen(port, () => {
        console.log('server is running on port: ' + port);
    });
}
server(process.env.PORT || 3000);
