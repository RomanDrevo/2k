import React from 'react'
import Cookies from 'js-cookie'
import './LanguageSwitcher.css'

const getSupportedLocales = () => ([
  { localeCode: 'he', langName: 'hebrew', localeLangName: 'עברית' },
  { localeCode: 'en', langName: 'english', localeLangName: 'English' }
])

const getCurrentLocale = () => {
  const locales = getSupportedLocales()
  return locales.find((locale) => Cookies.get('locale') === locale.localeCode)
}


class LanguageSwitcher extends React.Component {
  localeOnClick = (e) => {
    e.preventDefault()
    Cookies.set('locale', e.currentTarget.getAttribute('data-locale-code'))
    window.location.href = '/'
  }


  render() {
    const list = getSupportedLocales().map((locale) => (
      <a
        className="dropdown-item"
        key={locale.localeCode}
        href="/lang"
        onClick={this.localeOnClick}
        data-locale-code={locale.localeCode}
      >
        {locale.localeLangName}
      </a>
    ))

    return (
      <div className="dropdown language-ticker">
        <button
          className="btn btn-link dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {getCurrentLocale().localeLangName}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {list}
        </div>
      </div>
    )
  }
}

export default LanguageSwitcher
