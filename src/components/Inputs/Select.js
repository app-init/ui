import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '../../utils'
import PropTypes from 'prop-types'

/**
  Props:
    - options: array of { label, value } objects TODO: label should default to value
    - children: array of option inputs used if options not specified
    - value: currently selected value
    - id: form id
    - onChange
*/
class Select extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value || '',
    }

    this.utils = new Utils()
  }

  renderOptions() {
    if (this.props.placeholder) {
      if (this.props.options === undefined) {
        return [
          <option key="select-default-option" value="">{ this.props.placeholder }</option>,
          this.props.children,
        ]

      } else {
        this.props.options.splice(0, 0, {label: this.props.placeholder, value: ''})
      }
    }

    if (this.props.options === undefined) {
      return this.props.children
    }

    return this.props.options.map(option => {
      return (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      )
    })
  }

  handleChange(e) {
    let action = {
      name: this.state.name,
      id: this.props.id,
      value: e.target.value
    }

    this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(e.target.value)
      }
    })
  }

  componentDidMount() {
    let selfManaged = !this.props.form && !this.props.id
    
    let action = {
      name: this.props.form,
      id: this.props.id
    }

    let update = {
      error: this.props.error, 
      name: action.name,
      selfManaged: selfManaged
    }

    // If the component does not specify name and id self managed
    if (selfManaged) {
      // And use its form counter as the form name
      update.name = this.utils.getFormCounter()

      this.utils.dispatch('FORM_INIT', action).then(() => {
        action.name = update.name

        if (this.props.options) {
          // Additional dispatch to set state to the first select item
          action.value = this.props.options[0].value
        } else {
          action.value = this.props.children[0].props.value
        }

        this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
          this.setState(update)
        })
      })
    }
    else {
      this.setState(update)
    }
  }

  render() {
    let value = this.props.value
    let errorComponent = null
    
    if (this.state.selfManaged && this.props.formData) {
      value = this.props.formData[this.state.name].value || this.props.value
    }

    let className = 'form-control'

    if (this.props.size && (this.props.size == 'sm' || this.props.size == 'lg')) {
      className += ' form-control-' + this.props.size
    }

    if (this.props.error) {
      className += ' is-invalid'
    }

    if (this.props.error) {
      errorComponent = <i className="form-group__feedback zmdi zmdi-close-circle"></i>
    }

    return (
      <div className="form-group">
        <div className="select">
          <select
            className={className}
            value={value}
            onChange={(e) => this.handleChange(e)}
            id={this.props.id}
          >
            {this.renderOptions()}
          </select>
          {errorComponent}
        </div>
      </div>
    )
  }
}

Select.propTypes = {
  options: PropTypes.array,         // Array of options for teh select component
  value: PropTypes.string,          // Value to set as currently selected
  onChange: PropTypes.func,         // Function to be executed when change occurs within select
  size: PropTypes.string,           // Size of select component (sm = small, lg = large, undefined = medium)
  placeholder: PropTypes.string     // Placeholder text to display on the select component
}

const mapStateToProps = (state, ownProps) => {
  return Utils.inputMapStateToProps(state, ownProps)
}

export default connect(mapStateToProps)(Select)