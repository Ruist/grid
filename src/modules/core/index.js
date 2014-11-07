var elementClass = require('element-class');
var dirtyClean = require('@grid/dirty-clean');

module.exports = function () {

    var grid = {};

    //the order here matters because some of these depend on each other
    grid.eventLoop = require('@grid/event-loop')(grid);
    grid.decorators = require('@grid/decorators')(grid);
    grid.cellClasses = require('@grid/cell-classes')(grid);
    grid.rowModel = require('@grid/row-model')(grid);
    grid.colModel = require('@grid/col-model')(grid);
    grid.dataModel = require('@grid/simple-data-model')(grid);
    grid.virtualPixelCellModel = require('@grid/virtual-pixel-cell-model')(grid);
    grid.cellScrollModel = require('@grid/cell-scroll-model')(grid);
    grid.cellMouseModel = require('@grid/cell-mouse-model')(grid);

    grid.viewPort = require('@grid/view-port')(grid);
    grid.viewLayer = require('@grid/view-layer')(grid);

    //things with logic that also register decorators (slightly less core than the other models)
    grid.navigationModel = require('@grid/navigation-model')(grid);
    grid.pixelScrollModel = require('@grid/pixel-scroll-model')(grid);
    grid.colResize = require('@grid/col-resize')(grid);
    grid.colReorder = require('@grid/col-reorder')(grid);

    //sort functionality has no api, it just sets up an event listener
    //for now disable header click sort cause we're gonna use the click for selection instead
    //require('@grid/col-sort')(grid);


    var drawRequested = false;
    grid.requestDraw = function () {
        if (!grid.eventLoop.isRunning) {
            grid.viewLayer.draw();
        } else {
            drawRequested = true;
        }
    };

    grid.eventLoop.bind('grid-draw', function () {
        drawRequested = false;
    });

    grid.eventLoop.addExitListener(function () {
        if (drawRequested) {
            grid.viewLayer.draw();
        }
    });

    function createFocusTextArea(container) {
        var textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.left = '-100000px';
        textarea.addEventListener('focus', function () {
            if (container) {
                elementClass(container).add('focus');
            }
        });

        textarea.addEventListener('blur', function () {
            if (container) {
                elementClass(container).remove('focus');
            }
        });

        container.appendChild(textarea);
        if (!container.getAttribute('tabIndex')) {
            container.tabIndex = 0;
        }
        container.addEventListener('focus', function () {
            if (textarea) {
                textarea.focus();
            }
        });

        return textarea;
    }

    grid.build = function (container) {
        createFocusTextArea(container);
        grid.viewPort.sizeToContainer(container);
        grid.viewLayer.build(container);
        grid.eventLoop.setContainer(container);
    };

    grid.makeDirtyClean = function () {
        return dirtyClean(grid);
    };

    return grid;
};