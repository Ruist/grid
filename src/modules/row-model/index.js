module.exports = function (_grid) {
    var grid = _grid;

    var api = require('@grid/abstract-row-col-model').default(grid, 'row', 'height', 30);

    return api;
};