    var testQueue = function(){
        console.log('>>>AsyncJS test 1');
        AsyncJS.queue().next(function(){
            var that = this;
            console.log('1. exec ajax function');
            setTimeout(function(){
                console.log('1. exec ajax function done.');
                that.done('ajax', { a: 1});
            }, 500);
        }, function(){
            var that = this;
            console.log('1. exec ajax 2 function');
            setTimeout(function(){
                console.log('1. exec ajax 2 function done.');
                that.done('ajax2', { c: 3 });
            }, 1500);
        }).next(function(){
            var that = this;
            console.log('1. exec delay function');
            console.log('1. print ajax data', this.data['ajax']);
         
            setTimeout(function(){
                console.log('1. exec delay function done.');
                that.done('setTimeout', { b: 2 });
            }, 1000);
         
        }).done(function(){
            console.log('1. exec done function');
            console.log('1. all data', this.data['ajax'], this.data['setTimeout']);
        }).done(function(){
            console.log('1. exec another done function');
        }).start();
    }

    var testArray = function(){
        console.log('>>>AsyncJS test 2');
        AsyncJS.array().add(function(){
            var that = this;
            console.log('2. exec ajax function');
            setTimeout(function(){
                console.log('2. exec ajax function done.');
                that.done('ajax', { a: 1});
            }, 500);
        }, function(){
            var that = this;
            console.log('2. exec ajax 2 function');
            setTimeout(function(){
                console.log('2. exec ajax 2 function done.');
                that.done('ajax2', { c: 3 });
            }, 1500);
        }).add(function(){
            var that = this;
            console.log('2. exec delay function');
            console.log('2. print ajax data', this.data['ajax']);
         
            setTimeout(function(){
                console.log('2. exec delay function done.');
                that.done('setTimeout', { b: 2 });
            }, 1000);
         
        }).done(function(){
            console.log('2. exec done function');
            console.log('2. all data', this.data['ajax'], this.data['setTimeout']);
        }).done(function(){
            console.log('2. exec another done function');
        }).start();
    }

    var test = function(){
        // test 1
         testQueue();

        // test 2
        testArray();
    }
    
