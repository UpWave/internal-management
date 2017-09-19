import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import AdminUsers from '../admin_users/body';
import UserVacations from '../user_vacations/body';
import AdminSkills from '../admin_skills/body';
import UserTimelogs from '../user_timelogs/body';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      admin: false,
      logged: false,
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
        } else {
          this.setState({ admin: false });
        }
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
      },
    });
  }

  render() {
    const signOutLink =
      <li><a role="button" tabIndex={0} id="signout" onClick={this.signOutClick}>Sign out</a></li>;
    const AdminRoutes = () => (
      <Router>
        <div>
          <div className="navbar">
            <ul className="nav navbar-nav">
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/user/vacations">My Vacations</Link></li>
              <li><Link to="/user/timelogs">Timelogs</Link></li>
              <li><Link to="/admin/skills">Skills</Link></li>
              {signOutLink}
            </ul>
          </div>
          <Route exact path="/admin/users" component={AdminUsers} />
          <Route exact path="/user/vacations" component={UserVacations} />
          <Route exact path="/user/timelogs" component={UserTimelogs} />
          <Route exact path="/admin/skills" component={AdminSkills} />
        </div>
      </Router>
    );

    const MemberRoutes = () => (
      <Router>
        <div>
          <div className="navbar">
            <ul className="nav navbar-nav">
              <li><Link to="/user/vacations">My Vacations</Link></li>
              <li><Link to="/user/timelogs">Timelogs</Link></li>
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
              <li>Hey Guest</li>
              <li><a id="signin" href="/users/sign_in">Sign in</a></li>
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
