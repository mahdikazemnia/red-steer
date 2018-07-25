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
        this.maxVelocity = 10; // for now
        this.maxForce = 2; // for now
        this.mass = 1; // for now

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
    seek(point) {
        this.desiredVelocity.add(point.clone().subtract(this.position).resize(this.seekRatio));
    }

    /**
     * calculate's and modifies steerForce based on desiredVelocity and currentVelocity
     * update's currentVelocity based on steerForce
     */
    steer() {
        let steerForce = this.desiredVelocity.clone().subtract(this.currentVelocity).limit(0, this.maxForce).divideSize(this.mass);
        this.currentVelocity.add(steerForce).limit(0, this.maxVelocity);
    }

    // ---------------------------------------
    //                steppers
    // ---------------------------------------

    /**
     * take's a step toward point, by now just considering seek force
     * @param {V2D} point 
     * @return {Object} contains the new position {x,y}
     */
    stepToward(point) {

        // reset the desired velocity to the seek force
        this.desiredVelocity.reset(0, 0);

        // seek the point
        this.seek();

        // steer (update the currentVelocity)
        this.steer();

        
        // TODO: avoid obstacles in the map
        // TODO: decrease the speed when near
        // TODO: return true when reached        
    }


}

module.exports = Mover;