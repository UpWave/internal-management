import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import AdminUsers from '../admin_users/body';
import AdminSkills from '../admin_skills/body';
import AdminTimelogs from '../admin_timelogs/body';
import UserVacations from '../user_vacations/body';
import UserTimelogs from '../user_timelogs/body';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      admin: false,
      logged: false,
      hasGoogle: false,
      hasTrello: false,
    };
    this.signOutClick = this.signOutClick.bind(this);
  }
  componentWillMount() {
    $.ajax({
      url: '/auth/is_signed_in',
      type: 'GET',
      success: (data) => {
        this.setState({ logged: data.signed_in });
        if (data.signed_in) {
          this.setState({ admin: data.user.role === 'admin' });
          this.checkIdentities();
        } else {
          this.setState({ admin: false });
        }
      },
    });
  }

  checkIdentities() {
    $.ajax({
      url: '/auth/check_identities',
      type: 'GET',
      success: (data) => {
        this.setState({ hasGoogle: data.has_google });
        this.setState({ hasTrello: data.has_trello });
      },
    });
  }

  signOutClick() {
    $.ajax({
      url: '/users/sign_out',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      type: 'DELETE',
      success: () => {
        this.setState({ logged: false });
        this.setState({ hasGoogle: false });
        this.setState({ hasTrello: false });
      },
    });
  }

  render() {
    const signOutLink =
      <li><a role="button" tabIndex={0} id="signout" onClick={this.signOutClick}>Sign out</a></li>;

    const googleLink = this.state.hasGoogle ?
      null
      :
      (<li>
        <a href="/users/auth/google_oauth2">
          {this.state.logged ? 'Connect to Google' : 'Sign in with Google'}
        </a>
      </li>);

    const trelloLink = this.state.hasTrello ?
      null
      :
      (<li>
        <a href="/users/auth/trello">
          {this.state.logged ? 'Connect to Trello' : 'Sign in with Trello'}
        </a>
      </li>);

    const AdminRoutes = () => (
      <Router>
        <div>
          <div className="navbar">
            <ul className="nav navbar-nav">
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/admin/skills">Skills</Link></li>
              <li><a href="/admin/vacations">Users vacations </a></li>
              <li><a href="/user/profile">Profile</a></li>
              <li><Link to="/user/vacations">My Vacations</Link></li>
              <li><Link to="/user/timelogs">Timelogs</Link></li>
              {googleLink}
              {trelloLink}
              {signOutLink}
            </ul>
          </div>
          <Route path="/admin/users/:user_id/timelogs" component={AdminTimelogs} />
          <Route exact path="/admin/users" component={AdminUsers} />
          <Route exact path="/admin/skills" component={AdminSkills} />
          <Route exact path="/user/vacations" component={UserVacations} />
          <Route exact path="/user/timelogs" component={UserTimelogs} />
        </div>
      </Router>
    );

    const MemberRoutes = () => (
      <Router>
        <div>
          <div className="navbar">
            <ul className="nav navbar-nav">
              <li><a href="/user/profile">Profile</a></li>
              <li><Link to="/user/vacations">My Vacations</Link></li>
              <li><Link to="/user/timelogs">Timelogs</Link></li>
              {googleLink}
              {trelloLink}
              {signOutLink}
            </ul>
          </div>
          <Route exact path="/user/vacations" component={UserVacations} />
          <Route exact path="/user/timelogs" component={UserTimelogs} />
        </div>
      </Router>
    );

    const GuestRoutes = () => (
      <Router>
        <div>
          <div className="navbar">
            <ul className="nav navbar-nav">
              <li><a id="signin" href="/users/sign_in">Sign in</a></li>
              {googleLink}
              {trelloLink}
            </ul>
          </div>
        </div>
      </Router>
    );

    if (this.state.logged) {
      if (this.state.admin) {
        return (
          <div>
            <AdminRoutes />
          </div>
        );
      }
      return (
        <div>
          <MemberRoutes />
        </div>
      );
    }
    return (
      <div>
        <GuestRoutes />
      </div>
    );
  }
}

export default Header;
