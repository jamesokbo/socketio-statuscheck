var async = require('async');
var timeoutCallback = require('timeout-callback');
var errors = require('errors.js')


module.exports = function(socket, type, loopTimeout,socketTimeout){
    var status=true;
    
    if(!loopTimeout){
        loopTimeout=5000;
    }
    if(!socketTimeout){
        socketTimeout=5000;
    }
    
    if(type=="client"){
        socket.on('statuscheck',function(fn){
            fn(true);
        });
    }
    else if(type=="server"){
        async.whilst(
            function(){return status},
            function(callback){
                socket.emit('statuscheck',timeoutCallback(socketTimeout,function(err,res){
                    if(err){
                        socket.disconnect();
                        status=false;
                    }
                    console.log("socket connected: "+res);
                    callback();
                }));
            }
        );
    }
    else{
        throw errors.e01;
    }
};
