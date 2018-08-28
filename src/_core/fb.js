let resolve
const p = new Promise((r) => {
  resolve = r
})
/* global FB */
global.fbAsyncInit = () => {
  FB.init({
    appId: '811530135696938',
    status: true,
    xfbml: false,
    version: 'v2.11'
  })
  resolve(FB)
}

const init = (d, s, id) => {
  const fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) {
    return
  }
  const js = d.createElement(s); js.id = id
  js.src = '//connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}

init(document, 'script', 'facebook-jssdk')

// (function(d, s, id) {
//   const fjs = d.getElementsByTagName(s)[0]
//   if (d.getElementById(id)) {
//     return
//   }
//   const js = d.createElement(s); js.id = id
//   js.src = '//connect.facebook.net/en_US/sdk.js'
//   fjs.parentNode.insertBefore(js, fjs)
// }(document, 'script', 'facebook-jssdk'))

export const getPermissions = (accessToken) => new Promise((complete, reject) => {
  FB.api(
    '/me/permissions',
    { access_token: accessToken },
    (res) => {
      if (res.error) {
        reject(res.error)
      } else {
        complete(res)
      }
    }
  )
})

export const getAccounts = (accessToken) => new Promise((complete, reject) => {
  FB.api(
    // '/me/accounts?fields=is_published',
    '/me/accounts?fields=name,emails,is_published,id,phone,single_line_address,about&limit=1000',
    { access_token: accessToken },
    (res) => {
      if (res.error) {
        reject(res.error)
      } else {
        complete(res)
      }
    }
  )
})

export const fb = () => Promise.resolve(p)
