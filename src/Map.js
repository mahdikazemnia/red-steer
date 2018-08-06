const V2D = require('vectors-2d');
const Mover = require('./Mover.js');
const Circle = require('./Obstacles/Circle.js');

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
     * makes a new mover and automatically adds it to the chain
     * @param {Object} settings 
     * @returns {Mover}
     */
    makeMover(settings) {
        let mover = new Mover(settings);
        this.append(mover);
        return mover;
    }

    /**
     * makes a new obstacle and automatically adds it to the chain
     * @param {Object} settings 
     * @returns {Mover}
     */
    makeObstacle(settings) {

        // obstacle type
        let type = settings.type;
        let obstacle;

        if (type == 'Circle') { // Circle
            obstacle = new Circle(settings, this.chain);
        }
        // TODO: add other obstacle types

        this.append(obstacle);
        return obstacle;
    }

    /**
     * appends the given object to the chain - obj must be either a mover or an obstacle
     * @param {Mover|Circle|...}  
     * @returns {...} whatever you've passed
     */
    append(obj) {
        obj.join(this.chain);
    }

}

module.exports = Map;