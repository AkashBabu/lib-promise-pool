/**
 * @typedef {Object} Options
 * @property {boolean} Options.stopOnErr Stop on First Error
 */

/**
 * Controlls the number of concurrent async operations
 * @param {Array<any>} arr Data Array
 * @param {Function} worker Worker Function
 * @param {Number} concurrency Concurrency number
 * @param {Options} options Options for controlling execution
 *
 * @returns {Array<Object>}
 */
async function PromisePool(arr = [], worker, concurrency = 1, options = {}) {
    const { stopOnErr = false } = options;

    const end = arr.length;
    const result = [];
    let ind = 0;

    // Like a thread
    async function runner() {
        if (ind < end) {
            // Make a thread-safe copy of index
            const _ind = ind;

            const item = arr[ind++];

            // Assign the result from worker to the same index as data was taken from
            try {
                result[_ind] = await worker(item, _ind);
            } catch (err) {
                if (stopOnErr) throw new Error(err);
                result[_ind] = err;
            }

            return runner();
        }
    }

    const runners = [];

    // Spawn threads
    for (let i = 0; i < concurrency; i++) {
        if (i >= end) break;
        runners.push(runner());
    }

    await Promise.all(runners);
    return result;
}

module.exports = PromisePool;
