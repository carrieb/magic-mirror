# magic-mirror

##### Installation

```
> npm install
> npm install -g webpack
> cd semantic
> npm install -g gulp
> gulp build
```
##### Run
```
> wepback --watch
> node node-app.js
```

##### Configuration
Assumes that `BASE_MIRROR_DIR` is set as environment variable.
Searches `/config` for properties files.

##### Cron jobs
```
00 11 * * * /usr/local/bin/node ~/magic-mirror/tools/gw2-daily-job.js
```

##### Credits
* `webpack` and `babel` for client-side script compilation.
* `sharp` and `tessarat.js` for image processing and OCR.
* `multer` for request file-body handling.
* `moment` for datetimes.
* `googleapis` and `google-auth-library` for calendar support.
* `weather-icons` and `wunderground` for weather display.
* `guild wars 2 api` and `wanikani api` for game data.
* `wunderlist api` for list data.

[wireframe design](https://wireframe.cc/Cdvuhh)
