(function() {
    this.GameStateManager = function() {
        this.states = {};
    }

    var GameStateManager = this.GameStateManager.prototype;

    GameStateManager.add = function(state) {
        this.states[state.name] = state;
    }

    GameStateManager.set = function(state) {
        if (this.active) {
            this.active.exit();
        }
        this.active = this.states[state];
        console.log(this.active);
        this.active.enter();
    }

    GameStateManager.update = function(state) {
        this.active.update();
    }


}).apply(window);


(function() {
    this.GameState = function() {
        this.name = null;
    }

    var GameState = this.GameState.prototype;

    GameState.enter = function(){};
    GameState.update = function(){};
    GameState.exit = function(){};


}).apply(window);

