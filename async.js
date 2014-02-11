(function(name, definition){
    if(typeof define === 'function'){
        define(definition);
    }else if(typeof module !== 'undefined'){
        module.exports = definition();
    }else{
        this[name] = definition();
    }
})('AsyncJS', function(){
    var exports = {};

    var slice = Array.prototype.slice;

    function QueueTask(){
        this.tasks = [];
        this.dones = [];
    }

    QueueTask.prototype = {
        next: function(func/*[,...]*/){
            var argus = slice.apply(arguments);
            this.tasks.push(argus);
            return this;
        },
        done: function(func){
            var argus = slice.apply(arguments);
            this.dones = this.dones.concat(argus);
            return this;
        },
        start: function(){
            var that = this,
                i, task, done;

            var context = {
                length: 0,
                data: {},
                done: function(name, result){
                    this.data[name] = result;
                    if(this.length && !this.length--){ 

                        // 用于处理同一个 next 有多个异步函数的情况
                        nextTask();
                    }else if(!this.length){

                        nextTask();
                    }
                }
            };

            var nextTask = function(){
                if(that.tasks.length){
                    var tasks = that.tasks.shift();
                    context.length = tasks.length;
                    for(i = 0; task = tasks[i]; i++){
                        task.call(context);
                    }
                }else{
                    onFinish();
                }
            }

            var onFinish = function(){
                for(i = 0; done = that.dones[i]; i++){
                    done.call(context);
                }
            }

            nextTask();
        }
    };

    function ArrayTask(){
        this.tasks = [];
        this.dones = [];
    }

    ArrayTask.prototype = {
        add: function(func/*[,...]*/){
            var argus = slice.apply(arguments);
            this.tasks = this.tasks.concat(argus);
            return this;
        },
        done: function(func){
            var argus = slice.apply(arguments);
            this.dones = this.dones.concat(argus);
            return this;
        },
        start: function(){
            var that = this,
                i, task, done;

            var context = {
                length: 0,
                data: {},
                done: function(name, result){
                    this.data[name] = result;
                    checkTask();
                }
            };

            

            var checkTask = function(){
                if(--context.length <= 0){
                    onFinish();
                }
            }

            var onFinish = function(){
                for(i = 0; done = that.dones[i]; i++){
                    done.call(context);
                }
            }

            context.length = this.tasks.length;

            for(i = 0; task = this.tasks[i]; i++){
                task.call(context);
            }

        }
    };

    /**
     * 创建一个线性的任务队列, 前一个next完成之后才会执行下一个next
     * @return {Task} 
     * @example
     * AsyncJS.queue().next(function(){
     *    var that = this;
     *    $.ajax(/.../, function(){
     *        // just done
     *        //that.done();
     *    
     *        // done with result
     *        that.done('ajax', { a: 1});
     *    });
     * }).next(function(){
     *    var that = this;
     *    this.data;// { 'ajax': { a: 1} }
     *    
     *    setTimeout(function(){
     *    
     *        that.done('setTimeout', { b: 2 });
     *    }, 1000);
     *    
     * }).done(function(){
     *    this.data;// { 'ajax': { a: 1}, 'setTimeout': { b: 2 }}
     * }).start();
     */
    exports.queue = function(){
        return new QueueTask();
    }


    /**
     * 创建一个并发的任务队列
     * @return {Task} 
     * @example
     * AsyncJS.array().add(function(){
     *    var that = this;
     *    this.data; // {}
     *    
     *    $.ajax(/.../, function(){
     *        // just done
     *        //this.done();
     *    
     *        // done with result
     *        that.done('ajax', { a: 1});
     *    });
     * }).add(function(){
     *    var that = this;
     *    this.data;// {}
     *    
     *    setTimeout(function(){
     *    
     *        that.done('setTimeout', { b: 2 });
     *    }, 1000);
     *    
     * }).done(function(){
     *    this.data;// { 'ajax': { a: 1}, 'setTimeout': { b: 2 }}
     * }).start();
     */
    exports.array = function(){
        return new ArrayTask();
    }

    return exports;
});
