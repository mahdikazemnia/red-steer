const V2D = require('vectors-2d');

class Mover {

    constructor(settings, chain) {

        // info object to share with the chain
        this.info = {};
        this.info.id = chain.movers.length;

        // join the chain
        this.chain = chain;
        this.chain.movers.push(this.info);

        // position
        this.position = new V2D(settings.position);

        // velocities
        this.currentVelocity = new V2D(0, 0);
        this.desiredVelocity = new V2D(0, 0);

        // ratios
        this.seekRatio = settings.seekRatio || 1;

        // radius (size)
        this.radius = settings.radius;

        // add referenced values to the chain
        this.info.position = this.position;

    }

    // ---------------------------------------
    //          getters and setters
    // ---------------------------------------

    get radius() {
        return this._radius;
    }

    set radius(param) {
        this.info.radius = this._radius = param;
    }

    // ---------------------------------------
    //              calculators
    // ---------------------------------------

    /**
     * calculate's and return's the seek force
     * @param {V2D} point the point to seek
     * @returns {V2D} force
    */
    calcSeekForce(point) {
        return point.clone().subtract(this.position).resize(this.seekRatio);
    }


}

module.exports = Mover;