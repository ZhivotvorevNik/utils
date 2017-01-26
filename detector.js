/* jshint maxparams: 4*/

/**
 * Creates a new Detector
 * @constructor
 */
function Detector() {
    'use strict';
    var docElement = document.documentElement;

    return {
        /**
         * Checks for input placeholder support
         * @returns {Boolean} state of support
         */
        isPlaceholderSupported: function () {
            return 'placeholder' in document.createElement('input');
        },
        /**
         * Returns css3 transform property name
         * Empty string for no support
         * @returns {String}
         */
        getCSS3TransformProperty: function () {
            var style = document.documentElement.style,
                names = ['transform', 'MozTransform', 'MsTransform', 'msTransform', 'WebkitTransform', 'OTransform'],
                res = '';
            for (var i = 0, len = names.length; i < len; ++i) {
                if (style[names[i]] !== undefined) {
                    res = names[i];
                    break;
                }
            }
            this.getCSS3TransformProperty = function () {
                return res;
            };
            return res;
        },

        /**
         * Checks for support dataURL
         * @param {Function} callback function fired  with result
         */
        checkDataURLSupport: function (callback) {

            var data = new Image();
            data.onload = data.onerror = function () {
                callback(this.width === 1 && this.height === 1);
            };
            data.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        },

        /**
         * Checks for activeX support
         * @returns {Boolean} if activeX is supported returns true
         */
        isActivexEnabled: function () {
            var supported = false;
            try {
                supported = !!new window.ActiveXObject('htmlfile');
            } catch (e) {
                supported = false;
            }

            return supported;
        },

        /**
         * Checks for win64 platform
         * @returns {Boolean} state of support
         */
        isWin64: function () {
            return window.navigator && window.navigator.platform === 'Win64';
        },

        /**
         * Checks for fullscreen mode
         * @returns {Boolean} state of mode
         */
        isFullScreen: function () {

            return window.innerWidth &&
                window.screen &&
                window.screen.width &&
                window.screen.height &&
                window.innerHeight &&
                (window.innerWidth === screen.width && window.innerHeight === screen.height);

        },

        /**
         * Checks for IE in metro mode
         * @returns {Boolean} if it is IE in Metro mode returns true
         */
        isIEMetroMode: function () {
            return this.isFullScreen() && this.isWin64() && !this.isActivexEnabled();
        },

        /**
         * Checks for support SVG
         * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg.js
         * @returns {Boolean} state of support SVG
         */
        isSVGSupported: function () {
            // Проблемы в опере с свг:
            // Зум
            // Yosemite
            if ('opera' in window) {
                return false;
            }

            var div = document.createElement('svg');
            div.innerHTML = '<svg/>';
            return div.firstChild && div.firstChild.namespaceURI === 'http://www.w3.org/2000/svg';
        },
        isAnimationSupported: function() {
            if ('opera' in window) {
                /* В старой опере анимируемые слои залипают */
                return false;
            }
            var style = document.documentElement.style,
                names = ['animationName', 'webkitAnimationName'];
            for (var i = 0, l = names.length; i < l; i++) {
                if (style[names[i]] !== undefined) {
                    return true;
                }
            }
        },
        /**
         * Позволяет узнать размер шрифта по умолчанию установленный пользователем.
         * Исходит из того, что по умолчанию 1em = 16px.
         *
         * @returns {String} Список классов связанных с размером шрифта.
         */
        getUserFontSize: function() {
            var cssClasses = [],
                defaultFontSizePx = 16,
                prefix = 'i-ua_user-font-size_',
                measure = document.createElement('div'),
                size, value;

            measure.style.height = '1em';
            docElement.appendChild(measure);
            size = parseInt(measure.offsetHeight);
            docElement.removeChild(measure);

            value = (size === defaultFontSizePx) ? 'normal' : ((size < defaultFontSizePx ? 'small' : 'large'));

            cssClasses.push(prefix + value);
            cssClasses.push(prefix + size + 'px');

            return cssClasses.join(' ');
        }
    };
}
/**
 * Creates a plain map for values
 * @constructor
 */
function MyMap() {
    this.rules = {};
    this.rulesData = [];

}
MyMap.prototype = {

    /**
     * Appends rule to map
     * @param {String} rule appended value both as key and as value
     */
    add: function (rule) {
        rule = rule || null;

        if (rule && !this.rules[rule]) {
            this.rulesData.push(rule);
            this.rules[rule] = this.rulesData.length - 1;
        }
        return this;
    },

    /**
     * Returns value by key
     * @param {String} key for returned value
     * @returns {String} Returns existed value or null
     */
    get: function (key) {
        var r = this.rules[key];
        return r && this.rulesData[r] || null;
    },

    /**
     * Returns all values in map
     * @returns {String} Returns all stored values as string
     */
    getAll: function () {
        return this.rulesData.join(' ');
    }

};

// set instance of Detector for work to global namespace
var detector = new Detector();

(function () {
    var m = new MyMap(),
        doc;

    m.add('js')
        .add('i-ua_placeholder_' + (detector.isPlaceholderSupported() ? 'yes' : 'no'))
        .add(detector.isIEMetroMode() && 'm-ie10-metro')
        .add(detector.isSVGSupported() ? 'i-ua_inlinesvg_yes m-svg' : 'i-ua_inlinesvg_no no-data-url')
        .add(detector.isAnimationSupported() && 'i-ua_animation_yes')
        .add(this.device && 'm-touch')
        .add(detector.getUserFontSize());

    detector.checkDataURLSupport(function (isSupported) {
        if (!isSupported) {
            document.documentElement.className += ' no-data-url';
        }
    });

    if (this.document && this.document.documentElement) {
        doc = this.document.documentElement;
        doc.className = doc.className.replace('i-ua_js_no', 'i-ua_js_yes') + ' ' + m.getAll();
    }

})();
