### Git Workflow
There are two branches in this repo: develop and master. These branches are protected - meaning you need to open a merge request from your feature branch to them and wait for the request's approval.

When you start working on your feature/bug fix, make sure to branch out from the "develop" branch.
This will ensure you have the latest code.

Steps to push origin
Once you are done developing your feature/bug fix, make sure to update your branch with the latest code from the develop branch, doing so will ensure the merge request will not fail.


### Workflow and libraries

These are the following libraries that are in use for development:

* sass/scss
* create-react-app
* react-redux
* react-intl

Also, All mock data is available inside the src/models/example-responses folder.

#### Using Bootstrap SCSS Lib

These are mixins that come from node_modules/bootstrap/scss/ check package.json for more details


#### Local Configuration


please create a file under the src folder named "config.js", containing the following lines:

this file should not be committed and will be used for the entirety of the app config.

```
export const CONFIG = {
  domain: '2key.auth0.com',
  clientId: '6hGX07E1oKmLlZXg3SfudjTn2r9EkpNO',
  callbackUrl: 'http://localhost:3000',
  apiKey: 'WTUpcPorpsUBLfhjFgtM1ZM2ffBUTV76rWB47Co0',
  apiUrl: 'https://test.api.2key.co'
}
```

This example will be used in local environments.
