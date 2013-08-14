// testMediaQuery optimized

var
testMediaQuery = (function () {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    if ( matchMedia ) {
        return function (mq) {
            return matchMedia(mq).matches;
        };
    }

    return function (mq) {
        var bool;

        injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
            bool = (window.getComputedStyle ?
                getComputedStyle(node, null) :
                node.currentStyle)['position'] == 'absolute';
        });

        return bool;
    };
})();