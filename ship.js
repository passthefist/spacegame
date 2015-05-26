(function() {
    // Missile constructor
    this.Ship = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'ship');
        this.targetY = x;
        this.targetX = y;

        // Set the pivot point for this sprite to the center
        this.anchor.setTo(0.5, 0.5);

        // Enable physics on the missile
        game.physics.enable(this, Phaser.Physics.ARCADE);

        // Define constants that affect motion
        this.SPEED = 250; // missile speed pixels/second
        this.ACCEL = 250; // missile speed pixels/second
        this.TURN_RATE = 5; // turn rate in degrees/frame
        this.TURN_MOD = 5;
        this.BOOST_ASSIST_MAG = 5;

        // hafwidth of cone
        this.BOOST_ASSIST_RANGE = 4*Math.PI/5;

        this.FIRE_RATE = 15;
        this.timer = 0;
    };

    // Missiles are a type of Phaser.Sprite
    this.Ship.prototype = Object.create(Phaser.Sprite.prototype);
    this.Ship.prototype.constructor = this.Ship;
    var Ship = this.Ship.prototype;

    Ship.update = function() {
        this.timer ++;

        if (this.active) {
            // Calculate the angle from the missile to the mouse cursor game.input.x
            // and game.input.y are the mouse position; substitute with whatever
            // target coordinates you need.
            var targetAngle = this.game.math.angleBetween(
                this.x, this.y,
                this.targetX, this.targetY
            );

            var accelMod = 0;

            // Gradually (this.TURN_RATE) aim the missile towards the target angle
            if (this.rotation !== targetAngle) {
                // Calculate difference between the current angle and targetAngle
                var delta = targetAngle - this.rotation;

                // Keep it in range from -180 to 180 to make the most efficient turns.
                if (delta > Math.PI) delta -= Math.PI * 2;
                if (delta < -Math.PI) delta += Math.PI * 2;

                if (delta > 0) {
                    // Turn clockwise
                    this.angle += this.TURN_RATE;
                } else {
                    // Turn counter-clockwise
                    this.angle -= this.TURN_RATE;
                }

                if (delta > this.BOOST_ASSIST_RANGE) {
                    accelMod = (delta - this.BOOST_ASSIST_RANGE)/this.BOOST_ASSIST_RANGE;
                } else if ( delta < -this.BOOST_ASSIST_RANGE ) {
                    accelMod = (-delta - this.BOOST_ASSIST_RANGE)/this.BOOST_ASSIST_RANGE;
                }
                console.log(delta);

                // Just set angle to target angle if they are close
                if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                    this.rotation = targetAngle;
                }
            }

            // Calculate velocity vector based on this.rotation and this.SPEED
            this.body.acceleration.x = Math.cos(this.rotation) * this.ACCEL
            this.body.acceleration.y = Math.sin(this.rotation) * this.ACCEL;

            if (accelMod > 0) {
                console.log(accelMod);
                this.body.acceleration.x += Math.cos(targetAngle) * this.ACCEL * this.BOOST_ASSIST_MAG * accelMod;
                this.body.acceleration.y += Math.sin(targetAngle) * this.ACCEL * this.BOOST_ASSIST_MAG * accelMod;
            }

            if (this.body.velocity.getMagnitudeSq() > this.SPEED * this.SPEED) {
                this.body.velocity.normalize();
                this.body.velocity.setMagnitude(this.SPEED);
            }
        } else {
            this.body.acceleration.x = 0;
            this.body.acceleration.y = 0;

            var mag = this.body.velocity.getMagnitude();
            if (mag < 0.05) {
                mag = 0;
            }
            this.body.velocity.setMagnitude(0.98*mag);
        }
    };

    Ship.targetVector = function(x,y) {
        this.targetX = x;
        this.targetY = y;
    }

    Ship.throttle = function(active) {
        this.active = active;
    }

    Ship.fire = function() {
        if (this.timer > this.FIRE_RATE) {
            this.timer = 0;
            var b = new Bullet(this.game,this.x, this.y);
            b.init(this.rotation);

            this.game.add.existing(
                b    
            );
        }
    }

}).apply(window);

(function() {
    // Missile constructor
    this.Bullet = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'bullet');
        this.anchor.setTo(0.5, 0.5);

        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.SPEED = 900;
        this.LIFE = 20;
        this.alive = 0;
    }

    // Missiles are a type of Phaser.Sprite
    this.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
    this.Bullet.prototype.constructor = this.Bullet;
    var Bullet = this.Bullet.prototype;

    Bullet.init = function(ang) {
        this.rotation = ang;
        this.body.velocity.x = this.SPEED * Math.cos(ang);
        this.body.velocity.y = this.SPEED * Math.sin(ang);
    }

    Bullet.update = function(ang) {
        this.alive++;
        if (this.alive > this.LIFE) {
            this.destroy();
        }
    }
}).apply(window);

