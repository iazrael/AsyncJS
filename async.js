(function(exports){

    var slice = Array.prototype.slice;

    function TaskQueue(){
        this.tasks = [];
        this.dones = [];
        if(arguments.length){
            this.add.apply(this, slice.apply(arguments));
        }
    }

    TaskQueue.prototype = {
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
                count = 0,
                i, task, done;

            function onDone(){
                if(++count === that.tasks.length){
                    for(i = 0; done = that.dones[i]; i++){
                        done();
                    }
                    that.tasks = that.dones = null;
                }
            }

            for(i = 0; task = this.tasks[i]; i++){
                task(onDone);
            }
        }
    };

    /**
     * 创建一个任务队列
     * @return {Queue} 
     */
    exports.queue = function(){
        return new TaskQueue();
    }

})(typeof exports === 'object' ? exports : (window['AsyncJS'] = {}));
