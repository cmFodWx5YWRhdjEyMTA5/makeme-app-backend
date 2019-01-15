import React, { Component } from 'react'
import { Link, IndexLink, withRouter } from 'react-router'

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
class NavItem extends Component {

  render () {

    function resolveToLocation(to, router) {

      return typeof to === 'function' ? to(router.location) : to
    }


    const { router } = this.props
    const { menuPath,index, to, children, ...props } = this.props

    let isActive




    const toLocation = resolveToLocation(to, router)

    var mostObviousCase=router.isActive(toLocation,index);
    var isExternalLink=to.indexOf("http")>-1;

    if(index){
      //Check if path contains /app
      if(router.location.pathname.indexOf('/app')>-1){
        mostObviousCase=true;
      }
    }

    const LinkComponent = index ?  IndexLink : Link

    return (
      <li className={mostObviousCase ? 'active' : ''}>
         <ConditionalDisplay condition={!isExternalLink}>
          <LinkComponent  {...this.props}>{children}</LinkComponent>
         </ConditionalDisplay>
         <ConditionalDisplay condition={isExternalLink}>
          <a href={menuPath} target={"_blank"} >{children}</a>
         </ConditionalDisplay>
      </li>
    )
  }
}

NavItem = withRouter(NavItem)

export default NavItem
