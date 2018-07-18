const V2D = require('vectors-2d');
const Mover = require('./Mover.js');
const Circle = require('./Circle.Obstacle.js');

class Map {

    constructor(settings) {

        /**
        * the chain holding map's info
        * movers and obstacles have access to this chain so they can be aware of each other and the map
        */
        this.chain = {
            map: {},
            movers: [],
            obstacles: [],
        };

        // set the size ([width,height])
        this.size = this.chain.map.size = settings.size;

    }


    /**
     * make's a new mover and automatically add's it to the chain
     * @param {Object} settings 
     */
    makeMover(settings) {
        return new Mover(settings, this.chain);
    }

    /**
       * make's a new obstacle and automatically add's it to the chain
       * @param {Object} settings 
       */
    makeObstacle(settings) {

        // obstacle type
        let type = settings.type;

        if (type == 'Circle') { // Circle
            return new Circle(settings, this.chain);
        }
        // TODO: add other obstacle types

    }

}

module.exports = Map;