import React, { Component } from 'react'

export class InputFormComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         focused: false
      }
    }

    handleFocus = (e) => {
        this.setState({
            focused: true
        })
    }

  render() {

    const {errorMessage,setValue, ...inputProps} = this.props


    return (
      <div className='inputform-validation-container'>
        <input className = 'validation-inputs'  onChange={(e) => this.props.setValue(e)}
        {...inputProps}
        onBlur={this.handleFocus}
        focused={this.state.focused.toString()}
        />
        <span className='form-error-span'>{this.props.errorMessage}</span>
      </div>
    )
  }
}

export default InputFormComponent
