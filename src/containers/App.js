import React, {Component,PropTypes} from 'react'
import {Link,Redirect} from 'react-router'
import NavBar from '../components/NavBar'

class App extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('this.props', this.props);
    //Uncomment if you want to do a edirect
    this.props.router.push('/firestoreadmin/users') //Path where you want user to be redirected initialy
  }
  render() {
    return (
      <div className="content">
        <NavBar></NavBar>

        Make Me Dashboard
        <br />
        
      </div>
    )
  }
}
export default App;
