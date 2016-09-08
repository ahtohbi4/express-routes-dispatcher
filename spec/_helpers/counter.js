/**
 * Counter
 *
 * @param {number} [count=0] - Start value
 * @returns {function}
 */
module.exports = (function (count) {
    count = count || 0;

    return () => {
        return count++;
    };
})();
