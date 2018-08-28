import React from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../_common/Loading'
import Menu from './Menu'
import '../../styles/page.css'
import './style.css'

const InfluencerPage = ({ isMobile, children }) => (
  <div>
    {!isMobile && <Menu />}
    <div className="page-body">
      {children}
    </div>
  </div>
)

InfluencerPage.propTypes = {
  isMobile: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
}

const MyActivity = Loadable({
  loading: Loading,
  loader: () => import('./MyActivity')
})
const Favorites = Loadable({
  loading: Loading,
  loader: () => import('./Favorites')
})
const Explore = Loadable({
  loading: Loading,
  loader: () => import('./explore')
})
const Balance = Loadable({
  loading: Loading,
  loader: () => import('./Balance')
})

export default withRouter(connect((state) => ({
  isMobile: state.general.get('isMobile')
}))(InfluencerPage))

export const InfluencerMyActivity = () => <MyActivity />
export const InfluencerFavorites = () => <Favorites />
export const InfluencerExplore = () => <Explore />
export const InfluencerBalance = () => <Balance />
