const V2D = require('vectors-2d');

class Circle {

    constructor(settings, chain) {

        // join the chain
        this.info = {};
        this.info.id = chain.obstacles.length;
        this.info.type = 'Circle';
        this.chain = chain;
        this.chain.obstacles.push(this.info);

        // position
        this.position = new V2D(settings.position);

        // radius
        this.radius = settings.radius;

        // attach referencable share info (objects)
        this.info.position = this.position;

    }

}

module.exports = Circle;