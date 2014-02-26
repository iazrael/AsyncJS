简易的异步函数同步处理的方法

# API

#### {Function} AsyncJS.queue 
@return {Task}

创建一个按串行执行的异步任务队列, 每个任务执行完成之后可调用 done 方法传入执行结果, 传递给下一个任务使用, 等最后一个任务执行完成之后执行 done 传入的回调

#### {Function} AsyncJS.array 
@return {Task}

创建一个并发执行的异步任务队列, 所有都任务执行完成之后执行 done 回调

#### {Function} Task.next 
@return {Task}

添加串行任务, 可传入多个方法, 可链式调用

@example

    AsyncJS.queue().next(func1).next(func2, func3).start();

#### {Function} Task.add 
@return {Task}

添加并行任务, 可传入多个方法, 可链式调用

@example

    AsyncJS.array().add(func1).add(func2, func3).start();

#### {Function} Task.done
添加当所有任务都完成后的回调, 可传入多个方法, 可链式调用

@example

    AsyncJS.array().done(func1).done(func2, func3).start();


#### {Function} Task.start
开始执行任务

#### {Object} Context
每个任务的执行上下文都是一个特殊的{Context}, 改 Context 包含了一个方法 done 和一个属性 data, done 用于告知队列该任务已经完成, data 则是用于获取已完成的任务保存的返回值

#### {Function} Context.done
告知队列该任务已经完成, 如果有数据需要传递给后面的任务, 可传入 key 和 value, 多用于串行任务

@example
    
    AsyncJS.queue().next(function(){
        this.done('first', { v: 1 });
    }).next(function(){
        this.data['first'].v === 1;// true
    }).start();
    
#### {Object} Context.data
获取已完成的任务保存的返回值, 是个 key - value 类型的 map


# Example
    
    //1. 添加到next的方法按顺序执行, 全部执行完成之后按顺序执行done回调
    AsyncJS.queue().next(function(){ // func1
            var that = this;
            setTimeout(function(){
                that.done('ajax', { a: 1}); // done with data
            }, 500);
        }, function(){ // func2
            var that = this;
            setTimeout(function(){
                that.done(); // just done
            }, 1500);
        }).next(function(){ // func1, func2 都执行完成之后才会执行这个方法
            var that = this;
            this.data['ajax'].a === 1; //true

            setTimeout(function(){
                that.done('timeout', { b: 2 });
            }, 1000);
         
        }).done(function(){
            
            this.data['ajax'].a === 1; //true
            this.data['timeout'].b === 2; //true
        }).done(function(){
            // do something
        }).start();
    
    //2. 多个方法并发执行, 执行完成之后按顺序执行done回调
    AsyncJS.array().add(function(){
            var that = this;
            setTimeout(function(){
                that.done('ajax', { a: 1}); // done with data
            }, 500);
        }, function(){
            var that = this;
            setTimeout(function(){
                that.done(); // just done
            }, 1500);
        }).add(function(){
            var that = this;
            this.data['ajax']; // undefined

            setTimeout(function(){
                that.done('timeout', { b: 2 });
            }, 1000);
         
        }).done(function(){
            
            this.data['ajax'].a === 1; //true
            this.data['timeout'].b === 2; //true
        }).done(function(){
            // do something
        }).start();


