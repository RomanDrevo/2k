import _ from 'lodash'
import moment from 'moment'

/* eslint-disable */
export const hashCode = (text) => {
  var hash = 0, i, chr;
  if (text === 0) return hash;
  for (i = 0; i < text; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
/* eslint-enable */

// currently only NIS or USD are supported
export const CURRENCIES = {
  ILS: '₪',
  USD: '$'
}

export const COUNTRIES = [
  {
    code: 'US',
    name: 'United States'
  },
  {
    code: 'IL',
    name: 'Israel'
  }
]

export const GENDERS = [{
  value: 'male',
  label: 'Male'
}, {
  value: 'female',
  label: 'Female'
}]

export const LANGUAGES = [
  { localeCode: 'he', langName: 'hebrew', localeLangName: 'עברית' },
  { localeCode: 'en', langName: 'english', localeLangName: 'English' }
]

function getClasses(oldClasses, newClasses, condition) {
  if (condition) return newClasses
  return oldClasses
}

function shortenString(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str
  return str.substr(0, str.lastIndexOf(separator, maxLen)).concat('...')
}

function copyContentToClipboard(content) {
  console.log('CONTENT ', content)
  const textArea = document.createElement('textarea')
  textArea.value = content
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

function getShareableLink(type, link) {
  switch (type) {
  case 'facebook':
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`

  case 'google-plus':
    return `https://plus.google.com/share?url=${encodeURIComponent(link)}`

  case 'twitter':
    return `https://twitter.com/home?status=${encodeURIComponent(link)}`

  case 'mail':
    return `mailto:?subject=2key&body=${link}` // TODO

  case 'messenger':
    return `fb-messenger://share/?link=${encodeURIComponent(link)}&app_id=123456789`

  case 'whatsapp':
    return `whatsapp://send?text=${encodeURIComponent(link)}`

  default:
    return ''
  }
}

const detectInactiveOffer = (offer) => (
  !offer.is_active
    || ((offer.start_date || offer.end_date)
      && !moment().isBetween(moment(offer.start_date), moment(offer.end_date)))
    || offer.is_deleted
)

export function isInt(n) {
  return !_.isNaN(Number(n)) && n % 1 === 0
}

export function isFloat(n) {
  return !_.isNaN(Number(n)) && n % 1 !== 0
}

export function formattedNumber(n) {
  if (n === 0) return '0'
  if (!n) return ''
  if (!isInt(n) && !(isFloat(n))) return n
  return n.toLocaleString()
}

export function exportToCSV(filename, rows) {
  const processRow = (row) => {
    let finalVal = ''
    for (let j = 0; j < row.length; j += 1) {
      let innerValue = row[j] ? row[j].toString() : ''
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString()
      }
      let result = innerValue.replace(/"/g, '""')
      if (result.search(/("|,|\n)/g) >= 0) {
        result = `"${result}"`
      }
      if (j > 0) {
        finalVal += ','
      }
      finalVal += result
    }
    return `${finalVal}\n`
  }

  let csvFile = ''
  for (let i = 0; i < rows.length; i += 1) {
    csvFile += processRow(rows[i])
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export function getLocationObjFromString(locationString = '') {
  const [city = '', country = ''] = locationString.split(',')
  const finalObj = {}
  if (city.trim() === '' && country.trim() === '') return null
  if (city.trim() !== '') finalObj.location_city = city.trim()
  if (country.trim() !== '' && (/^(?:israel|us)$/i)
    .test(country.trim())) {
    finalObj.location_country = country.trim().toUpperCase()
  }
  return finalObj
}

function capitalize(str) {
  if (str.length > 2) {
    return str.charAt(0) + str.slice(1).toLowerCase()
  }
  return str.toUpperCase()
}

export function getLocationString(locationObj) {
  const { location_city: locationCity, location_country: locationCountry } = locationObj
  return `${(!!locationCity && locationCity !== '' && locationCity) || ''}${
    (!!locationCity && locationCity !== '' && ',') || ''} ${
    (!!locationCountry && locationCountry !== '' && capitalize(locationCountry)) || ''}`.trim()
}

export const generateTempId = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

  return `local-${s4()}${s4()}-${s4()}`
}

export const validateEmail = (email) => {
  // eslint-disable-next-line
  const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexp.test(email.toLowerCase())
}

export const validateUrl = (url) => {
  // eslint-disable-next-line
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  return regexp.test(url)
}

export const validatePhoneNumber = (url) => {
  const regexp = /^\+[0-9]{1,15}$/
  console.log('validatePhoneNumber: ', regexp.test(url))
  return regexp.test(url)
}

export const dataURItoFile = (dataURI, filename, type) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1])
  } else {
    byteString = unescape(dataURI.split(',')[1])
  }
  // separate out the mime component
  // const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new File([ia], filename, { type })
}

export const saveHistory = (route, backup) => {
  const userProfile = localStorage.getItem('userProfile')
  const email = userProfile && JSON.parse(userProfile).email
  const historyString = localStorage.getItem('history')
  const history = historyString
    ? JSON.parse(historyString) : {}
  history[`${email}_backup`] = backup ? history[email] || '/influencer/my-activity'
    : route
  history[email] = route
  localStorage.setItem('history', JSON.stringify(history))
}

export const loadHistory = (fromBackup) => {
  const userProfile = localStorage.getItem('userProfile')
  const email = userProfile && JSON.parse(userProfile).email
  const historyString = localStorage.getItem('history')
  const history = historyString ? JSON.parse(historyString) : {}
  const route = fromBackup ? history[`${email}_backup`] || '/influencer/my-activity'
    : history[email] || '/influencer/my-activity'
  return route
}


export const currencySign = (currencies, code) => {
  const currency = _.find(currencies, (v, k) => k === code)
  return currency || null
}


export const validateNumbers = (number) => {
  const regexp = /^\d+$/
  console.log('Validating Number!!!!: ', regexp.test((number)))
  return regexp.test((number))
}

// export const validateNumbers = (evt) => {
//   const theEvent = evt || window.event
//   let key = theEvent.keyCode || theEvent.which
//   key = String.fromCharCode(key)
//   const regex = /[0-9]|\./
//   if (!regex.test(key)) {
//     theEvent.returnValue = false
//     if (theEvent.preventDefault) theEvent.preventDefault()
//   }
// }

export {
  getClasses,
  shortenString,
  copyContentToClipboard,
  getShareableLink,
  detectInactiveOffer
}
