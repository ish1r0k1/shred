# Shred.js

This plugin is generate a custom share buttons for each device.  
Simply, easily and no depend.

Support SNS Services:

* Twitter
* Facebook
* Google Plus
* Pocket
* Hatena Bookmark(for Japanese)
* LINE(for Japanese)

## Download

[Downlaod](https://github.com/ish1r0k1/shred/archive/master.zip)

## Usage

```
var options = {
  text: 'Hello, world!'  
};

new Shred('selector', options);
```

## Options

|Property|Initial|Type|Discription|
|:--|:--|:--|:--|
|`selector`|string or element|generated element insert selector|
|`text`|`document.title`|string|share message|
|`url`|location.href|string|share page url|
|`hashtags`|`null`|string|hashtag for Twitter|
|`services`|`twitter facebook google_plus`|string|use service|
|`counts`|`false`|boolean|show shared count|

## Supported sevices
* Twitter
* Facebook
* Google Plus
* Pocket
* Hatena Bookmark(for Japanese)
* LINE(for Japanese)

## Supported browsers

* Microsoft Internet Explorer 8+
* FireFox
* Google Chrome
* Apple Safari
* Android 2.3+
* iOS 8+


## Change logs

`1.0.0` / Mar 31, 2016
* Release


## License

Copyright (c) 2016 Hiroki ISHIWATARI
