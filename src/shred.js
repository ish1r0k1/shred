const SERVICES = {
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

const DEFAULT_CONFIG = {
  text: document.title,
  url: location.href,
  hashtags: null,
  services: 'twitter facebook google_plus',
  counts:  false
};

const USE_OS = getOS();

export default class Shred {
  constructor(selector, options) {
    this.config = mergeProps(DEFAULT_CONFIG, options);
    this.$parent = typeof selector !== 'string' ? selector : document.querySelectorAll(selector);

    if( typeof this.$parent.length === 'undefined' ) {
      this.$parent = new Array( this.$parent );
    }

    this.generateButtons();

    return {
      test: () => {
        console.log('hi');
        return 1;
      }
    }
  }
  generateButtons() {
    let services = this.config.services.split(' '),
        $btns = document.createDocumentFragment();

    for( let i = 0, len = services.length; i < len; i++ ) {
      $btns.appendChild(this.createButton(services[i]));
    }

    for( let i = 0, len = this.$parent.length; i < len; i++ ) {
      this.$parent[i].appendChild($btns);
    }
  }
  createButton(serviceName) {
    if( typeof SERVICES[serviceName] === 'undefined' ) return;

    let $wrapElem = document.createElement('div'),
        $shareBtn = document.createElement('a'),
        $countBalloon = document.createElement('a');

    let shareUrl, type;

    if( typeof SERVICES[serviceName].shareUrl !== 'object' ) {
      shareUrl = SERVICES[serviceName].shareUrl;
    } else {
      if( USE_OS === 'iOS' ) {
        type = 'iOS';
      } else {
        type = 'Web';
      }

      shareUrl = SERVICES[serviceName].shareUrl[type];
    }

    shareUrl = this.setValue(shareUrl);

    $wrapElem.className = `share-item share-item--${serviceName}`;

    $shareBtn.className = 'share-btn';
    $shareBtn.setAttribute('href', shareUrl);
    $shareBtn.setAttribute('target', '_blank');
    $shareBtn.innerText = this.prettifyServiceName(serviceName);
    $shareBtn.addEventListener('click', this.launchPopup);

    if( type === 'iOS' && typeof SERVICES[serviceName].itmssUrl !== 'undefined' ) {
      $shareBtn.addEventListener('click', () => {
        location.href = SERVICES[serviceName].itmssUrl;
      });
    }

    $wrapElem.appendChild($shareBtn);

    if( this.config.counts && typeof SERVICES[serviceName].countApi !== 'undefined' ) {
      this.setCount($countBalloon, serviceName);
      $countBalloon.className = 'share-count';
      $countBalloon.innerText = 0;
      $wrapElem.appendChild($countBalloon);
    }

    return $wrapElem;
  }
  setCount(elem, serviceName) {
    let data;

    if( serviceName !== 'facebook' ) {
      data = { url: this.config.url };
    } else {
      data = { id: this.config.url };
    }

    getJsonp({
      url: SERVICES[serviceName].countApi,
      data: data
    }, (res) => {
      elem.innerText = (res.shares || (typeof res === 'number' ? res : 0));
    });
  }
  setValue(url) {
    var hashtags = this.convertHashtags(this.config.hashtags, (USE_OS === 'iOS'));

    return url.replace('{{text}}', encodeURIComponent(this.config.text))
      .replace('{{url}}', encodeURIComponent(this.config.url))
        .replace('{{hashtags}}', encodeURIComponent(hashtags));
  }
  prettifyServiceName(serviceName) {
    let result = '',
        wordArr = serviceName.split('_');

    for( var i = 0, len = wordArr.length; i < len; i++ ) {
      if( i >= 1 ) result += ' ';
      result += wordArr[i].charAt(0).toUpperCase() + wordArr[i].slice(1);;
    }

    return result;
  }
  convertHashtags(hashtagStr, appStyle) {
    let result = '';

    if( !hashtagStr ) return result;

    if( appStyle ) {
      let words = this.config.hashtags.split(' ');

      for( let i = 0, len = words.length; i < len; i++ ) {
        if( i >= 1 ) result += ' ';
        result += `#${words[i]}`;
      }
    } else {
      result = this.config.hashtags.replace(/\s/g, ',');
    }

    return result;
  }
  launchPopup(evt) {
    evt.preventDefault();

    let href = evt.target.getAttribute('href');
    window.open(href, '', 'width=650, height=450, menubar=no, toolbar=no, scrollbars=yes');
  }
}

function getOS() {
  let ua = navigator.userAgent.toLowerCase();

  if( /android/.test(ua) ) return 'Android';
  if( /iphone|ipad|ipod/.test(ua) ) return 'iOS';
  if( /mac\sos\x|macintosh/.test(ua) ) return 'Mac OS';
  if( /windows/.test(ua) ) return 'Windows';

  return 'Unknown';
}

function getJsonp(args, callback) {
  let url;

  if( typeof args === 'string' ) {
    url = args;
  } else if( typeof args === 'object' ) {
    url = args.url + createQuery(args.data);
  } else if( typeof args === 'undefined' ) { }

  let callbackName = `jsonp_callback_${Math.round( 1000000 * Math.random() )}`,
      script = document.createElement('script');

  window[callbackName] = (data) => {
    try {
      delete window[callbackName];
    } catch(e) {
      window[callbackName] = null;
    }

    document.body.removeChild(script);
    callback(data);
  };

  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + `callback=${callbackName}`;
  document.body.appendChild(script);
}

function createQuery(arr) {
  let result = '';

  for( let key in arr ) {
    result += (result.indexOf('?') >= 0 ? '&' : '?') + `${key}=${arr[key]}`;
  }

  return result;
}

function mergeProps(obj1, obj2) {
  if( typeof obj2 === 'object' ) {
    for( let i in obj2 ) {
      if( obj2.hasOwnProperty(i) ) {
        obj1[i] = obj2[i];
      };
    }
  }

  return obj1;
}
