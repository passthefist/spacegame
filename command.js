(function() {
    this.CommandRunner = function(conn) {
        this.active = {};
        this.conn = conn;
    }

    var CommandRunner = this.CommandRunner.prototype;

    CommandRunner.execute = function(cmd) {
        this.add(cmd);
        this.conn.send(cmd):
    }

    CommandRunner.add = function(cmd) {
        this.active[cmd.hash()] = chm;
    }

    CommandRunner.update = function(del,now) {
        for(var id in this.active) {
            if (this.active[id].update(del,now)) {
                delete this.active[id];
            }
        }
    }
}).apply(window);

(function() {
    this.CommandFactory = function(target,finishby) {
        this.name = 'base';
        this.target = null;
        this.finishby = finishby;
    }

    var CommandFactory = this.CommandFactory.prototype;
    Command.hash = function(cmd) {
        return this.name + this.target.hash;
    }
}).apply(window);

(function() {
    this.Command = function(target,finishby) {
        this.name = 'base';
        this.target = null;
        this.finishby = finishby;
    }

    var Command = this.Command.prototype;
    Command.hash = function(cmd) {
        return this.name + this.target.hash;
    }
}).apply(window);

(function() {
    this.CreateCommand = function(target, finishby, type, x, y, hash) {
        this.name = 'create';
        this.replace = true;

        var entity = EntityFactory.create(type, hash);
        entiy.position(x,y);

        this.target.add(entity);
    }

    var CreateCommand = this.CreateCommand.prototype;

    CreateCommand.update = function(del,now) {
        return true;
    }
}).apply(window);

(function() {
    this.MoveCommand = function(target, finishby, startX, startY, endX, endY) {
        this.name = 'move';
        this.replace = true;

        this.finishby = finishby;
        this.length = finishby-Date.now();

        this.startX = startX;
        this.startY = startY;

        this.endX = endX;
        this.endY = endY;

        this.target = target;
    }

    var MoveCommand = this.MoveCommand.prototype;

    MoveCommand.update = function(del,now) {
        if (now > this.finishby) return true;
        var at = 1-(this.finishby - now)/this.length;

        this.target.position(Math.linear(this.startX,this.endX,at),Math.linear(this.startY,this.endY,at));
    }
}).apply(window);

