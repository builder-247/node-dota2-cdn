# node-dota2-cdn

Generates Steam CDN URLs for Dota 2 cosmetics

> [!NOTE]
> Currently running this tool requires a Dota 2 installation - in the future the file download will be automated

## Why?

Steam hosts all Dota 2 resource images on their CDN, but finding the URL is difficult. Previously one could get the
URL from the `http://api.steampowered.com/IEconDOTA2_570/GetItemIconPath/v1` API endpoint, but it has since then been deprecated.

## History

This tool is loosely based on [node-csgo-cdn](https://github.com/Step7750/node-csgo-cdn) by Step7750
