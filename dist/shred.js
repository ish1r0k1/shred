/*!
 * Shred.js v1.0.0
 * Generate a custom share button plugin.
 * Author: @ish1r0k1
 * Licensed under the MIT license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Shred = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SERVICES = {
  twitter: {
    shareUrl: {
      iOS: 'twitter://post?message={{text}} {{url}} {{hashtags}}',
      Web: 'http://twitter.com/share?url={{url}}&text={{text}}&hashtags={{hashtags}}'
    },
    itmssUrl: 'itmss://itunes.apple.com/jp/app/twitter/id333903271?mt=8'
  },
  facebook: {
    shareUrl: 'http://www.facebook.com/sharer.php?u={{url}}',
    countApi: 'https://graph.facebook.com/'
  },
  google_plus: {
    shareUrl: 'https://plus.google.com/share?url={{url}}'
  },
  hatebu: {
    shareUrl: 'https://b.hatena.ne.jp/add?url={{url}}',
    countApi: 'http://api.b.st-hatena.com/entry.count'
  },
  line: {
    shareUrl: {
      Android: 'intent://msg/text/{{text}} {{url}}/#Intent;scheme=line;package=jp.naver.line.android;end;',
      iOS: 'line://msg/text/{{text}} {{url}}',
      Web: 'http://line.naver.jp/R/msg/text/?{{text}}%20{{url}}'
    },
    itmssUrl: 'itmss://itunes.apple.com/jp/app/line/id443904275?mt=8'
  },
  pocket: {
    shareUrl: 'https://getpocket.com/edit?url={{url}}'
  }
};

var DEFAULT_CONFIG = {
  text: document.title,
  url: location.href,
  hashtags: null,
  services: 'twitter facebook google_plus',
  counts: false
};

var USE_OS = getOS();

var Shred = function () {
  function Shred(selector, options) {
    _classCallCheck(this, Shred);

    this.config = mergeProps(DEFAULT_CONFIG, options);
    this.$parent = typeof selector !== 'string' ? selector : document.querySelectorAll(selector);

    if (typeof this.$parent.length === 'undefined') {
      this.$parent = new Array(this.$parent);
    }

    this.generateButtons();

    return {
      test: function test() {
        console.log('hi');
        return 1;
      }
    };
  }

  _createClass(Shred, [{
    key: 'generateButtons',
    value: function generateButtons() {
      var services = this.config.services.split(' '),
          $btns = document.createDocumentFragment();

      for (var i = 0, len = services.length; i < len; i++) {
        $btns.appendChild(this.createButton(services[i]));
      }

      for (var _i = 0, _len = this.$parent.length; _i < _len; _i++) {
        this.$parent[_i].appendChild($btns);
      }
    }
  }, {
    key: 'createButton',
    value: function createButton(serviceName) {
      if (typeof SERVICES[serviceName] === 'undefined') return;

      var $wrapElem = document.createElement('div'),
          $shareBtn = document.createElement('a'),
          $countBalloon = document.createElement('a');

      var shareUrl = void 0,
          type = void 0;

      if (_typeof(SERVICES[serviceName].shareUrl) !== 'object') {
        shareUrl = SERVICES[serviceName].shareUrl;
      } else {
        if (USE_OS === 'iOS') {
          type = 'iOS';
        } else {
          type = 'Web';
        }

        shareUrl = SERVICES[serviceName].shareUrl[type];
      }

      shareUrl = this.setValue(shareUrl);

      $wrapElem.className = 'share-item share-item--' + serviceName;

      $shareBtn.className = 'share-btn';
      $shareBtn.setAttribute('href', shareUrl);
      $shareBtn.setAttribute('target', '_blank');
      $shareBtn.innerText = this.prettifyServiceName(serviceName);
      $shareBtn.addEventListener('click', this.launchPopup);

      if (type === 'iOS' && typeof SERVICES[serviceName].itmssUrl !== 'undefined') {
        $shareBtn.addEventListener('click', function () {
          location.href = SERVICES[serviceName].itmssUrl;
        });
      }

      $wrapElem.appendChild($shareBtn);

      if (this.config.counts && typeof SERVICES[serviceName].countApi !== 'undefined') {
        this.setCount($countBalloon, serviceName);
        $countBalloon.className = 'share-count';
        $countBalloon.innerText = 0;
        $wrapElem.appendChild($countBalloon);
      }

      return $wrapElem;
    }
  }, {
    key: 'setCount',
    value: function setCount(elem, serviceName) {
      var data = void 0;

      if (serviceName !== 'facebook') {
        data = { url: this.config.url };
      } else {
        data = { id: this.config.url };
      }

      getJsonp({
        url: SERVICES[serviceName].countApi,
        data: data
      }, function (res) {
        elem.innerText = res.shares || (typeof res === 'number' ? res : 0);
      });
    }
  }, {
    key: 'setValue',
    value: function setValue(url) {
      var hashtags = this.convertHashtags(this.config.hashtags, USE_OS === 'iOS');

      return url.replace('{{text}}', encodeURIComponent(this.config.text)).replace('{{url}}', encodeURIComponent(this.config.url)).replace('{{hashtags}}', encodeURIComponent(hashtags));
    }
  }, {
    key: 'prettifyServiceName',
    value: function prettifyServiceName(serviceName) {
      var result = '',
          wordArr = serviceName.split('_');

      for (var i = 0, len = wordArr.length; i < len; i++) {
        if (i >= 1) result += ' ';
        result += wordArr[i].charAt(0).toUpperCase() + wordArr[i].slice(1);;
      }

      return result;
    }
  }, {
    key: 'convertHashtags',
    value: function convertHashtags(hashtagStr, appStyle) {
      var result = '';

      if (!hashtagStr) return result;

      if (appStyle) {
        var words = this.config.hashtags.split(' ');

        for (var i = 0, len = words.length; i < len; i++) {
          if (i >= 1) result += ' ';
          result += '#' + words[i];
        }
      } else {
        result = this.config.hashtags.replace(/\s/g, ',');
      }

      return result;
    }
  }, {
    key: 'launchPopup',
    value: function launchPopup(evt) {
      evt.preventDefault();

      var href = evt.target.getAttribute('href');
      window.open(href, '', 'width=650, height=450, menubar=no, toolbar=no, scrollbars=yes');
    }
  }]);

  return Shred;
}();

exports.default = Shred;


function getOS() {
  var ua = navigator.userAgent.toLowerCase();

  if (/android/.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/.test(ua)) return 'iOS';
  if (/mac\sos\x|macintosh/.test(ua)) return 'Mac OS';
  if (/windows/.test(ua)) return 'Windows';

  return 'Unknown';
}

function getJsonp(args, callback) {
  var url = void 0;

  if (typeof args === 'string') {
    url = args;
  } else if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object') {
    url = args.url + createQuery(args.data);
  } else if (typeof args === 'undefined') {}

  var callbackName = 'jsonp_callback_' + Math.round(1000000 * Math.random()),
      script = document.createElement('script');

  window[callbackName] = function (data) {
    try {
      delete window[callbackName];
    } catch (e) {
      window[callbackName] = null;
    }

    document.body.removeChild(script);
    callback(data);
  };

  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + ('callback=' + callbackName);
  document.body.appendChild(script);
}

function createQuery(arr) {
  var result = '';

  for (var key in arr) {
    result += (result.indexOf('?') >= 0 ? '&' : '?') + (key + '=' + arr[key]);
  }

  return result;
}

function mergeProps(obj1, obj2) {
  if ((typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2)) === 'object') {
    for (var i in obj2) {
      if (obj2.hasOwnProperty(i)) {
        obj1[i] = obj2[i];
      };
    }
  }

  return obj1;
}
module.exports = exports['default'];

},{}]},{},[1])(1)
});