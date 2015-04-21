(function() {
    this.Act = function() {
        this.id = 0;
        this.callbacks = [];
        this.eventsFired = [];
    }

    var Act = this.Act.prototype;

    Act.on = function (context,cb) {
        this.id++;
        this.callbacks.push({
            id:this.id,
            ctx:context,
            func:cb
        });

        for(var idx in this.eventsFired) {
            var data = this.eventsFired[idx];

            b.func.call(context, data);
        }

        return this.id;
    }

    Act.publishEvent = function(data) {
        for(var idx in this.callbacks) {
            var callback = this.callbacks[idx];

            callback.func.call( callback.context, data);
        }
    }

    Act.fire = function (data) {
        this.publishEvent(data);
    }

    Act.publish = function (data) {
        this.eventsFired.push(data);
        this.publishEvent(data);
    }
}).apply(window);
