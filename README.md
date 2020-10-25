At some point in time [Bernadette Banner](https://www.youtube.com/channel/UCSHtaUm-FjUps090S7crO4Q) announced that she will be unlisting some of her sewing videos.

Well… we could create an playlist and manually add all of those videos… or we could write a program to do this for us.

# Instructions
1. Usual Node things (`npm i` etc.)
2. `./node_modules/.bin/tsc`
3. Follow [Node.js Quickstart](https://developers.google.com/youtube/v3/quickstart/nodejs#step_1_turn_on_the) and paste `client_secret.json` into root directory (this is a standard OAuth2 thing)
4. `node ./dist/app.js`

Please note that the 1st time you run the app it will fail because of lack of `authorization code` (thing that is used to connect app and the user that runs the app), but it will print a link at which you can obtain one. After doing this please paste this code into `client_authorization_code.json`.

# YouTube api
See:
- [docs](https://developers.google.com/youtube/v3/code_samples/javascript)
- [API Reference](https://developers.google.com/youtube/v3/docs/?apix=true)
