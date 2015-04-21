(function() {
    this.Connection = function() {
        var bench = new Bench();
        
        this.peer = null;
        this.id = undefined;
        this.peerId = undefined;
        this.isHost = undefined;

        this.connect = new Act();
        this.ready = new Act();
        this.close = new Act();

        this.buffer = [];

        var self = this;

        var peer = new Peer({key: 'lwjd5qra8257b9'});

        peer.on('open', function(id) {
            console.log("peer is open");
            self.peer = peer;
            self.id = id;

            self.ready.publish(id);

            peer.on('connection', function(conn) {
                self.connection = conn;
                self.isHost = false;
                
                self.peerId = self.connection.peer;

                self._setupEvents(self.connection);
            });
        });
    }

    var Connection = this.Connection.prototype;

    Connection.send = function(data) {
        console.log('sending',data);
        this.connection.send(data);
    }

    Connection.recv = function() {
        return this.buffer.splice(0,this.buffer.length);
    }

    Connection.connectTo = function(id) {
        if (this.peer != null) {
            console.log("Connecting to "+id);
            this.connection = this.peer.connect(id);
            this.peerId = this.connection.peer;

            this._setupEvents(this.connection);
            
            this.isHost = false;
        }
    }

    Connection._setupEvents = function(conn) {
        var self = this;
        conn.on('data', function(data) {
            console.log('Received', data);
            self.buffer.push(data);
        });

        conn.on('open', function() {
            self.connect.publish(self);
        });

        conn.on('close', function() {
            self.close.publish(self);
        });
    }
}).apply(window);

