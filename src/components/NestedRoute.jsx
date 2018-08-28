import React from 'react'
import PropTypes from 'prop-types'
import { Route, withRouter } from 'react-router-dom'

const componentProps = [
  PropTypes.string, PropTypes.bool, PropTypes.element, PropTypes.array, PropTypes.func
]

const Component = (props) => (
  <props.component {...props}>
    {props.children}
  </props.component>
)

Component.propTypes = {
  children: PropTypes
    .oneOfType(componentProps)
}

const RouteComponent = withRouter(Component)

class NestedRoute extends React.Component {
  static propTypes = {
    private: PropTypes.bool,
    exact: PropTypes.bool,
    path: PropTypes.string,
    history: PropTypes.object.isRequired,
    component: PropTypes.oneOfType(componentProps),
    children: PropTypes.oneOfType(componentProps)
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  componentWillMount() {
    if (this.props.private) {
      if (!this.context.auth.isAuthenticated()) {
        this.props.history.goBack()
      }
    }
  }

  render() {
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        render={(props) => (
          <RouteComponent {...props} component={this.props.component}>
            {this.props.children}
          </RouteComponent>
        )}
      />
    )
  }
}

export default withRouter(NestedRoute)
