import React from 'react'
import { render } from 'react-dom'
import { ToastContainer, style } from 'react-toastify'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import { createBrowserHistory } from 'history'
import Cookies from 'js-cookie'
import en from 'react-intl/locale-data/en'
import he from 'react-intl/locale-data/he'
import 'whatwg-fetch'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'open-iconic/font/css/open-iconic-bootstrap.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'
import auth, { initAuthProvider } from './Auth/Auth'
import { fb } from './_core/fb'
import { initService } from './_core/http'
import languages from './lang/index'
import Routes from './components/routes'
import createStore from './_redux/store'
import extendPrototypes from './_core/prototypes'
import './styles/global.css'
import './styles/modal.css'
import './styles/form.css'
import './styles/page.css'

// const $ = window.jQuery

addLocaleData([...en, ...he])
extendPrototypes()
initAuthProvider()
style({
  colorSuccess: '#1a936f',
  fontFamily: 'Roboto, Helvetica, sans-serif',
  borderRadius: '20px'
})
const locale = Cookies.get('locale') || 'en'
if (!Cookies.get('locale')) {
  Cookies.set('locale', 'en')
}
const initialState = window.INITIAL_STATE || {
/*
  intl: {
    locale,
    messages: languages[locale]
  }
*/
}
const history = createBrowserHistory()
const store = createStore(history, initialState)

if (!Cookies.get('FacebookLogin')) {
  Cookies.set('FacebookLogin', 'false')
}

/*
if (locale === 'he') {
  $('body').addClass('rtl')
} else {
  $('body').removeClass('rtl')
}
*/
initService(store, auth)
fb().then(() => {
  render(
    <Provider store={store}>
      <IntlProvider locale={locale} messages={languages[locale]} textComponent={React.Fragment}>
        <div>
          <ConnectedRouter history={history}>
            <Routes auth={auth} history={history} />
          </ConnectedRouter>
          <ToastContainer position="bottom-right" autoClose={2000} />
        </div>
      </IntlProvider>
    </Provider>,
    document.getElementById('root')
  )
})

