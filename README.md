# 酔いどれApex Trucker

## yoidore-apex-tracker

「酔いどれApexLegends」で利用できる戦績トラッカーです。利用方法は下記を参照してください。  
This is an Apex Legends performance tracker for "The Drunkards' ApexLegends" group. See below for instructions on how to use it.

## For Developers(開発者向け)

Before development, you need to install Node.js. I recommend that you install the latest version.

### Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

`'API_KEY'` must be added to the environment variable. The API key can be obtained from the TRN Developer(https://tracker.gg/) website.

Many browsers have Cross-Origin Resource Sharing(CORS) disabled by default. Therefore, if you launch the server on your localhost and browse with a browser, you may get an error. In that case, please refer to your browser's support page to enable CORS (if you are using Google Chrome, you can enable it by using the `--disable-web-security` flag).

This software is provided under the MIT License. The libraries included in this software are provided under the license of the libraries. The developer (noribento) assumes no responsibility for any damage caused by using this software. Please use it at your own risk.
