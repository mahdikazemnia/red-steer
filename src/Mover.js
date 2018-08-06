const V2D = require('vectors-2d');

class Mover {

    constructor(settings) {

        // position
        this.position = new V2D(settings.position);

        // velocities
        this.currentVelocity = new V2D(0, 0);
        this.desiredVelocity = new V2D(0, 0);

        // radius (size)
        this.radius = settings.radius;

        // ratios
        this.seekRatio = settings.seekRatio || 10;
        this.fleeRatio = settings.fleeRatio || 10;
        this.maxVelocity = settings.maxVelocity || 10;
        this.maxForce = settings.maxForce || 3;

    }

    /**
     * joins the mover to the chain
     * @param {Object} chain 
     */
    join(chain) {
        // info object to share with the chain
        this.info = {
            id: chain.movers.length,
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
     * calculates and adds the flee force to desiredVelocity
     * @param {V2D} point the point to flee from
    */
    flee(point) {
        this.desiredVelocity.add(this.position.clone().subtract(point).resize(this.fleeRatio));
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
     * major step method
     * takes a step based on settings
     * @param {Object} settings {scenario, ...}
     */
    step(settings) {

        // reset the desiredVelocity
        this.desiredVelocity.reset(0, 0);

        // seek ? seek the point, avoid obstacles
        if (settings.scenario === 'seekAndAvoid') {
            this.seekAndAvoid(new V2D(settings.point), settings.slowingRadius);
        } else if (settings.scenario === 'fleeAndAvoid') {
            this.fleeAndAvoid(settings.point);
        }

        // update the currentVelocity
        this.steer();

        // take the step and return the new position        
        return this.position.add(this.currentVelocity);

    }

    /**
     * calculates seek and avoid forces
     * @param {V2D} point - point to seek
     */
    seekAndAvoid(point, slowingRadius) {
        this.seek(point); // seek the point

        // TODO: avoid

        let distance = this.position.distanceTo(point);
        if (distance < slowingRadius) { // in slowing radius
            this.desiredVelocity.multiply(distance / slowingRadius);
        }

    }

    /**
     * calculates flee and avoid forces
     * @param {V2D} point - point to flee from
     */
    fleeAndAvoid(point) {
        this.flee(point); // flee from the point
        // TODO: avoid
    }


}

module.exports = Mover;