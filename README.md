async.js
========

a very simple async task for js(node, browser)


## Example

    AsyncJS.queue()
        .add(function(done){
            setTimeout(function(){
                console.log('1000: aaaaaaaa');
                done();
            }, 1000);
        })
        .add(function(done){
            setTimeout(function(){
                console.log('500: bbbbbbbbb');
                done();
            }, 500);
        }, function(done){
            setTimeout(function(){
                console.log('1500: cccccccc');
                done();
            }, 1500);
        })
        .done(function(){
            console.log('done........');
        })
        .done(function(){
            console.log('done222222222');

        })
        .run();

##

    AsyncJS.queue(function(done){
            setTimeout(function(){
                console.log('1000: aaaaaaaa');
                done();
            }, 1000);
        }, function(done){
            setTimeout(function(){
                console.log('500: bbbbbbbbb');
                done();
            }, 500);
        }, function(done){
            setTimeout(function(){
                console.log('1500: cccccccc');
                done();
            }, 1500);
        })
        .done(function(){
            console.log('done........');
        }, function(){
            console.log('done222222222');

        })
        .run();
