import React from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie'
import Utils from '../../src/utils'
import { Layout } from '../../src/components/Layout'
import Loading from '../../src/components/Core/Loading'
import { Inputs } from '../../src/components'

export class AppContainer extends React.Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('dashboard')

    this.state = {
      loading: true,
      layout: {}
    }
  }

  componentDidMount() {
    let user = {
      uid: "default",
      email: "mowens@redhat.com",
      permissions: {},
      sessions: {},
      metadata: {}
    }

    let info = {}

    this.utils.dispatch('LOADED', {user: user, systemInfo: info}).then(() => {
      this.fetchLayout(this.props)
    })
  }
  
  fetchLayout(props) {
    let keys = [
      'stateTitle',
      'content',
      'appNav',
      'search',
    ]

    let promises = []

    for (let i in props.layout.api) {
      let api = props.layout.api[i]

      if (api) {
        promises.push(api())
      }
    }

    let map = {}
    let count = promises.length

    for (let i in keys) {
      let k = keys[i]
      let component = props.layout.ui[k]

      if (component) {
        if (component instanceof Promise) {
          promises.push(component())
        } else {
          promises.push(component)
        }

        map[count] = k
        count++
      }
    }

    Promise.all(promises).then((data) => {
      let ui = {}
      for (let i in map) {
        let module = data[parseInt(i)]

        ui[map[i]] = module

        if (module.default) {
          ui[map[i]] = module.default
        }
      }

      let layout = {...props.layout}
      layout.ui = ui

      this.setState({loadingComponents: false, layout: layout, location: props.location, loading: false})
    })
  }

  render() {
    if (this.state.loading) {
      return <Loading className="page-loader__main" toggle={true} />
    }

    let newProps = {...this.state.layout}
    if (!newProps.location) {
      newProps.location = this.props.location
    }

    return <Layout {...newProps} />
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.dashboard.user,
    systemInfo: state.dashboard.systemInfo,
  }
}

export default connect(mapStateToProps)(AppContainer)