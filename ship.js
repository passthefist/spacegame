(function() {
    // Missile constructor
    this.Ship = function(game, conf) {
        Phaser.Sprite.call(this, game, conf.x, conf.y, conf.sprite);
        this.targetY = conf.x;
        this.targetX = conf.y;

        this.animations.add('idle',[0]);
        this.animations.add('move',[0,1],20, true);
        this.animations.add('boost',[1,2],20), true;

        this.animations.play('idle');

        // Set the pivot point for this sprite to the center
        this.anchor.setTo(0.5, 0.5);

        // Enable physics on the missile
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true

        // Define constants that affect motion
        this.SPEED = 250; // missile speed pixels/second
        this.ACCEL = 250; // missile speed pixels/second
        this.TURN_RATE = 5; // turn rate in degrees/frame
        this.TURN_MOD = 5;
        this.BOOST_ASSIST_MAG = 5;

        // hafwidth of cone
        this.BOOST_ASSIST_RANGE = Math.PI/2;

        this.FIRE_RATE = 15;
        this.timer = 0;

        this.BOOST_RATE = 120;
        this.boostRate = 0;

        this.BOOST_TIME = 50;
        this.boostTime = 0;

        this.BRAKE_RATE = 120;
        this.brakeRate = 0;

        this.BRAKE_TIME = 35;
        this.brakeTime = 0;

        this.strafeL = false;
        this.strafeR = false;
    };

    // Missiles are a type of Phaser.Sprite
    this.Ship.prototype = Object.create(Phaser.Sprite.prototype);
    this.Ship.prototype.constructor = this.Ship;
    var Ship = this.Ship.prototype;

    Ship.update = function() {
        this.timer ++;
        this.boostRate ++;
        this.brakeRate ++;

        if (this.boostTime > 0) {
            this.boostTime --;
            this.boosting = true;
        } else {
            this.boosting = false;
        }

        if (this.brakeTime > 0) {
            this.brakeTime --;
            this.braking = true;
        } else {
            this.braking = false;
        }

        if (this.active) {
            this.animations.play('move');

            // Calculate velocity vector based on this.rotation and this.SPEED
            this.body.acceleration.x = Math.cos(this.rotation) * this.ACCEL
            this.body.acceleration.y = Math.sin(this.rotation) * this.ACCEL;
        } else {
            this.animations.play('idle');
            this.body.acceleration.x = 0;
            this.body.acceleration.y = 0;

            var mag = this.body.velocity.getMagnitude();
            if (mag < 0.05) {
                mag = 0;
            }
            this.body.velocity.setMagnitude(0.98*mag);
        }

       if (this.boosting) {
            this.animations.play('boost');
            this.SPEED = 550;

            var boostMod = 5 * this.ACCEL * (this.boostTime/this.BOOST_TIME);

            this.body.acceleration.x += Math.cos(this.rotation) * boostMod;
            this.body.acceleration.y += Math.sin(this.rotation) * boostMod;
        } else {
            if (this.SPEED > 250) {
                var diff = (this.SPEED - 250)/10;
                this.SPEED -= diff;
                if (this.SPEED - 250 < 0.5) {
                    this.SPEED = 250;
                }
            }
        }

        if (this.strafeR) {
            this.body.acceleration.x += this.ACCEL * Math.cos(this.rotation - Math.PI/2);
            this.body.acceleration.y += this.ACCEL * Math.sin(this.rotation - Math.PI/2);
        }
        if (this.strafeL) {
            this.body.acceleration.x += this.ACCEL * Math.cos(this.rotation + Math.PI/2);
            this.body.acceleration.y += this.ACCEL * Math.sin(this.rotation + Math.PI/2);
        }

        if (this.retroing) {
            this.body.acceleration.x -= Math.cos(this.rotation) * this.ACCEL * 1.1;
            this.body.acceleration.y -= Math.sin(this.rotation) * this.ACCEL * 1.1;
        }

        if (this.body.velocity.getMagnitudeSq() > this.SPEED * this.SPEED) {
            this.body.velocity.normalize();
            this.body.velocity.setMagnitude(this.SPEED);
        }

        this.retroing = false;
        this.strafeL = false;
        this.strafeR = false;
    };

    Ship.targetVector = function(x,y) {
        this.targetX = x;
        this.targetY = y;

        // Calculate the angle from the missile to the mouse cursor game.input.x
        // and game.input.y are the mouse position; substitute with whatever
        // target coordinates you need.
        var targetAngle = this.game.math.angleBetween(
            this.x, this.y,
            this.targetX, this.targetY
        );

        this.updateRotation(targetAngle);


    }

    Ship.updateRotation = function(targetAngle) {
        // Gradually (this.TURN_RATE) aim the missile towards the target angle
        if (this.rotation !== targetAngle) {
            // Calculate difference between the current angle and targetAngle
            var delta = targetAngle - this.rotation;

            // Keep it in range from -180 to 180 to make the most efficient turns.
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (delta > 0) {
                this.angle += this.TURN_RATE;
            } else {
                // Turn counter-clockwise
                this.angle -= this.TURN_RATE;
            }

            // Just set angle to target angle if they are close
            if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                this.rotation = targetAngle;
            }
        }
    }

    Ship.headRight = function() {
        this.throttle(true);

        this.updateRotation(0);
    }


    Ship.headLeft = function() {
        this.throttle(true);

        this.updateRotation(Math.PI);
    }

    Ship.headUp = function() {
        this.throttle(true);

        this.updateRotation(-Math.PI/2);
    }

    Ship.headDown = function() {
        this.throttle(true);

        this.updateRotation(Math.PI/2);
    }

    Ship.turnLeft = function(active) {
        this.angle -= this.TURN_RATE;
    }

    Ship.turnRight = function(active) {
        this.angle += this.TURN_RATE;
    }

    Ship.strafeLeft = function(active) {
        this.strafeL = true;
    }

    Ship.strafeRight = function(active) {
        this.strafeR = true;
    }

    Ship.throttle = function(active) {
        this.active = active;
    }

    Ship.fire = function(x,y) {
        if (this.timer > this.FIRE_RATE) {
            this.timer = 0;

            var ang = this.rotation;

            if (x && y) {
                ang = this.game.math.angleBetween(
                    this.x, this.y,
                    x,y
                );
            }

            this.game.registry.create('bullet',{
                x:this.x,
                y:this.y,
                ang: ang
            }); 

        }
    }

    Ship.boost = function() {
        if (this.boostRate > this.BOOST_RATE) {
            this.boostRate = 0;
            this.boostTime = this.BOOST_TIME;
        }
    }

    Ship.retro = function () {
        this.retroing = true;
    }

    Ship.brake = function() {
        if (this.brakeRate > this.BRAKE_RATE) {
            this.brakeRate = 0;
            this.brakeTime = this.BRAKE_TIME;
        }
    }

    Ship.applyCollision = function(obj) {
    }

}).apply(window);

(function() {
    // Missile constructor
    this.Bullet = function(game, x, y, ang) {
        Phaser.Sprite.call(this, game, x, y, 'bullet');
        this.anchor.setTo(0.5, 0.5);

        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.SPEED = 1200;
        this.LIFE = 32;
        this.alive = 0;

        this.rotation = ang;
        this.body.velocity.x = this.SPEED * Math.cos(ang);
        this.body.velocity.y = this.SPEED * Math.sin(ang);

        this.explode = false;

        this.events.onDestroy.add(function() {
            if (this.explode) {
                var effect = new AnimationEffect(this.game, this.x, this.y, {
                    sheet:'bulletexplode',
                    frames:[0,1,2,3],
                    rate:20
                });
            }
        }, this);

    }

    // Missiles are a type of Phaser.Sprite
    this.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
    this.Bullet.prototype.constructor = this.Bullet;
    var Bullet = this.Bullet.prototype;

    Bullet.init = function(ang) {
    }

    Bullet.update = function(ang) {
        this.alive++;
        if (this.alive > this.LIFE) {
            this.game.registry.removeItem(this);
        }
    }

    Bullet.applyCollision = function(obj) {
        this.explode = true;
        this.game.registry.removeItem(this);
    }
}).apply(window);

(function() {
    // Missile constructor
    this.AnimationEffect = function(game, x, y, config) {
        Phaser.Sprite.call(this, game, x, y, config.sheet);
        this.anchor.setTo(0.5, 0.5);

        this.game.add.existing(
            this
        );

        this.animations.add('anim',config.frames,config.rate);

        this.animations.play('anim',config.rate,false,true);
    }

    // Missiles are a type of Phaser.Sprite
    this.AnimationEffect.prototype = Object.create(Phaser.Sprite.prototype);
    this.AnimationEffect.prototype.constructor = this.Bullet;
}).apply(window);
