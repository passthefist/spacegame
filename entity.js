(function() {
    this.EntityFactory = function() {
        this.count = 0;
        this.registry = {};
        this.createFuncs = {};
    }

    var EntityFactory = this.EntityFactory.prototype;

    EntityFactory.addCreator = function(entityName,createFunc) {
        this.createFuncs[entityName] = createFunc;
    }

    EntityFactory.create = function(hash,entityName, x, y) {
        var entity = this.entityProtoypes[entityName].call(this,hash,x,y);
    }

    EntityFactory.newHash = function(entityName) {
        return entityName + Date.now() + this.count;
    }

    EntityFactory.makeFrom = function(entityName,hash) {
        var entity = this.create(entityName);
        entity.hash = hash;
    }

    EntityFactory.makeNew = function(entityName) {
        this.count ++;
        
        var hash = entityName + Date.now() + this.count;

        var entity = new Entity();
    }
}).apply(window);

(function() {
    this.Entity = function(hash, x, y, graphic) {
        this.hash = hash;
        this.sprite = game.add.sprite(x, y, graphic);
    }

    var Entity = this.Entity.prototype;

    Entity.position = function(x,y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }
}).apply(window);
