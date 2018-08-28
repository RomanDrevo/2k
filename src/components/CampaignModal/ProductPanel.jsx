import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { Button, IconButton, LeftRightSwitch, Panel, Select, TextInput, ThumbnailView } from '../../components/_common'
import { MediaActions, ProductActions } from '../../_redux'
import { fetchAPI } from '../../_core/http'
import Duplicate from './Duplicate'
import HostedSite from './HostedSite'
import HostedSiteView from './HostedSiteView'
import './product-panel.css'

class ProductPanel extends React.Component {
  static propTypes = {
    editing: PropTypes.bool,
    nameChangedByUser: PropTypes.bool,
    business_id: PropTypes.number,
    product_id: PropTypes.number,
    products: PropTypes.array,
    sites: PropTypes.array,
    fields: PropTypes.object,
    duplicationErrors: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    CREATE_HOSTED_SITE: PropTypes.func.isRequired,
    CREATE_PRODUCT: PropTypes.func.isRequired,
    UPDATE_PRODUCT: PropTypes.func.isRequired,
    FETCH_HOSTED_SITE_LIST: PropTypes.func.isRequired,
    FETCH_MEDIA_LIST: PropTypes.func.isRequired,
    UPDATE_HOSTED_SITE: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      enableProductName: false,
      enableNewProduct: true,
      createNewSite: false,
      loadingProducts: false,
      loadingSites: false,
      productName: '',

      error: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fields.product_id.input.value !== this.props.fields.product_id.input.value) {
      if (!this.state.loadingSites) {
        this.selectProduct(nextProps.fields.product_id.input)
      }
    }
  }

  onSubmitNewSite = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const name = this.newSiteName.value()
    const url = this.newSiteUrl.value()
    const product_id = this.props.fields.product_id.input.value
    this.setState({ createLoading: true })
    const promise =
      this.props.CREATE_HOSTED_SITE({ name, product_id, original_landing_page_url: url })
    Promise.resolve(promise)
      .then((res) => {
        this.setState({ createNewSite: false, createLoading: false })
        this.selectHostedSite(res.hosted_site, true)
      })
      .catch(() => {
        this.setState({ createLoading: false })
      })
  }

  onNewProductClicked = (e) => {
    e.preventDefault()
    this.clearError('productName')
    this.selectHostedSite(null, false)
    this.setState({ enableProductName: true, productName: '' }, () => {
      setTimeout(() => {
        this.productName.focus()
      }, 100)
    })
  }

  onSubmitProductName = (name) => {
    const { intl: { formatMessage } } = this.props
    if (name === this.state.productName) {
      this.setState({ enableNewProduct: false, enableProductName: false })
      return
    }
    this.setState({
      enableNewProduct: false,
      enableProductName: false,
      productName: name
    })
    const {
      CREATE_PRODUCT, UPDATE_PRODUCT, business_id, product_id
    } = this.props

    if (product_id) {
      toast.info(formatMessage({
        id: 'campaign.updating_product',
        defautlMessage: '!Updating product {name}'
      }, { name }))
      Promise.resolve(UPDATE_PRODUCT({ business_id, product_id, name }))
        .then((res) => {
          this.selectProduct({ value: res.product.id })
          this.setState({ enableNewProduct: true })
          toast.dismiss()
          toast.info(formatMessage({
            id: 'campaign.updated_product',
            defautlMessage: '!Product {name} updated'
          }, { name }))
        })
        .catch(() => {
          this.setError('productName')
          this.setState({ enableNewProduct: true })
        })
    } else {
      toast.info(formatMessage({
        id: 'campaign.creating_product',
        defautlMessage: '!Creating product {name}'
      }, { name }))
      Promise.resolve(CREATE_PRODUCT({ business_id, name }))
        .then((res) => {
          this.selectProduct({ value: res.product.id })
          toast.dismiss()
          toast.info(formatMessage({
            id: 'campaign.created_product',
            defautlMessage: '!Product {name} created'
          }, { name }))
        })
        .catch(() => this.setError('productName'))
        .finally(() => {
          this.setState({ enableNewProduct: true })
        })
    }
  }

  onNext = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.props.onNext) {
      this.props.onNext()
    }
  }

  onDuplicateClose = (statusCode, success = false) => {
    /*
    * Duplication success: "DUPLICATION_SUCCESS" - 1
    * Duplication fail: "DUPLICATION_FAIL" - 0
    * Re-duplication: "REDUPLICATION" - 2
    * Re-duplication rejected by user: "REDUPLICATION_REJECTED" - 3
    */
    const duplicationKeys = {
      0: 'Duplication fail',
      1: 'Duplication success',
      2: 'Re-duplication',
      3: 'Re-duplication rejected by user'
    }
    const { fields } = this.props
    const { hosted } = this.state
    this.setState({ isDuplicateOpen: false })
    if (statusCode === 1) {
      fields.hosted_site_id.input.onChange(hosted.id)
      if (this.props.onNext && !this.state.next) {
        this.props.onNext()
        this.setState({ next: true })
      }
    } else if (statusCode === 2) {
      fields.hosted_site_id.input.onChange(null)
      this.showCreateNewSite()
    } else {
      fields.hosted_site_id.input.onChange(null)
      this.setState({ hosted: null })
    }
    fetchAPI('hosted/error', {
      method: 'POST',
      body: JSON.stringify({
        hosted_site_id: hosted.id,
        duplication_funnel_error:
          this.props.duplicationErrors[duplicationKeys[!success ? statusCode : (statusCode === 1 && 1) || 0]]
      })
    }).catch(() => {})
  }

  onViewSiteClick = (url) => {
    this.setState({ hostedUrl: url, hostedIsOpen: true })
  }

  onHostedClose = () => this.setState({ hostedUrl: null, hostedIsOpen: false })

  setError = (key, msg) => {
    const { error } = this.state
    error[key] = msg || this.props.intl.formatMessage({
      id: 'campaign.default_error_msg',
      defaultMessage: '!Error! Try again later!'
    })

    this.setState({ error })
  }

  clearError = (key) => {
    const { error } = this.state
    error[key] = null
    this.setState({ error })
  }

  showCreateNewSite = () => {
    if (!this.props.fields.product_id.input.value) {
      return
    }
    this.setState({ createNewSite: true })
  }

  hideCreateNewSite = () => {
    this.setState({ createNewSite: false })
  }

  enableProductName = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ enableProductName: true }, () => {
      setTimeout(() => {
        this.productName.focus()
      }, 100)
    })
  };

  selectProduct = (item) => {
    if (!item || !item.value) return
    const product_id = item.value
    const { fields, FETCH_HOSTED_SITE_LIST, products } = this.props
    fields.product_id.input.onChange(product_id)
    this.setState({ loadingSites: true })
    Promise.resolve(FETCH_HOSTED_SITE_LIST(product_id))
      .then(() => {
        // console.log(res)
        // if (res.items.length > 0) {
        //   this.selectHostedSite(res.items[0], false)
        // }
        this.setState({ loadingSites: false })
      })
      .catch(() => {
        this.setState({ loadingSites: false })
      })
    const product = products.find((p) => (p.id === product_id))
    this.setState({
      enableProductName: false,
      enableNewProduct: false,
      productName: product && product.name
    })
  };

  selectHostedSite = (item, openModal) => {
    const {
      fields, FETCH_MEDIA_LIST, business_id, nameChangedByUser,
      editing, onNext
    } = this.props

    fields.hosted_site_id.input.onChange(item && item.id)
    if (onNext && !this.state.next && !editing) {
      onNext()
      this.setState({ next: true })
    }
    if (item && item.id) {
      this.setState({ hosted: item })
      if (!nameChangedByUser && !editing) {
        fields.name.input.onChange(`${this.state.productName} ${item.id} ${moment().format('YYYYMMDD')}`)
      }
      if (openModal) {
        this.setState({ isDuplicateOpen: true })
      }
      FETCH_MEDIA_LIST({ business_id, hosted_site_id: item.id })
    }
  }

  refNewSiteName = (e) => {
    this.newSiteName = e
  }

  refNewSiteUrl = (e) => {
    this.newSiteUrl = e
  }

  refProductName = (e) => {
    this.productName = e
  }

  renderCreateNewSite() {
    const { intl: { formatMessage } } = this.props
    const { createLoading } = this.state

    return (
      <div className="flex new-site-wrapper">
        <div className="btn-region">
          <i className="fa fa-undo" onClick={this.hideCreateNewSite} />
        </div>
        <div className="flex-1">
          <TextInput
            focusAfterRender
            ref={this.refNewSiteName}
            placeholder={formatMessage({ id: 'campaign.name', defaultMessage: '!Name' })}
          />
          <TextInput
            ref={this.refNewSiteUrl}
            placeholder={formatMessage({ id: 'campaign.url', defaultMessage: '!URL' })}
          />
          <Button
            wrapperStyle={{ justifyContent: 'flex-end', marginTop: '8px' }}
            bsSize="middle"
            title={formatMessage({ id: 'main.submit', defaultMessage: '!Submit' })}
            onClick={this.onSubmitNewSite}
            style={{ padding: '0 25px', height: '38px' }}
            loading={createLoading}
          />
        </div>
      </div>
    )
  }

  render() {
    const {
      intl: { formatMessage },
      editing,
      products,
      sites,
      fields: {
        product_id,
        hosted_site_id
      }
    } = this.props

    const { hostedUrl, hostedIsOpen } = this.state

    const productItems = products.map(({ id, name }) => ({ value: id, label: name }))

    const site =
      hosted_site_id.input.value ? sites.find((s) => (s.id === hosted_site_id.input.value)) : null

    return (
      <Panel
        title={formatMessage({ id: 'campaign.step_product', defaultMessage: '!Product' })}
        className="campaignPanel"
      >
        <div id="campaign-form-error-product_id" className="flex mt-20">
          <Select
            disabled={editing || !productItems.length}
            loading={this.state.loadingProducts}
            style={{ width: 300 }}
            title={formatMessage({ id: 'campaign.choose_product', defaultMessage: '!Choose Product' })}
            items={productItems}
            value={product_id.input.value}
            onSelect={this.selectProduct}
          />&nbsp;
          <Button
            bsType="select"
            bsSize="middle"
            icon="plus"
            title={formatMessage({ id: 'campaign.new_product', defaultMessage: '!New Product' })}
            onClick={this.onNewProductClicked}
            disabled={editing || !this.state.enableNewProduct}
            tooltip={formatMessage({ id: 'campaign.new_product', defaultMessage: '!New Product' })}
            className="select-container"
          />
        </div>
        {product_id.meta.touched && product_id.meta.error && (
          <div className="msg small error">{product_id.meta.error}</div>
        )}
        <div className="flex mt-20 border-bottom">
          <TextInput
            ref={this.refProductName}
            inline
            label={formatMessage({ id: 'campaign.product_name', defaultMessage: '!Product Name' })}
            tooltip={formatMessage({ id: 'campaign.product_name', defaultMessage: '!Product Name' })}
            action={(
              <IconButton
                icon="edit"
                style={{ border: '1px solid #95989A', color: '#95989A' }}
                onClick={this.enableProductName}
              />
            )}
            error={this.state.error.productName}
            disabled={!this.state.enableProductName}
            value={this.state.productName}
            onSubmit={this.onSubmitProductName}
          />
        </div>
        <div className="flex mt-10">
          <LeftRightSwitch
            leftTitle={formatMessage({ id: 'campaign.choose_hosted', defaultMessage: '!Choose my Product Website' })}
            rightTitle={formatMessage({ id: 'campaign.new_hosted', defaultMessage: '!Create 2key Page URL' })}
            tooltip={formatMessage({ id: 'campaign.hosted_tooltip', defaultMessage: '!Here should be info content' })}
          />
        </div>
        <div id="campaign-form-error-hosted_site_id" className="mt-10">
          {!this.state.createNewSite && (
            <ThumbnailView
              loading={this.state.loadingSites}
              newItemEnabled
              data={sites}
              selections={site}
              onNewItem={this.showCreateNewSite}
              itemRenderer={HostedSite}
              itemProps={{ onView: this.onViewSiteClick }}
              onChange={this.selectHostedSite}
            />
          )}
          {this.state.createNewSite && this.renderCreateNewSite()}
          {hosted_site_id.meta.touched && hosted_site_id.meta.error &&
            <div className="msg small error">{hosted_site_id.meta.error}</div>}
        </div>
        <div className="mt-20 align-right">
          <Button
            bsSize="middle"
            style={{ padding: '0 25px', height: '38px' }}
            wrapperStyle={{ alignItems: 'center', justifyContent: 'flex-end', padding: '4px 0' }}
            title={formatMessage({ id: 'campaign.next', defaultMessage: '!Next' })}
            disabled={!product_id.input.value || !hosted_site_id.input.value}
            onClick={this.onNext}
          />
        </div>
        <Duplicate
          isDuplicateOpen={this.state.isDuplicateOpen}
          hosted={this.state.hosted}
          onClose={this.onDuplicateClose}
          updateHosted={this.props.UPDATE_HOSTED_SITE}
        />
        <HostedSiteView
          isOpen={hostedIsOpen}
          url={hostedUrl}
          onRequestClose={this.onHostedClose}
        />
      </Panel>
    )
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('campaign-form')
  const product_id = selector(state, 'fields.product_id')
  const sites = product_id
    ? state.product.get('sites').toList().toJS().filter((s) => (s.product_id === product_id))
    : []
  return {
    business_id: state.business.get('currentBusinessId'),
    products: state.product.get('products').toList().toJS(),
    product_id,
    duplicationErrors: state.enums
      .getIn(['enums', 'DuplicationFunnelErrors', 'DuplicationFunnelErrors', 'value_to_name']).toJS(),
    sites
  }
}


export default injectIntl(connect(mapStateToProps, {
  CREATE_PRODUCT: ProductActions.CREATE_PRODUCT,
  UPDATE_PRODUCT: ProductActions.UPDATE_PRODUCT,
  SELECT_PRODUCT: ProductActions.SELECT_PRODUCT,
  FETCH_HOSTED_SITE_LIST: ProductActions.FETCH_HOSTED_SITE_LIST,
  CREATE_HOSTED_SITE: ProductActions.CREATE_HOSTED_SITE,
  FETCH_MEDIA_LIST: MediaActions.FETCH_MEDIA_LIST,
  UPDATE_HOSTED_SITE: ProductActions.updateExistingHostedSite
})(ProductPanel))

