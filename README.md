# node-dota2-cdn

Generates Steam CDN URLs for Dota 2 cosmetics

> [!CAUTION]
> This method does not work for images using DXT compression, you can recognize the bad hashes starting with `da39a3ee` 

## Why?

Steam hosts all Dota 2 resource images on their CDN, but finding the URL is difficult. Previously one could get the
URL from the `http://api.steampowered.com/IEconDOTA2_570/GetItemIconPath/v1` API endpoint, but it has since then been deprecated.
