import React, {Component,PropTypes} from 'react'
class Indicator extends Component {
  constructor(props){
    super(props)
  }


  render() {
    if(this.props.show){
      return (<img style={{width:30,height:30}} src={'../../assets/img/'+'spin.gif'} />)
    }else{
      return (<div></div>)
    }
  }
}
export default Indicator;
