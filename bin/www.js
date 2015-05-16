/**
 * Created by jan on 15.05.15.
 */
var app = require('../app'); //Require our app

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
app.set('port', server_port);

var server = app.listen(app.get('port'),server_ip_address, function () {
    console.log('Express server listening on ip ' + server.address().);
    console.log('Express server listening on port ' + server.address().port);
});