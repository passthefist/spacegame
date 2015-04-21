(function() {
    this.Input = function() {
        this.lastMouse = false;
        this.click = false;
    }

    var Input = this.Input.prototype;

    Input.update = function() {
        this.click = !this.lastMouse && game.input.activePointer.isDown;
        this.lastMouse = game.input.activePointer.isDown;
    }

}).apply(window);


