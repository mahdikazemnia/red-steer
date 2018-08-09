const V2D = require('vectors-2d');

class Circle {

    constructor(settings) {

        // position
        this.position = new V2D(settings.position);

        // radius
        this.radius = settings.radius;

    }

    /**
     * joins the obstacle to the chain
     * @param {Object} chain 
    */
    join(chain) {
        // join the chain
        this.info = {
            id: chain.obstacles.length,
            type: 'Circle',
            position: this.position,
            radius: this._radius
        };

        // join the chain
        this.chain = chain;
        this.chain.movers.push(this.info);
    }

    // ---------------------------------------
    //          getters and setters
    // ---------------------------------------

    get radius() {
        return this._radius;
    }

    set radius(param) {
        if (this.info) this.info.radius = this._radius = param;
        else this._radius = param;
    }

}

module.exports = Circle;