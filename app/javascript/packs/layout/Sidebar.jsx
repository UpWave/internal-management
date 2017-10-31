import React from 'react';
import {
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';

class Sidebar extends React.Component {
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
        <li>
          <Link to="/user/evaluations">
            <i className="fa fa-check-square-o" /><span>Evaluations</span><div className="clearfix" />
          </Link>
        </li>
        {googleLink}
        {trelloLink}
        {signOutLink}
        <li>
          <Link to="/admin/vacations">
            <i className="fa fa-plane" /><span>Users vacations</span><div className="clearfix" />
          </Link>
        </li>
      </div>
    );

    if (this.props.logged) {
      if (this.props.admin) {
        return (
          <div>
            <div className="sidebar-menu">
              <header className="logo1">
                <button onClick={this.props.sideBarCollapse} className="sidebar-icon"><span className="fa fa-bars" /></button>
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
        <div>
          <div className="sidebar-menu">
            <header className="logo1">
              <button onClick={this.props.sideBarCollapse} className="sidebar-icon"><span className="fa fa-bars" /></button>
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
  sideBarCollapse: PropTypes.func.isRequired,
  hasGoogle: PropTypes.bool.isRequired,
  hasTrello: PropTypes.bool.isRequired,
  logged: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default Sidebar;
