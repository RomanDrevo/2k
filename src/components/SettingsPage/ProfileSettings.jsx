import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { injectIntl, FormattedMessage } from 'react-intl'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert2'
import Cookies from 'js-cookie'
import ReactTooltip from 'react-tooltip'
import { Fields, reduxForm } from 'redux-form'
import Phone from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import { uploadFile } from '../../_core/upload-file'
import {
  Button, DatePicker, IconButton, Panel, Popover,
  ProfilePicture, Select, TakePhotoModal, TextInput
} from '../_common'
import { dataURItoFile, validateEmail, validatePhoneNumber } from '../../_core/utils'
import { UserActions } from '../../_redux'
import './profile-settings.css'

const FILE_ACCEPT = 'image/jpeg, image/png, image/gif, .mp4, .avi, .mpg'

function validate(values, { intl: { formatMessage } }) {
  const errors = {}
  const required = formatMessage({ id: 'form_validation.required', defaultMessage: '!Required' })
  if (!values.first_name) {
    errors.first_name = required
  }

  if (!values.last_name) {
    errors.last_name = required
  }

  if (!values.email) {
    errors.email = required
  } else if (!validateEmail(values.email)) {
    errors.email = formatMessage({ id: 'form_validation.invalid_email', defaultMessage: '!Invalid email format' })
  }

  if (values.contact_number && !validatePhoneNumber(values.contact_number)) {
    errors.contact_number = formatMessage({
      id: 'form_validation.invalid_phone',
      defaultMessage: '!Invalid phone number format. Following the E.164 recommendation'
    })
  }

  if (values.birthday && moment().diff(moment(values.birthday), 'years') < 13) {
    errors.birthday = formatMessage({
      id: 'form_validation.small_age',
      defaultMessage: '!Age of 13 or lower is no valid'
    })
  }

  if (values.handle && !/^[\w_]+$/.test(values.handle)) {
    errors.handle = formatMessage({
      id: 'form_validation.invalid_handle',
      defaultMessage: '!Only lettsrs, number and the signs - _ are valid'
    })
  }

  if (values.handle && values.handle.length < 4) {
    errors.handle = formatMessage({
      id: 'form_validation.min_length',
      defaultMessage: '!Minimum {min} letters are required'
    }, { min: 4 })
  }
  return errors
}

class ProfileSettings extends React.Component {
  static propTypes = {
    pristine: PropTypes.bool,
    hideTitle: PropTypes.bool,
    handle: PropTypes.string,
    COUNTRIES: PropTypes.array,
    GENDERS: PropTypes.array,
    LANGUAGES: PropTypes.array,
    CURRENCIES: PropTypes.array,
    notification: PropTypes.object,
    userProfile: PropTypes.object,
    intl: PropTypes.object.isRequired,
    DELETE_USER_PICTURE: PropTypes.func.isRequired,
    CHANGE_USER_METADATA: PropTypes.func.isRequired,
    CREATE_USER_PICTURE: PropTypes.func.isRequired,
    UPDATE_USER_PROFILE: PropTypes.func.isRequired,
    RESTORE_ORIGINAL_PICTURE: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  state = {
    photoMenu: {},
    // uploadProgress: null,
    openTakePhotoModal: false
  }


  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  onDrop = (accepted) => {
    accepted.forEach((file) => {
      this.uploadPhoto(file)
    })
  };

  onSubmit = (values) => {
    const clonedValues = { ...values }
    const { default_currency: defaultCurrency, handle } = this.props.userProfile
    if (defaultCurrency) delete clonedValues.default_currency
    if (handle && handle === clonedValues.handle) delete clonedValues.handle
    let locale = false
    if (clonedValues.language === 'ENGLISH' && Cookies.get('locale') !== 'en') {
      Cookies.set('locale', 'en')
      locale = true
    } else if (clonedValues.language === 'HEBREW' && Cookies.get('locale') !== 'he') {
      Cookies.set('locale', 'he')
      locale = true
    }
    this.props.UPDATE_USER_PROFILE(clonedValues)
      .then(() => {
        if (locale) {
          console.log('updated')
          window.location.reload()
        }
      })
  }

  onTakePhoto = (photo) => {
    this.closeTakePhotoModal()
    const file = dataURItoFile(photo, `captured-img-${new Date().getTime()}.jpeg`, 'image/jpeg')
    file.preview = photo
    this.uploadPhoto(file)
  }

  getClientRect(trigger) {
    if (!this.container) return null

    const triggerRect = trigger.getBoundingClientRect()
    // eslint-disable-next-line
    const containerRect = ReactDOM.findDOMNode(this.container).getBoundingClientRect()

    return {
      x: triggerRect.x - containerRect.x,
      y: triggerRect.y - containerRect.y - 29,
      width: triggerRect.width,
      height: triggerRect.height
    }
  }

  setDropzoneRef = (node) => {
    this.dropzone = node
  };

  openFileDialog = () => {
    this.closePhotoMenu()
    this.dropzone.open()
  };

  closePhotoMenu = () => {
    this.setState({
      photoMenu: {}
    })
  }

  openPhotoMenu = (e) => {
    const trigger = e.currentTarget
    this.setState({
      photoMenu: {
        clientRect: this.getClientRect(trigger),
        trigger
      }
    })
  }

  handleResize = () => {
    const { photoMenu } = this.state

    if (!isEmpty(photoMenu)) {
      photoMenu.clientRect = this.getClientRect(photoMenu.trigger)
      this.setState({ photoMenu })
    }
  }

  updateUploadProgress = (progress) => {
    console.log(progress)
    // NEED REFACTOR THIS
    // this.setState({ uploadProgress: progress.toFixed(0) })
  }

  uploadPhoto = (file) => {
    const {
      CHANGE_USER_METADATA, CREATE_USER_PICTURE, UPDATE_USER_PROFILE, userProfile
    } = this.props

    const previousPicture = userProfile.profile_media_url
    CHANGE_USER_METADATA('profile_media_url', file.preview)

    return Promise.resolve(CREATE_USER_PICTURE(file.name))
      .then((res) => {
        const { media } = res
        this.updateUploadProgress(0)
        uploadFile({
          url: media.presigned_upload_url,
          file,
          progressCallback: (evt) => {
            // console.log(evt)
            this.updateUploadProgress((100 * evt.loaded) / evt.total)
          },
          doneCallback: () => {
            UPDATE_USER_PROFILE({
              profile_media_id: media.id,
              profile_media_url: media.twokey_url,
              profile_media_type: media.type
            })
            CHANGE_USER_METADATA('profile_media_url', media.twokey_url)
          },
          errorCallback: (evt) => {
            console.error('Uploading via presigned url error', evt)
            this.props.DELETE_USER_PICTURE()
            CHANGE_USER_METADATA('profile_media_url', previousPicture)
          }
        })
      // this.selectMedia(this.props.medias.find((m) => m.id === media.id))
      })
      .catch((err) => {
        console.error(err)
        CHANGE_USER_METADATA('profile_media_url', previousPicture)
      })
  }

  deletePhoto = () => {
    this.setState({ photoMenu: {} }, () => {
      const { intl: { formatMessage }, userProfile } = this.props
      swal({
        title: formatMessage({ id: 'settings.delete_photo', defaultMessage: '!Delete Photo' }),
        text: formatMessage({
          id: 'settings.delete_photo_warning',
          defaultMessage: '!This Photo will disappear from your profile.'
        }),
        showCancelButton: true,
        confirmButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' }),
        cancelButtonText: formatMessage({ id: 'main.delete', defaultMessage: '!Delete' }),
        confirmButtonClass: 'btn black-color swal transparent',
        cancelButtonClass: 'btn black-color swal transparent',
        customClass: 'border-green'
      }).then((res) => {
        if (!res.value) {
          Promise.resolve(this.props.DELETE_USER_PICTURE({
            media_id: userProfile.profile_media_id
          }))
            .then(() => {

            })
        }
      })
    })
  }

  restoreOriginalPhoto = () => {
    this.setState({ photoMenu: {} }, () => {
      const { intl: { formatMessage } } = this.props
      swal({
        title: 'Restore Original Profile Pic?',
        showCancelButton: true,
        confirmButtonClass: 'btn black-color swal transparent',
        cancelButtonClass: 'btn black-color swal transparent',
        customClass: 'border-green',
        confirmButtonText: formatMessage({ id: 'main.ok', defaultMessage: '!Ok' }),
        cancelButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' })
      }).then((res) => {
        if (res.value) {
          Promise.resolve(this.props.RESTORE_ORIGINAL_PICTURE())
            .then(() => {

            })
        }
      })
    })
  }

  openTakePhotoModal = () => {
    this.closePhotoMenu()
    this.setState({ openTakePhotoModal: true })
  }

  closeTakePhotoModal = () => {
    this.setState({ openTakePhotoModal: false })
  }

  refContainer = (e) => {
    this.container = e
  }

  renderPhotoMenu(picture) {
    const {
      photoMenu: {
        clientRect
      }
    } = this.state
    if (clientRect === undefined) return ''
    return (
      <Popover clientRect={clientRect} size={{ width: 130 }} onRequestClose={this.closePhotoMenu}>
        <div className="pop-menu-wrapper">
          <div className="pop-menu-item" onClick={this.openTakePhotoModal}>
            <FormattedMessage id="settings.take_photo" defaultMessage="!Take a Photo" />
          </div>
          <div className="pop-menu-item" onClick={this.openFileDialog}>
            <FormattedMessage id="settings.pick_photo" defaultMessage="!Pick Photo" />
          </div>
          <div className="pop-menu-item" onClick={this.restoreOriginalPhoto}>
            <FormattedMessage id="settings.restore_photo" defaultMessage="!Restore Original" />
          </div>
          {picture && (
            <div className="pop-menu-item" onClick={this.deletePhoto}>
              <FormattedMessage id="settings.delete_photo" defaultMessage="!Delete Photo" />
            </div>
          )}
        </div>
      </Popover>
    )
  }

  renderPhoto(picture) {
    const { intl: { formatMessage } } = this.props
    const firstName = this.props.userProfile.first_name || this.props.userProfile.given_name
    const lastName = this.props.userProfile.last_name || this.props.userProfile.family_name

    return (
      <Dropzone
        disableClick
        ref={this.setDropzoneRef}
        style={{ position: 'relative', height: '100%' }}
        accept={FILE_ACCEPT}
        onDrop={this.onDrop}
      >
        <div className="d-flex flex-column align-items-center mt-10 mb-10" style={{ position: 'relative' }}>
          <ProfilePicture
            size={100}
            first_name={firstName}
            last_name={lastName}
            picture={picture}
          />
          {picture && (
            <Button
              bsSize="small"
              bsType="transparent"
              title={formatMessage({ id: 'settings.edit_photo', defaultMessage: '!Edit Photo' })}
              onClick={this.openPhotoMenu}
            />
          )}
          {!picture && (
            <IconButton className="profile-photo-add" iconUrl="/img/camera_plus.png" onClick={this.openPhotoMenu} />
          )}
        </div>
      </Dropzone>
    )
  }

  renderTakePhotoModal() {
    return (<TakePhotoModal
      isOpen={this.state.openTakePhotoModal}
      onTake={this.onTakePhoto}
      onClose={this.closeTakePhotoModal}
    />)
  }

  renderFields = (fields) => {
    const {
      intl: { formatMessage, formatDate },
      handleSubmit,
      pristine,
      userProfile: { email_verified: emailVerified, created_at }
    } = this.props
    const {
      first_name, last_name, email, gender,
      birthday, contact_number, country, city,
      language, default_currency, handle
    } = fields
    const fieldClass = 'col-3 d-flex justify-content-end justify-content-sm-start text-sm-left text-right pl-40 pt-10'
    return (
      <div className="profile-settings-container">
        <div>
          <div className="row" id="settings.first_name">
            <div className={fieldClass}>
              <FormattedMessage id="settings.first_name" defaultMessage="!First Name" />
            </div>
            <div className="col-9 col-md-8">
              <TextInput
                border
                errorInside
                meta={first_name.meta}
                value={first_name.input.value}
                onChange={first_name.input.onChange}
              />
            </div>
          </div>
          <div className="row" id="settings.last_name">
            <div className={fieldClass}>
              <FormattedMessage id="settings.last_name" defaultMessage="!Last Name" />
            </div>
            <div className="col-9 col-md-8">
              <TextInput
                border
                errorInside
                meta={last_name.meta}
                value={last_name.input.value}
                onChange={last_name.input.onChange}
              />
            </div>
          </div>
          <div className="row" id="settings.i_am">
            <div className={fieldClass}>
              <FormattedMessage id="settings.i_am" defaultMessage="!I am" />
            </div>
            <div className="col-9 col-md-4 position-unset">
              <Select
                rounded
                noShadow
                white
                className="profileSelect"
                items={this.props.GENDERS}
                value={gender.input.value}
                onSelect={(item) => gender.input.onChange(item.value)}
              />
            </div>
          </div>
          <div className="row" id="settings.birth_date">
            <div className={fieldClass}>
              <FormattedMessage id="settings.birth_date" defaultMessage="!Birth Date" />
            </div>
            <div className="col-9 col-md-4">
              <DatePicker
                border
                errorInside
                showToday={false}
                defaultValue={moment().subtract(13, 'years')}
                value={birthday.input.value && birthday.input.value.length > 0
                  ? moment(birthday.input.value) : null}
                onChange={(value) => birthday.input.onChange(value.format('YYYY-MM-DD'))}
                disabledDate={(date) => moment().diff(date, 'years') < 13}
              />
            </div>
          </div>
          <div className="row" id="settings.email_address">
            <div className={fieldClass}>
              <FormattedMessage id="settings.email_address" defaultMessage="!Email Address" />
            </div>
            <div className="col-9 col-md-8">
              <TextInput
                border
                errorInside
                meta={email.meta}
                action={emailVerified && <img src="/img/verified.png" alt="verified" />}
                value={email.input.value}
                onChange={email.input.onChange}
              />
            </div>
          </div>
          <div className="row" id="settings.phone_number">
            <div className={fieldClass}>
              <FormattedMessage id="settings.phone_number" defaultMessage="!Phone Number" />
            </div>
            <div className="col-9 col-md-5">
              <div className="phone-wrapper">
                <Phone
                  meta={contact_number.meta}
                  value={contact_number.input.value}
                  onChange={contact_number.input.onChange}
                />
              </div>
              {/* <TextInput
                border
                errorInside
                meta={contact_number.meta}
                value={contact_number.input.value}
                onChange={contact_number.input.onChange}
              />*/}
            </div>
            <div className="col-md-3 d-none d-md-flex phone-value">
              <span>{contact_number.input.value}</span>
            </div>
          </div>
          <div className="row" id="settings.country">
            <div className={fieldClass}>
              <FormattedMessage id="settings.country" defaultMessage="!Country" />
            </div>
            <div className="col-9 col-md-5 position-unset">
              <Select
                rounded
                noShadow
                className="profileSelect"
                white
                items={this.props.COUNTRIES}
                value={country.input.value}
                onSelect={(item) => country.input.onChange(item.value)}
              />
            </div>
          </div>
          <div className="row" id="settings.city">
            <div className={fieldClass}>
              <FormattedMessage id="settings.city" defaultMessage="!City" />
            </div>
            <div className="col-9 col-md-5">
              <TextInput
                border
                value={city.input.value}
                onChange={city.input.onChange}
              />
            </div>
          </div>
          <div className="row" id="settings.preferred_language">
            <div className={fieldClass}>
              <FormattedMessage id="settings.preferred_language" defaultMessage="!Preferred Language" />
            </div>
            <div className="col-9 col-md-5 position-unset">
              <Select
                rounded
                noShadow
                white
                className="profileSelect"
                items={this.props.LANGUAGES}
                value={language.input.value}
                onSelect={(item) => language.input.onChange(item.value)}
              />
            </div>
          </div>
          <div className="row" id="settings.preferred_currency">
            <div className={fieldClass}>
              <FormattedMessage id="settings.preferred_currency" defaultMessage="!Preferred Currency" />
            </div>
            <div className="col-9 col-md-5 position-unset">
              <Select
                rounded
                noShadow
                white
                className="profileSelect"
                disabled={default_currency.input.value !== ''}
                items={this.props.CURRENCIES}
                value={default_currency.input.value}
                onSelect={(item) => default_currency.input.onChange(item.value)}
              />
            </div>
          </div>
          <div className="row" id="settings.handle">
            <div className={fieldClass}>
              <FormattedMessage id="settings.handle" defaultMessage="!Handle" />
            </div>
            <div className="col-9 col-md-8">
              <TextInput
                border
                errorInside
                type="url"
                meta={handle.meta}
                value={handle.input.value}
                onChange={handle.input.onChange}
                minlength="4"
                required
              />
            </div>
          </div>
          <div className="row">
            <div
              className="col-12 d-flex justify-content-end justify-content-sm-start
                align-items-center text-sm-left text-right font-xx-small pl-40"
              id="settings.member_since"
            >
              <FormattedMessage
                id="settings.member_since"
                defaultMessage="!Member Since {date}"
                values={{
                  date: formatDate(new Date(created_at))
                }}
              />
            </div>
          </div>
          <div className="row mt-30">
            <div className="col-12 d-flex justify-content-center">
              <Button
                style={{
                  background: '#1A936F', width: 150, color: 'white', textTransform: 'uppercase'
                }}
                disabledStyle={{ background: '#999999', color: '#434343' }}
                rounded
                disabled={pristine || !first_name.input.value || !last_name.input.value || !email.input.value}
                title={formatMessage({ id: 'main.save', defaultMessage: '!Save' })}
                onClick={handleSubmit(this.onSubmit)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderMaybeError() {
    return (
      <div>
        {Object.keys(this.props.notification).map((nid) => {
          const noti = this.props.notification[nid]
          return (
            <div key={`error-${nid}`} className="alert alert-danger">
              {(noti.level === 'danger') ? noti.message.details : ''}
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const {
      hideTitle,
      userProfile: {
        profile_media_url
      }
    } = this.props

    const titleEl = !hideTitle ? (
      <div>
        <div className="col-sm-auto">
          <FormattedMessage id="settings.edit_profile" defaultMessage="!Edit Profile" />
        </div>
      </div>
    ) : null

    return (
      <div>
        <ReactTooltip
          globalEventOff="click"
          place="bottom"
          type="dark"
          effect="solid"
          className="extra"
          afterHide={this.handleTooltipHide}
        >
          <div className="tooltip-content">
            <FormattedMessage tagName="span" id="media.image_change" defaultMessage="!Change" />
          </div>
          <div className="tooltip-content">
            <FormattedMessage tagName="span" id="media.image_reposition" defaultMessage="!Reposition" />
          </div>
          <div className="tooltip-content">
            <FormattedMessage tagName="span" id="media.image_update_fb" defaultMessage="!Update from Facebook" />
          </div>
          <div className="tooltip-content">
            <FormattedMessage tagName="span" id="media.image_remove" defaultMessage="!Remove" />
          </div>
        </ReactTooltip>
        <Panel
          ref={this.refContainer}
          className="black small"
          style={{ padding: 0 }}
          title={titleEl}
        >
          {this.renderPhotoMenu(profile_media_url)}
          {this.renderPhoto(profile_media_url)}
          <Fields
            names={[
              'first_name', 'last_name', 'email', 'gender', 'birthday',
              'contact_number', 'country', 'city', 'language', 'default_currency', 'handle'
            ]}
            component={this.renderFields}
          />
          {this.renderTakePhotoModal()}
        </Panel>
      </div>

    )
  }
}

export default injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const enums = state.enums.get('enums').toJS()

  const {
    Gender,
    Language,
    Currency,
    Country
  } = enums
  // const  = enums.Language
  // const  = enums.Currency
  // const Country = enums.Country

  return {
    initialValues: {
      first_name: userMetadata.first_name || userMetadata.given_name,
      last_name: userMetadata.last_name || userMetadata.family_name,
      email: userMetadata.email,
      gender: userMetadata.gender,
      birthday: userMetadata.birthdate,
      contact_number: userMetadata.contact_number,
      language: userMetadata.language,
      default_currency: userMetadata.default_currency,
      country: userMetadata.country,
      city: userMetadata.city,
      handle: userMetadata.handle
    },

    userProfile: { ...userMetadata },

    GENDERS: Gender ? Object.keys(Gender.Gender.name_to_value).map((key) =>
      ({ value: key, label: Gender.Gender.name_to_value[key] })) : [],
    LANGUAGES: Language ? Object.keys(Language.Language.name_to_value).map((key) =>
      ({ value: key, label: Language.Language.name_to_value[key] })) : [],
    CURRENCIES: Currency ? Object.keys(Currency.Currency.name_to_value).map((key) =>
      ({ value: key, label: `${key} ${Currency.Currency.name_to_value[key]}` })) : [],
    COUNTRIES: Country ? Object.keys(Country.Country.name_to_value).map((key) =>
      ({ value: key, label: Country.Country.name_to_value[key] })) : [],

    notification: state.notification.toJS()
  }
}, {
  CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  UPDATE_USER_PROFILE: UserActions.UPDATE_USER_PROFILE,
  DELETE_USER_PICTURE: UserActions.DELETE_USER_PICTURE,
  CREATE_USER_PICTURE: UserActions.CREATE_USER_PICTURE,
  RESTORE_ORIGINAL_PICTURE: UserActions.RESTORE_ORIGINAL_PICTURE
})(reduxForm({
  form: 'profile-setting-form',
  validate,
  enableReinitialize: true
})(ProfileSettings)))
