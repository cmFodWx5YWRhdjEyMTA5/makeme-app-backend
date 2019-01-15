import React, {Component,PropTypes} from 'react'
import {Link} from 'react-router'
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-transparent navbar-absolute fireadminbar">
                <div className="container-fluid">
                    <div className="navbar-minimize">
                        <button id="minimizeSidebar" className="btn btn-round btn-white btn-fill btn-just-icon">
                            <i className="material-icons visible-on-sidebar-regular">more_vert</i>
                            <i className="material-icons visible-on-sidebar-mini">view_list</i>
                        <div className="ripple-container"></div></button>
                    </div>
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        {this.props.children}
                    </div>

                </div>
            </nav>
    )
  }
}
export default NavBar;
