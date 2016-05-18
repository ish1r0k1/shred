# Shred.js

This plugin is generate a custom share buttons for each device.  
Simply, easily, no depend.

## Download
[shred.js](https://github.com/ish1r0k1/shred/archive/master.zip)

## Usage

```
var option = {
  text: 'Hello, world!'  
};

new Shred('selector', options);
```

## Options

|Property|Initial|Type|Discription|
|:--|:--|:--|:--|
|`text`|`document.title`|string|share message|
|`url`|location.href|string|share page url|
|`hashtags`|`null`|string|hashtag for Twitter only|
|`services`|`twitter facebook google_plus`|string|use service|
|`counts`|`false`|boolean|enable shared count|

## Supported sevices
* Twitter
* Facebook
* Google Plus
* Pocket
* Hatena Bookmark(for Japanese)
* LINE(for Japanese)

## Supported browsers

* Internet Explorer 10+
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
