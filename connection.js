(function() {
    this.Connection = function(lag,loss) {
        var bench = new Bench();

        this.peer = null;
        this.id = undefined;
        this.peerId = undefined;
        this.isHost = undefined;

        this.lag = lag|0;
        this.loss = loss|0;

        this.connect = new Act();
        this.ready = new Act();
        this.close = new Act();

        this.ping = undefined;

        this.buffer = [];

        var self = this;

        var peer = new Peer({key: '8sguglthndfxyldi'});

        peer.on('open', function(id) {
            console.log("peer is open");
            self.peer = peer;
            self.id = id;

            self.ready.publish(id);

            peer.on('connection', function(conn) {
                console.log("Connection init: client");
                self.connection = conn;
                self.isHost = false;

                self.peerId = self.connection.peer;

                self._setupEvents(self.connection);
            });
        });
    }

    var Connection = this.Connection.prototype;

    Connection.send = function(data) {
        if (Math.random() * 100 > this.loss) {
            window.setTimeout((function() {
                this.connection.send(data);
            }).bind(this),this.lag);
        }
    }

    Connection.recv = function() {
        return this.buffer.splice(0,this.buffer.length);
    }

    Connection.connectTo = function(id) {
        if (this.peer != null) {
            console.log("Connecting to "+id);
            this.connection = this.peer.connect(id);
            this.peerId = this.connection.peer;

            this.isHost = true;

            this._setupEvents(this.connection);
        }
    }

    Connection.sendPing = function() {
        this.pingStart = (new Date()).getTime();
        this.send("ping");
    }

    Connection._setupEvents = function(conn) {
        var self = this;
        conn.on('data', function(data) {
            if (data === "ping") {
                self.send("pong");
            } else if (data === "pong") {
                self.ping = (new Date()).getTime() - self.pingStart;
            } else {
                self.buffer.push(data);
            }
        });

        conn.on('open', function() {
            console.log('Connected');
            self.connect.publish(self);
        });

        conn.on('close', function() {
            self.close.publish(self);
        });
    }
}).apply(window);

