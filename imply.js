/**
 * v0.1.0
 * A small library to build reusable Promise chains.
 * We accumulate each .then() and .catch() as a step
 * and chain them to one or more Promises, later.
 *
 * Because imply is an accumulator, we can chain or apply steps separately
 *
 * @example:
 *  var implication = Imply();
 *  implication.then(firstFn);
 *  implication.then(secondFn)
 *  implication.then(thirdFn, firstErr).then(fourthFn);
 *  implication.then(fifthFn);
 *  implication.using(aPromise);
 */


/**
 * A simple container to accumulate steps
 * @constructor
 * @param {String?} name
 */
function Imply(name){
    'use strict';

    if (this instanceof Imply) {
        this.name = name;
        this.steps = [];
    } else {
        return new Imply(name);
    }
}

/**
 * Fake a promise by providing a thenable
 * @param {Function?} success
 * @param {Function?} error
 * @returns {Imply}
 */
Imply.prototype.then = function(success, error) {
    this.steps.push({success: success, error: error});
    return this;
};

/**
 * Fake a promise by providing catch
 * @param {Function?} error
 * @returns {Imply}
 */
Imply.prototype.catch = function(error) {
    this.steps.push({error: error});
    return this;
};

/**
 * Tell us the name of this implication
 * @returns {String}
 */
Imply.prototype.what = function(){
    return this.name;
};

/**
 * Called with a Promise, it will chain each item as appropriate
 * @param {Promise} nextPromise
 * @returns {Promise}
 * @example
 *  var implication = Imply().then(doSomething).then(doSomethingElse);
 *  var chained = implication.using(aPromise);
 */
Imply.prototype.using = function(nextPromise){

    if (!nextPromise || typeof nextPromise.then !== "function") {
        throw new TypeError('You must pass a thenable');
    }

    // Cycle over to build the chain
    this.steps.forEach(function(obj){
        // Apply each step with .then() and get the result (proper chain)
        // Perhaps in the future we will support arbitrary function names for different libraries
        nextPromise = nextPromise.then(obj.success, obj.error);
    });

    // Pass it along
    return nextPromise;
};

Imply.prototype.that = Imply.prototype.using;

if (typeof module !== 'undefined') { module.exports = Imply; }
