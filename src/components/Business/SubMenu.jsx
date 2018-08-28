import PropTypes from 'prop-types'
import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import pendingActions from '../../_redux/pending/actions'
import { PendingButton } from '../PendingModal/index'
import './sub-menu.css'

const $ = window.jQuery

class SubMenu extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    businessDetails: PropTypes.object,
    pendings: PropTypes.object,
    onClickPendingButton: PropTypes.func
  }

  onClickPendingButton = () => {
    if (this.props.onClickPendingButton) {
      this.props.onClickPendingButton()
    }
  }

  render() {
    const { businessDetails, pendings, isMobile } = this.props
    if ($.isEmptyObject(businessDetails)) {
      return <div />
    }

    return (
      <div className={`header sub-menu-container${isMobile ? '' : ' fixed left-0 right-0'}`}>
        <div className="container">
          <div className="row justify-between">
            <div className="col-sm-9">
              <ul className="tabs">
                <li>
                  <NavLink
                    exact
                    to={`/business/${businessDetails.handle}`}
                    activeClassName="selected"
                    className="sub-menu-item business-sub"
                  >
                    <FormattedMessage id="business.sub_page" defaultMessage="!Page" />
                  </NavLink>
                  <span />
                </li>
                <li>
                  <NavLink
                    to={`/business/${businessDetails.handle}/dashboard`}
                    activeClassName="selected"
                    className="sub-menu-item business-sub"
                  >
                    <FormattedMessage id="business.sub_dashboard" defaultMessage="!Dashboard" />
                  </NavLink>
                  <span />
                </li>
                <li>
                  <NavLink
                    to={`/business/${businessDetails.handle}/audience`}
                    activeClassName="selected"
                    className="sub-menu-item business-sub"
                  >
                    <FormattedMessage id="business.sub_audience" defaultMessage="!Audience" />
                  </NavLink>
                  <span />
                </li>
                <li>
                  <NavLink
                    to={`/business/${businessDetails.handle}/settings`}
                    activeClassName="active"
                    className="sub-menu-item business-sub"
                  >
                    <FormattedMessage id="business.sub_settings" defaultMessage="!Settings" />
                  </NavLink>
                  <span />
                </li>
                <li>
                  <NavLink
                    to={`/business/${businessDetails.handle}/finances`}
                    activeClassName="active"
                    className="sub-menu-item business-sub"
                  >
                    <FormattedMessage id="business.sub_finance" defaultMessage="!Finance" />
                  </NavLink>
                  <span />
                </li>
              </ul>
            </div>
            <div className="col-sm-3 flex vCenter">
              {pendings && pendings.total_pending ? (
                <PendingButton
                  style={{ float: 'right' }}
                  onClick={this.onClickPendingButton}
                  id={businessDetails.id}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isMobile: state.general.get('isMobile'),
    businessDetails: state.business.get('businessDetails').toJS().business,
    pendings: state.pending.get('pendings').toJS()
  }
}

export default injectIntl(withRouter(connect(mapStateToProps, {
  FETCH_PENDINGS: pendingActions.FETCH_PENDINGS
})(SubMenu)))
