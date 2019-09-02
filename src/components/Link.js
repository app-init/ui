import React from 'react'
import PropTypes from 'prop-types'
import Utils from '../utils'
// import invariant from 'invariant'

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
  }

  handleClick(event) {
    console.log(this)
    if (this.props.onClick)
      this.props.onClick(event)

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore right clicks
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault()

      // const { history } = this.context.router
      const { replace, to } = this.props

      if (replace) {
        this.utils.getHistory().replace(to)
      } else {
        this.utils.getHistory().push(to)
      }
    }
  }

  render() {
    const { replace, to, innerRef, ...props } = this.props // eslint-disable-line no-unused-vars

    const href = this.utils.getHistory().createHref(
      typeof to === 'string' ? { pathname: to } : to
    )

    return <a {...props} onClick={(event) => this.handleClick(event)} href={href} ref={innerRef} />
  }
}

Link.propTypes = {
  onClick: PropTypes.func,
  target: PropTypes.string,
  replace: PropTypes.bool,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired
}

export default Link
