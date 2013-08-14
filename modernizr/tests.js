// The *new* flexbox
// dev.w3.org/csswg/css3-flexbox

tests['flexbox'] = function() {
    return testPropsAll('flexWrap');
};

// The *old* flexbox
// www.w3.org/TR/2009/WD-css3-flexbox-20090723/

tests['flexboxlegacy'] = function() {
    return testPropsAll('boxDirection');
};

// On the S60 and BB Storm, getContext exists, but always returns undefined
// so we actually have to call getContext() to verify
// github.com/Modernizr/Modernizr/issues/issue/97/

tests['canvas'] = function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

tests['canvastext'] = function() {
    return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
};

// webk.it/70117 is tracking a legit WebGL feature detect proposal

// We do a soft detect which may false positive in order to avoid
// an expensive context creation: bugzil.la/732441

tests['webgl'] = function() {
    return !!window.WebGLRenderingContext;
};

/*
 * The Modernizr.touch test only indicates if the browser supports
 *    touch events, which does not necessarily reflect a touchscreen
 *    device, as evidenced by tablets running Windows 7 or, alas,
 *    the Palm Pre / WebOS (touch) phones.
 *
 * Additionally, Chrome (desktop) used to lie about its support on this,
 *    but that has since been rectified: crbug.com/36415
 *
 * We also test for Firefox 4 Multitouch Support.
 *
 * For more info, see: modernizr.github.com/Modernizr/touch.html
 */

tests['touch'] = function() {
    var bool;

    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        bool = true;
    } else {
        injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
        });
    }

    return bool;
};


// geolocation is often considered a trivial feature detect...
// Turns out, it's quite tricky to get right:
//
// Using !!navigator.geolocation does two things we don't want. It:
//   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
//   2. Disables page caching in WebKit: webk.it/43956
//
// Meanwhile, in Firefox < 8, an about:config setting could expose
// a false positive that would throw an exception: bugzil.la/688158

tests['geolocation'] = function() {
    return 'geolocation' in navigator;
};


tests['postmessage'] = function() {
    return !!window.postMessage;
};


// Chrome incognito mode used to throw an exception when using openDatabase
// It doesn't anymore.
tests['websqldatabase'] = function() {
    return !!window.openDatabase;
};

// Vendors had inconsistent prefixing with the experimental Indexed DB:
// - Webkit's implementation is accessible through webkitIndexedDB
// - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
// For speed, we don't test the legacy (and beta-only) indexedDB
tests['indexedDB'] = function() {
    return !!testPropsAll("indexedDB", window);
};

// documentMode logic from YUI to filter out IE8 Compat Mode
//   which false positives.
tests['hashchange'] = function() {
    return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
};

// Per 1.6:
// This used to be Modernizr.historymanagement but the longer
// name has been deprecated in favor of a shorter and property-matching one.
// The old API is still available in 1.6, but as of 2.0 will throw a warning,
// and in the first release thereafter disappear entirely.
tests['history'] = function() {
    return !!(window.history && history.pushState);
};

tests['draganddrop'] = function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

// FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
// will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
// FF10 still uses prefixes, so check for it until then.
// for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
tests['websockets'] = function() {
    return 'WebSocket' in window || 'MozWebSocket' in window;
};


// css-tricks.com/rgba-browser-support/
tests['rgba'] = function() {
    // Set an rgba() color and check the returned value

    setCss('background-color:rgba(150,255,150,.5)');

    return contains(mStyle.backgroundColor, 'rgba');
};

tests['hsla'] = function() {
    // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
    //   except IE9 who retains it as hsla

    setCss('background-color:hsla(120,40%,100%,.5)');

    return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
};

tests['multiplebgs'] = function() {
    // Setting multiple images AND a color on the background shorthand property
    //  and then querying the style.background property value for the number of
    //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

    setCss('background:url(https://),url(https://),red url(https://)');

    // If the UA supports multiple backgrounds, there should be three occurrences
    //   of the string "url(" in the return value for elemStyle.background

    return (/(url\s*\(.*?){3}/).test(mStyle.background);
};



// this will false positive in Opera Mini
//   github.com/Modernizr/Modernizr/issues/396

tests['backgroundsize'] = function() {
    return testPropsAll('backgroundSize');
};

tests['borderimage'] = function() {
    return testPropsAll('borderImage');
};


// Super comprehensive table about all the unique implementations of
// border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

tests['borderradius'] = function() {
    return testPropsAll('borderRadius');
};

// WebOS unfortunately false positives on this test.
tests['boxshadow'] = function() {
    return testPropsAll('boxShadow');
};

// FF3.0 will false positive on this test
tests['textshadow'] = function() {
    return document.createElement('div').style.textShadow === '';
};


tests['opacity'] = function() {
    // Browsers that actually have CSS Opacity implemented have done so
    //  according to spec, which means their return values are within the
    //  range of [0.0,1.0] - including the leading zero.

    setCssAll('opacity:.55');

    // The non-literal . in this regex is intentional:
    //   German Chrome returns this value as 0,55
    // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
    return (/^0.55$/).test(mStyle.opacity);
};


// Note, Android < 4 will pass this test, but can only animate
//   a single property at a time
//   daneden.me/2011/12/putting-up-with-androids-bullshit/
tests['cssanimations'] = function() {
    return testPropsAll('animationName');
};


tests['csscolumns'] = function() {
    return testPropsAll('columnCount');
};


tests['cssgradients'] = function() {
    /**
     * For CSS Gradients syntax, please see:
     * webkit.org/blog/175/introducing-css-gradients/
     * developer.mozilla.org/en/CSS/-moz-linear-gradient
     * developer.mozilla.org/en/CSS/-moz-radial-gradient
     * dev.w3.org/csswg/css3-images/#gradients-
     */

    var str1 = 'background-image:',
        str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
        str3 = 'linear-gradient(left top,#9f9, white);';

    setCss(
        // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
        (str1 + '-webkit- '.split(' ').join(str2 + str1) +
            // standard syntax             // trailing 'background-image:'
            prefixes.join(str3 + str1)).slice(0, -str1.length)
    );

    return contains(mStyle.backgroundImage, 'gradient');
};


tests['cssreflections'] = function() {
    return testPropsAll('boxReflect');
};


tests['csstransforms'] = function() {
    return !!testPropsAll('transform');
};


tests['csstransforms3d'] = function() {

    var ret = !!testPropsAll('perspective');

    // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
    //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
    //   some conditions. As a result, Webkit typically recognizes the syntax but
    //   will sometimes throw a false positive, thus we must do a more thorough check:
    if ( ret && 'webkitPerspective' in docElement.style ) {

        // Webkit allows this media query to succeed only if the feature is enabled.
        // `@media (transform-3d),(-webkit-transform-3d){ ... }`
        injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
        });
    }
    return ret;
};


tests['csstransitions'] = function() {
    return testPropsAll('transition');
};


/*>>fontface*/
// @font-face detection routine by Diego Perini
// javascript.nwbox.com/CSSSupport/

// false positives:
//   WebOS github.com/Modernizr/Modernizr/issues/342
//   WP7   github.com/Modernizr/Modernizr/issues/538
tests['fontface'] = function() {
    var bool;

    injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
        var style = document.getElementById('smodernizr'),
            sheet = style.sheet || style.styleSheet,
            cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

        bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
    });

    return bool;
};
/*>>fontface*/

// CSS generated content detection
tests['generatedcontent'] = function() {
    var bool;

    injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
        bool = node.offsetHeight >= 3;
    });

    return bool;
};

// These tests evaluate support of the video/audio elements, as well as
// testing what types of content they support.
//
// We're using the Boolean constructor here, so that we can extend the value
// e.g.  Modernizr.video     // true
//       Modernizr.video.ogg // 'probably'
//
// Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
//                     thx to NielsLeenheer and zcorpan

// Note: in some older browsers, "no" was a return value instead of empty string.
//   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
//   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

tests['video'] = function() {
    var elem = document.createElement('video'),
        bool = false;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
    try {
        if ( bool = !!elem.canPlayType ) {
            bool      = new Boolean(bool);
            bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

            // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
            bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

            bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
        }

    } catch(e) { }

    return bool;
};

tests['audio'] = function() {
    var elem = document.createElement('audio'),
        bool = false;

    try {
        if ( bool = !!elem.canPlayType ) {
            bool      = new Boolean(bool);
            bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
            bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

            // Mimetypes accepted:
            //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   bit.ly/iphoneoscodecs
            bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
            bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
        }
    } catch(e) { }

    return bool;
};

// In FF4, if disabled, window.localStorage should === null.

// Normally, we could not test that directly and need to do a
//   `('localStorage' in window) && ` test first because otherwise Firefox will
//   throw bugzil.la/365772 if cookies are disabled

// Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
// will throw the exception:
//   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
// Peculiarly, getItem and removeItem calls do not throw.

// Because we are forced to try/catch this, we'll go aggressive.

// Just FWIW: IE8 Compat mode supports these features completely:
//   www.quirksmode.org/dom/html5.html
// But IE8 doesn't support either with local files

tests['localstorage'] = function() {
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
};

tests['sessionstorage'] = function() {
    try {
        sessionStorage.setItem(mod, mod);
        sessionStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
};


tests['webworkers'] = function() {
    return !!window.Worker;
};


tests['applicationcache'] = function() {
    return !!window.applicationCache;
};


// Thanks to Erik Dahlstrom
tests['svg'] = function() {
    return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
};

// specifically for SVG inline in HTML, not within XHTML
// test page: paulirish.com/demo/inline-svg
tests['inlinesvg'] = function() {
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
};

// SVG SMIL animation
tests['smil'] = function() {
    return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
};

// This test is only for clip paths in SVG proper, not clip paths on HTML content
// demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

// However read the comments to dig into applying SVG clippaths to HTML content here:
//   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
tests['svgclippaths'] = function() {
    return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
};

/*>>webforms*/
// input features and input types go directly onto the ret object, bypassing the tests loop.
// Hold this guy to execute in a moment.
function webforms() {
    /*>>input*/
    // Run through HTML5's new input attributes to see if the UA understands any.
    // We're using f which is the <input> element created early on
    // Mike Taylr has created a comprehensive resource for testing these attributes
    //   when applied to all input types:
    //   miketaylr.com/code/input-type-attr.html
    // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

    // Only input placeholder is tested while textarea's placeholder is not.
    // Currently Safari 4 and Opera 11 have support only for the input placeholder
    // Both tests are available in feature-detects/forms-placeholder.js
    Modernizr['input'] = (function( props ) {
        for ( var i = 0, len = props.length; i < len; i++ ) {
            attrs[ props[i] ] = !!(props[i] in inputElem);
        }
        if (attrs.list){
            // safari false positive's on datalist: webk.it/74252
            // see also github.com/Modernizr/Modernizr/issues/146
            attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
        }
        return attrs;
    })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
    /*>>input*/

    /*>>inputtypes*/
    // Run through HTML5's new input types to see if the UA understands any.
    //   This is put behind the tests runloop because it doesn't return a
    //   true/false like all the other tests; instead, it returns an object
    //   containing each input type with its corresponding true/false value

    // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
    Modernizr['inputtypes'] = (function(props) {

        for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

            inputElem.setAttribute('type', inputElemType = props[i]);
            bool = inputElem.type !== 'text';

            // We first check to see if the type we give it sticks..
            // If the type does, we feed it a textual value, which shouldn't be valid.
            // If the value doesn't stick, we know there's input sanitization which infers a custom UI
            if ( bool ) {

                inputElem.value         = smile;
                inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                    docElement.appendChild(inputElem);
                    defaultView = document.defaultView;

                    // Safari 2-4 allows the smiley as a value, despite making a slider
                    bool =  defaultView.getComputedStyle &&
                        defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                        // Mobile android web browser has false positive, so must
                        // check the height to see if the widget is actually there.
                        (inputElem.offsetHeight !== 0);

                    docElement.removeChild(inputElem);

                } else if ( /^(search|tel)$/.test(inputElemType) ){
                    // Spec doesn't define any special parsing or detectable UI
                    //   behaviors so we pass these through as true

                    // Interestingly, opera fails the earlier test, so it doesn't
                    //  even make it here.

                } else if ( /^(url|email)$/.test(inputElemType) ) {
                    // Real url and email support comes with prebaked validation.
                    bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                } else {
                    // If the upgraded input compontent rejects the :) text, we got a winner
                    bool = inputElem.value != smile;
                }
            }

            inputs[ props[i] ] = !!bool;
        }
        return inputs;
    })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    /*>>inputtypes*/
}
/*>>webforms*/