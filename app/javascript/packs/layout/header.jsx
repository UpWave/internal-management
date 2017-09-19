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
  render() {
    const HeadRoutes = () => (
      <Router>
        <div>
          <div className="navbar">
            <ul className="nav navbar-nav">
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/user/vacations">Vacations</Link></li>
              <li><Link to="/user/timelogs">Timelogs</Link></li>
              <li><Link to="/admin/skills">Skills</Link></li>
            </ul>
          </div>
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/user/vacations" component={UserVacations} />
          <Route path="/user/timelogs" component={UserTimelogs} />
          <Route path="/admin/skills" component={AdminSkills} />
        </div>
      </Router>
    );
    return (
      <div>
        <HeadRoutes />
      </div>
    );
  }
}

export default Header;
