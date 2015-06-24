(function() {
    this.LocalReceiver = function(game) {
        this.game = game;
        this.runner = new CommandRunner();
    }

    var LocalReceiver = this.LocalReceiver.prototype;

    LocalReceiver.recv = function(command) {
       this.runner.add(); 
    }

    LocalReceiver.update = function(del,now) {
        this.runner.update(del,now);
    }
}).apply(window);

(function() {
    this.RemoteReceiver = function(game,conn) {
        this.game = game;
        this.conn = conn;
    }

    var RemoteReceiver = this.RemoteReceiver.prototype;

    RemoteReceiver.recv = function(command) {
       conn.send(command.serialize());
    }

    RemoteReceiver.update = function(del,now) {
    }
}).apply(window);
