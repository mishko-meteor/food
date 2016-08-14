var express = require('express');
var app = express();


app.use(express.static(__dirname + '/'));


app.listen(3030, function () {
    console.log('app is up and running at port 3030');
});
