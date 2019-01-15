import React, {Component,PropTypes} from 'react'
import Config from   '../../config/app';

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
      currentScreen: props.currentScreen,
    };
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  render() {
    let configPreviewOnlyKeys = Config.adminConfig.previewOnlyKeys;
    if (this.state.currentScreen === 'venues') {
      configPreviewOnlyKeys = configPreviewOnlyKeys.filter(i => i !== 'name')
    }
    if(configPreviewOnlyKeys && configPreviewOnlyKeys.indexOf(this.props.theKey) > -1) {
      return (
        <div className="form-group label-floating is-empty">
            <label className="control-label"></label>
            <input type="text"  className={this.props.class+" form-control"} onChange={this.handleChange}  value={this.state.value} readOnly />
        </div>
      )
    } else {
      return (
        <div className="form-group label-floating is-empty">
            <label className="control-label"></label>
            <input type="text"  className={this.props.class+" form-control"} onChange={this.handleChange}  value={this.state.value} />
        </div>
      )
    }
    
  }
}
export default Input;

Input.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
