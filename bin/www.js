/**
 * Created by jan on 15.05.15.
 */
var app = require('../app'); //Require our app

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});