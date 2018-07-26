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
        this.seekRatio = settings.seekRatio || 5;
        this.maxVelocity = 100; // for now
        this.maxForce = 5; // for now

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
     * calculates and adds the seek force to desiredVelocity
     * @param {V2D} point the point to seek
    */
    seek(point) {
        this.desiredVelocity.add(point.clone().subtract(this.position).resize(this.seekRatio));
    }

    /**
     * limits desiredVelocity
     * calculates and limits steerForce 
     * modifies and limits currentVelocity
     */
    steer() {
        // limit desiredVelocity
        this.desiredVelocity.limit(0, this.maxVelocity);

        // calculate and limit steerForce
        let steerForce = this.desiredVelocity
            .clone()
            .subtract(this.currentVelocity)
            .limit(0, this.maxForce);

        // modify and limit currentVelocity
        this.currentVelocity
            .add(steerForce)
            .limit(0, this.maxVelocity);
    }

    // ---------------------------------------
    //                steppers
    // ---------------------------------------

    /**
     * takes a step toward point, by now just considering seek force
     * @param {V2D} point 
     * @return {Object} contains the new position {x,y}
     */
    stepToward(point) {

        // reset the desired velocity to the seek force
        this.desiredVelocity.reset(0, 0);

        // seek the point
        this.seek(point);

        // steer (update the currentVelocity)
        this.steer();


        // move
        this.position.add(this.currentVelocity);

        return this.position;

        // TODO: avoid obstacles in the map
        // TODO: decrease the speed when near
        // TODO: return false when reached        
    }


}

module.exports = Mover;