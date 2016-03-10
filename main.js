var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="phaser/phaser.d.ts"/>
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.UFO_SIZE = 75;
        this.MAX_SPEED = 300; // pixels/second
        this.ACCELERATION = 800; // pixels/second/second
    }
    /*AQUI PUNTO IMPORTANTE: el objetivo del juego debe ser comerse las coins amarillas, cada vez que se come una amarill
     nace otra, y cada X tiempo nace una roja. cada amarilla es un punto, y cuando colisiona con una roja (o se la come
     poniendise encima, pierde y la puntuacion es la que haya.
     Por lo tanto debemos:
     - configurar que se coma la amarilla y desaparezca
     - que sume un punto al comerla
     - que se genere una amarilla nueva
     - que pierda cuando se coma una roja
     - que se generen rojas para aumentar dificultad*/
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('ufo', 'assets/UFO.png');
        this.load.image('pickup', 'assets/Pickup.png');
        this.load.image('coin', 'assets/Pickup-low.png');
        this.load.image('redcoin', 'assets/PickupRojo-low.png');
        this.game.load.tilemap('tilemap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/Background-low.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.createBordes = function () {
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('Background-low', 'tiles');
        var fondo = this.map.createLayer('fondo');
        this.bordes = this.map.createLayer('bordes');
        this.map.setCollisionBetween(1, 100, true, 'bordes');
    };
    mainState.prototype.createPickUps = function () {
        this.coin = this.add.sprite(this.rnd.between(65, 535), this.rnd.between(65, 535), 'coin');
        this.coin.anchor.setTo(0.5, 0.5);
        /*this.coin2 = this.add.sprite(this.rnd.between(65,535),this.rnd.between(65,535), 'coin');
        this.coin2.anchor.setTo(0.5,0.5);

        this.coin3 = this.add.sprite(this.rnd.between(65,535),this.rnd.between(65,535), 'coin');
        this.coin3.anchor.setTo(0.5,0.5);

        this.coin4 = this.add.sprite(this.rnd.between(65,535),this.rnd.between(65,535), 'coin');
        this.coin4.anchor.setTo(0.5,0.5);

        this.coin5 = this.add.sprite(this.rnd.between(65,535),this.rnd.between(65,535), 'coin');
        this.coin5.anchor.setTo(0.5,0.5);

        this.coin6 = this.add.sprite(this.rnd.between(65,535),this.rnd.between(65,535), 'coin');
        this.coin6.anchor.setTo(0.5,0.5);*/
        this.redCoin = this.add.sprite(this.rnd.between(65, 535), this.rnd.between(65, 535), 'redcoin');
        this.redCoin.anchor.setTo(0.5, 0.5);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        //llama a los bordes que hemos creado en la funcion
        this.createBordes();
        //crea los coins (amarillos y rojos)
        this.createPickUps();
        //background.scale.setTo(scale, scale);
        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.width = this.ufo.height = this.UFO_SIZE;
        this.ufo.anchor.setTo(0.5, 0.5);
        //activamos sprites
        this.physics.enable(this.ufo, Phaser.Physics.ARCADE);
        this.physics.enable(this.coin, Phaser.Physics.ARCADE);
        /*this.physics.enable(this.coin2, Phaser.Physics.ARCADE);
        this.physics.enable(this.coin3, Phaser.Physics.ARCADE);
        this.physics.enable(this.coin4, Phaser.Physics.ARCADE);
        this.physics.enable(this.coin5, Phaser.Physics.ARCADE);
        this.physics.enable(this.coin6, Phaser.Physics.ARCADE);*/
        this.physics.enable(this.redCoin, Phaser.Physics.ARCADE);
        //le damos la maxima velocidad declarada arriba al ufo en ambas direcciones: x, y
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ufo.body.collideWorldBounds = true;
        this.coin.body.collideWorldBounds = true;
        /*this.coin2.body.collideWorldBounds = true;
        this.coin3.body.collideWorldBounds = true;
        this.coin4.body.collideWorldBounds = true;
        this.coin5.body.collideWorldBounds = true;
        this.coin6.body.collideWorldBounds = true;*/
        this.redCoin.body.collideWorldBounds = true;
        //todos los sprites rebotan
        this.ufo.body.bounce.set(0.7);
        this.coin.body.bounce.set(0.7);
        /*this.coin2.body.bounce.set(0.7);
        this.coin3.body.bounce.set(0.7);
        this.coin4.body.bounce.set(0.7);
        this.coin5.body.bounce.set(0.7);
        this.coin6.body.bounce.set(0.7);*/
        this.redCoin.body.bounce.set(0.7);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.puntos = this.add.text(550, 550, '0', { fill: '#000000' });
        this.contador = 0;
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        // el ufo colisiona con bordes
        this.game.debug.bodyInfo(this.ufo, 0, 0);
        this.physics.arcade.collide(this.ufo, this.bordes);
        //el resto colisionan con bordes, los amarillos y el rojo
        this.physics.arcade.collide(this.coin, this.bordes);
        /*this.physics.arcade.collide(this.coin, this.coin2);
        this.physics.arcade.collide(this.coin, this.coin3);
        this.physics.arcade.collide(this.coin, this.coin4);
        this.physics.arcade.collide(this.coin, this.coin5);
        this.physics.arcade.collide(this.coin, this.coin6);*/
        this.physics.arcade.collide(this.coin, this.redCoin);
        /*this.physics.arcade.collide(this.coin2, this.bordes);
        this.physics.arcade.collide(this.coin2, this.coin3);
        this.physics.arcade.collide(this.coin2, this.coin4);
        this.physics.arcade.collide(this.coin2, this.coin5);
        this.physics.arcade.collide(this.coin2, this.coin6);
        this.physics.arcade.collide(this.coin2, this.redCoin);

        this.physics.arcade.collide(this.coin3, this.bordes);
        this.physics.arcade.collide(this.coin3, this.coin4);
        this.physics.arcade.collide(this.coin3, this.coin5);
        this.physics.arcade.collide(this.coin3, this.coin6);
        this.physics.arcade.collide(this.coin3, this.redCoin);

        this.physics.arcade.collide(this.coin4, this.bordes);
        this.physics.arcade.collide(this.coin4, this.coin5);
        this.physics.arcade.collide(this.coin4, this.coin6);
        this.physics.arcade.collide(this.coin4, this.redCoin);

        this.physics.arcade.collide(this.coin5, this.bordes);
        this.physics.arcade.collide(this.coin5, this.coin6);
        this.physics.arcade.collide(this.coin5, this.redCoin);

        this.physics.arcade.collide(this.coin6, this.bordes);
        this.physics.arcade.collide(this.coin6, this.redCoin);*/
        //el rojo colisiona con el ufo y los bordes, tambien con los amarillos pero estan declarados antes
        this.physics.arcade.collide(this.redCoin, this.bordes);
        //this.physics.arcade.collide(this.redCoin, this.ufo);
        /*this.physics.arcade.overlap(this.ufo, this.coin2);
        this.physics.arcade.overlap(this.ufo, this.coin3);
        this.physics.arcade.overlap(this.ufo, this.coin4);
        this.physics.arcade.overlap(this.ufo, this.coin5);
        this.physics.arcade.overlap(this.ufo, this.coin6);*/
        this.physics.arcade.overlap(this.ufo, this.coin, this.cogerMoneda, null, this);
        this.physics.arcade.overlap(this.ufo, this.redCoin, this.muerte, null, this);
        //las coins dan vueltas sobre si mismas
        this.coin.angle += 10;
        /*this.coin2.angle += 10;
        this.coin3.angle += 10;
        this.coin4.angle += 10;
        this.coin5.angle += 10;
        this.coin6.angle += 10;*/
        this.redCoin.angle += 10;
        //y se mueven solas a la misma velocidad, excepto la roja que es un poco más rápida
        this.coin.body.acceleration.x = this.rnd.between(-350, 350);
        this.coin.body.acceleration.y = this.rnd.between(-350, 350);
        /*this.coin2.body.acceleration.x = this.rnd.between(-350,350);
        this.coin2.body.acceleration.y = this.rnd.between(-350,350);

        this.coin3.body.acceleration.x = this.rnd.between(-350,350);
        this.coin3.body.acceleration.y = this.rnd.between(-350,350);

        this.coin4.body.acceleration.x = this.rnd.between(-350,350);
        this.coin4.body.acceleration.y = this.rnd.between(-350,350);

        this.coin5.body.acceleration.x = this.rnd.between(-350,350);
        this.coin5.body.acceleration.y = this.rnd.between(-350,350);

        this.coin6.body.acceleration.x = this.rnd.between(-350,350);
        this.coin6.body.acceleration.y = this.rnd.between(-350,350);*/
        this.redCoin.body.acceleration.x = this.rnd.between(-550, 550);
        this.redCoin.body.acceleration.y = this.rnd.between(-550, 550);
        //los controles, cuando el ufo se mueve tambien rota sobre si mismo
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
            this.ufo.angle += 1; //rotacion
        }
        else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;
            this.ufo.angle += 1; //rotacion
        }
        else if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
            this.ufo.angle += 1; //rotacion
        }
        else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
            this.ufo.angle += 1; //rotacion
        }
        else {
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
            this.ufo.body.velocity.x = 0;
            this.ufo.body.velocity.y = 0;
        }
    };
    mainState.prototype.muerte = function (ufo, redCoin) {
        this.game.state.restart();
    };
    mainState.prototype.cogerMoneda = function (ufo, coin, redCoin) {
        // La función "Kill" hace que la moneda desaparezca del juego
        this.coin.kill();
        var newX = this.rnd.between(65, 535);
        var newY = this.rnd.between(65, 535);
        this.coin.reset(newX, newY);
        /*var newXx = this.rnd.between(65,535);
        var newYy = this.rnd.between(65,535);
        this.redCoin.reset(newXx, newYy)*/
        // Incrementamos la puntuación
        this.contador += 1;
        // Actualizamos la etiqueta con la puntuación
        this.puntos.text = this.contador;
    };
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map