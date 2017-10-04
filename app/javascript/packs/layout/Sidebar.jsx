import React from 'react';
import {
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      toggle: true,
    };
    this.sideBarCollapse = this.sideBarCollapse.bind(this);
  }

  sideBarCollapse() {
    if (this.state.toggle) {
      $('.page-container').addClass('sidebar-collapsed').removeClass('sidebar-collapsed-back');
      $('#menu span').css({ position: 'absolute' });
    } else {
      $('.page-container').removeClass('sidebar-collapsed').addClass('sidebar-collapsed-back');
      setTimeout(() => {
        $('#menu span').css({ position: 'relative' });
      }, 400);
    }
    this.setState({ toggle: !this.state.toggle });
  }

  render() {
    const signOutLink =
      (<li>
        <a
          role="button"
          tabIndex={0}
          id="signout"
          onClick={this.props.signOutClick}
        >
          <i className="fa fa-sign-out" /><span>Sign out</span><div className="clearfix" />
        </a>
      </li>);

    const googleLink = this.props.hasGoogle ?
      null
      :
      (<li>
        <a href="/users/auth/google_oauth2">
          <i className="fa fa-google" /><span>Connect to Google</span><div className="clearfix" />
        </a>
      </li>);

    const trelloLink = this.props.hasTrello ?
      null
      :
      (<li>
        <a href="/users/auth/trello">
          <i className="fa fa-trello" /><span>Connect to Trello</span><div className="clearfix" />
        </a>
      </li>);

    const AdminLinks = () => (
      <div>
        <li>
          <Link to="/admin/users">
            <i className="fa fa-user" /><span>Users</span><div className="clearfix" />
          </Link>
        </li>
        <li>
          <Link to="/admin/skills">
            <i className="fa fa-diamond" /><span>Skills</span><div className="clearfix" />
          </Link>
        </li>
        <li>
          <Link to="/admin/vacations">
            <i className="fa fa-plane" /><span>Users vacations</span><div className="clearfix" />
          </Link>
        </li>
      </div>
    );

    const MemberLinks = () => (
      <div>
        <li>
          <Link to="/user/profile">
            <i className="fa fa-address-card" /><span>Profile</span><div className="clearfix" />
          </Link>
        </li>
        <li>
          <Link to="/user/vacations">
            <i className="fa fa-bed" /><span>My Vacations</span><div className="clearfix" />
          </Link>
        </li>
        <li>
          <Link to="/user/timelogs">
            <i className="fa fa-calendar-check-o" /><span>Timelogs</span><div className="clearfix" />
          </Link>
        </li>
        {googleLink}
        {trelloLink}
        {signOutLink}
      </div>
    );

    if (this.props.logged) {
      if (this.props.admin) {
        return (
          <div className="page-container">
            <div className="sidebar-menu">
              <header className="logo1">
                <button className="fa fa-bars" onClick={this.sideBarCollapse} />
              </header>
              <div style={{ borderTop: '1px ridge rgba(255, 255, 255, 0.15)' }} />
              <div className="menu">
                <ul id="menu" >
                  <AdminLinks />
                  <MemberLinks />
                </ul>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        );
      }
      return (
        <div className="page-container">
          <div className="sidebar-menu">
            <header className="logo1">
              <button className="fa fa-bars" onClick={this.sideBarCollapse} />
            </header>
            <div style={{ borderTop: '1px ridge rgba(255, 255, 255, 0.15)' }} />
            <div className="menu">
              <ul id="menu" >
                <MemberLinks />
              </ul>
            </div>
          </div>
          <div className="clearfix" />
        </div>
      );
    }
    return (
      <div />
    );
  }
}

Sidebar.propTypes = {
  signOutClick: PropTypes.func.isRequired,
  hasGoogle: PropTypes.bool.isRequired,
  hasTrello: PropTypes.bool.isRequired,
  logged: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default Sidebar;
