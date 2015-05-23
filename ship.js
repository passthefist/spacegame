(function() {
    this.Ship = function(game,x,y) {
        this.sprite = game.add.sprite(x, y, 'stick')
        this.body = this.sprite.body;
    }

    var Ship = this.Ship.prototype;

    Ship.update = function() {
    }

    Ship.targetVector = function(x,y) {
        var angle = angleToXY(this.sprite, x, y);
        var dist = distanceToXY(this.sprite, x,y);
        game.debug.text(angle+":"+dist);
    }


}).apply(window);

