var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req, res);
            break;
    }
    function show(req, res) {
        var html = '<form method="post" action="/" enctype="multipart/form-data">\n' +
            '    <p><input type="text" name="name" /> </p>\n' +
            '    <p><input type="file" name="file" /> </p>\n' +
            '    <p><input type="submit" name="Upload" /> </p>\n' +
            '</form>';
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.end(html);
    }

    function upload(req, res) {
        if (!isFormData(req)) {
            res.statusCode = 400;
            res.end('Bad Request:expecting multipart/form-data');
            return;
        }

        var form = new formidable.IncomingForm();
        /*
        form.on('file', function (name, file) {
            console.log(name);
            console.log(file);
        });

        form.on('end', function () {
            res.end('upload complete');
        });
*/
        form.on('progress', function (bytesReceived, bytesExpected) {
            var percent = Math.floor(bytesReceived / bytesExpected) * 100;
            console.log(percent + '%');
        })
        form.parse(req, function (err, fields, files) {
            console.log(fields);
            console.log(files);
            res.end('upload complete');
        });
    }

    function isFormData() {
        var type = req.headers['content-type'] || '';
        return 0 == type.indexOf('multipart/form-data');
    }
});

server.listen(3000);

