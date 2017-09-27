import React from 'react';
import {
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';


class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.makeVisible = this.makeVisible.bind(this);
  }

  makeVisible() {
    $('#sign-in-container').css('visibility', 'visible')
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
          Sign out
        </a>
      </li>);

    const googleLink = this.props.hasGoogle ?
      null
      :
      (<li>
        <a href="/users/auth/google_oauth2">
          {this.props.logged ? 'Connect to Google' : 'Sign in with Google'}
        </a>
      </li>);

    const trelloLink = this.props.hasTrello ?
      null
      :
      (<li>
        <a href="/users/auth/trello">
          {this.props.logged ? 'Connect to Trello' : 'Sign in with Trello'}
        </a>
      </li>);

    const AdminLinks = () => (
      <ul className="nav navbar-nav">
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/skills">Skills</Link></li>
        <li><Link to="/admin/vacations">Users vacations </Link></li>
      </ul>
    );

    const MemberLinks = () => (
      <ul className="nav navbar-nav">
        <li><Link to="/user/profile">Profile</Link></li>
        <li><Link to="/user/vacations">My Vacations</Link></li>
        <li><Link to="/user/timelogs">Timelogs</Link></li>
        {googleLink}
        {trelloLink}
        {signOutLink}
      </ul>
    );

    const GuestLinks = () => (
      <ul className="nav navbar-nav">
        <li><Link onClick={this.makeVisible} to="/users/sign_in">Sign in</Link></li>
        {googleLink}
        {trelloLink}
      </ul>
    );

    if (this.props.logged) {
      if (this.props.admin) {
        return (
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <AdminLinks />
                <MemberLinks />
              </div>
            </div>
          </nav>
        );
      }
      return (
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <MemberLinks />
            </div>
          </div>
        </nav>
      );
    }
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <GuestLinks />
          </div>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  signOutClick: PropTypes.func.isRequired,
  hasGoogle: PropTypes.bool.isRequired,
  hasTrello: PropTypes.bool.isRequired,
  logged: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default Header;
