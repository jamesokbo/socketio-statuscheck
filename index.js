var async = require('async');
var timeoutCallback = require('timeout-callback');

module.exports = function(socket, type, loopTimeout,socketTimeout){
    var status=true;
    
    if(!loopTimeout){
        loopTimeout=10000;
    }
    if(!socketTimeout){
        socketTimeout=10000;
    }
    
    if(type=="client"){
        socket.on('statuscheck',function(fn){
            fn(null,true);
        });
    }
    else if(type=="server"){
        async.whilst(
            function(){return status},
            function(callback){
                setTimeout(function(){
                    socket.emit('statuscheck',timeoutCallback(socketTimeout,function(err,res){
                        if(err){
                            socket.disconnect();
                            status=false;
                        }
                        callback();
                    }));
                },loopTimeout);
            }
        );
    }
    else{
        throw Error("Type must be specified; either 'client' or 'server'");
    }
};
