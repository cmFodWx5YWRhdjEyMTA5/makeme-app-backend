import React, {Component,PropTypes} from 'react'
import {Link} from 'react-router'
import NavItem from '../components/NavItem'
import { IndexLink } from 'react-router'
import Config from   '../config/app';
var pjson = require('../../package.json');
var md5 = require('md5');


import firebase from './../config/database'

class Master extends Component {

  constructor(props) {
    super(props);
    this.state = {user:{}};
    this.handleLogout = this.handleLogout.bind(this);
    this.authListener = this.authListener.bind(this);
    this.printMenuItem= this.printMenuItem.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

   authListener(){
     const setUser=(user)=>{
       this.setState({user:user})
     }
    firebase.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
        // User is signed in.
        console.log("User has Logged  in Master");
        console.log(user.email);
        window.setSideBG(Config.adminConfig.design.sidebarBg);
      } else {
        // No user is signed in.
        console.log("User has logged out Master");
      }
    });
  }





  handleLogout(e) {
    e.preventDefault();

    console.log('The link was clicked.');
    firebase.app.auth().signOut();
  }

   ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      return false;
    } else {
      return true;
    }
  }

  printMenuItem(menu){
    var menuPath=this.ValidURL(menu.path)?menu.path:menu.path.replace(/\//g, Config.adminConfig.urlSeparator);
    if(menu.subMenus&&menu.subMenus.length>0){
      return (
        <li>
                        <a data-toggle="collapse" href={"#"+menuPath} className="collapsed" aria-expanded="false">
                            <i className="material-icons">{menu.icon}</i>
                            <p>{menu.name}
                                <b className="caret"></b>
                            </p>
                        </a>
                        <div className="collapse" id={menuPath} aria-expanded="false">

                            <ul className="nav">
                            {menu.subMenus.map(this.printMenuItem)}
                            </ul>
                        </div>
                    </li>
        )
    }else{
      return (<NavItem index={menu.isIndex} onlyActiveOnIndex={menu.isIndex} menuPath={menuPath}   to={menu.link+"/"+menuPath}>
          <i className="material-icons">{menu.icon}</i>
          <p>{menu.name}</p>
        </NavItem>)
    }

  }


  render() {

    var bgStyle = {
      backgroundImage: 'require(../../assets/img/'+Config.adminConfig.design.sidebarBg+')',
    };


    return (
      <div className="wrapper">

        <div  id="theSideBar" className="sidebar" has-image="true" data-active-color={Config.adminConfig.design.dataActiveColor} data-background-color={Config.adminConfig.design.dataBackgroundColor}>
          <div className="sidebar-wrapper">
            <div className="user">
              <div className="photo">
                  <img  style={{ backgroundColor: 'white'}} src={'require(../../assets/img/logo.png'} />
              </div>
              <div className="info">
                <a data-toggle="collapse" href="#collapseExample" className="collapsed">{this.state.user.email}<b className="caret"></b></a>
                <div className="collapse" id="collapseExample">
                    <ul className="nav">
                        <li>
                            <a onClick={this.handleLogout} >Logout</a>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
            <ul className="nav">
              {Config.navigation.map(this.printMenuItem)}
            </ul>
          </div>


          <div className="sidebar-background"   style={bgStyle}></div>


        </div>


        <div className="main-panel">
            {this.props.children}
            <footer className="footer">
                <div className="container-fluid">
                    <nav className="pull-left">
                        <ul>

                        </ul>
                    </nav>
                    <p className="copyright pull-right">
                        &copy;
                        <script>
                            document.write(new Date().getFullYear())
                        </script>
                        <a href="#">{Config.adminConfig.appName}</a>, {Config.adminConfig.slogan}.  v{pjson.version}
                    </p>
                </div>
            </footer>
        </div>

      </div>











      /*<div><h1><FormattedMessage id={'Login.password'} defaultMessage={'Password'} /></h1>
        <ul role="nav">
        <li><NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/repos">Repos</NavLink></li>
        </ul>


      </div>*/)
  }
}


export default Master;
