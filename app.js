var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    let pathname = q.pathname;

    // Handle static files (CSS, JS, images, etc.)
    let extname = path.extname(pathname);
    if (extname) {
        let staticFile = path.join(__dirname, 'public', pathname);
        fs.readFile(staticFile, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            let contentType = 'text/plain';
            if (extname === '.css') contentType = 'text/css';
            else if (extname === '.js') contentType = 'application/javascript';
            else if (extname === '.png') contentType = 'image/png';
            else if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
            else if (extname === '.svg') contentType = 'image/svg+xml';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
        return;
    }

    if (req.method === 'POST' && pathname === '/dosen/create') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            let data = new URLSearchParams(body);
            let name = data.get('name');
            let nik = data.get('nik');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>Data Dosen</h1>
                <p><strong>Nama:</strong> ${name}</p>
                <p><strong>NIK:</strong> ${nik}</p>
                <a href="/?menu=dosen">Kembali</a>
            `);
        });
        return;
    }


    // Handle routing via query param ?menu=
    let pathQuery = q.query.menu;
    let fileLocation;
    switch (pathQuery) {
        case undefined:
        case '/':
        case 'home':
            fileLocation = 'pages/dashboard.html';
            break;
        case 'dosen':
            fileLocation = 'pages/dosen/index.html';
            break;
        case 'dosen-create':
            fileLocation = 'pages/dosen/create.html';
            break;
        case 'dosen-edit':
            fileLocation = 'pages/dosen/edit.html';
            break;
        case 'mahasiswa':
            fileLocation = 'pages/mahasiswa/index.html';
            break;
        case 'mahasiswa-create':
            fileLocation = 'pages/mahasiswa/create.html';
            break;
        case 'mahasiswa-edit':
            fileLocation = 'pages/mahasiswa/edit.html';
            break;
        default:
            fileLocation = 'pages/dashboard.html';
    }

    fs.readFile(fileLocation, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});
