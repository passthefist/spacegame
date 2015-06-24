(function() {
    this.RemoteSource = function(game,conn) {
        this.game = game;
        this.conn = conn;
    }

    var RemoteSource = this.RemoteSource.prototype;

    RemoteSource.produce = function(command) {
       var acts = conn.recv();
       var commands = [];

        for(var i in acts) {
            var act = acts[i];
            switch(act._) {
                case 'mov':

                    break;
                case 'create':
                    commands.push(CreateCommand(this.game,act));
                    break;
                default:
            }
        }

        return commands;
    }
}).apply(window);
