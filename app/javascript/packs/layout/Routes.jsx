import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import AdminUsers from '../admin_users/body';
import AdminSkills from '../admin_skills/body';
import AdminTimelogs from '../admin_timelogs/body';
import UserVacations from '../user_vacations/body';
import UserTimelogs from '../user_timelogs/body';
import AdminVacations from '../admin_vacations/body';
import UserProfile from '../user_profile/body';

class Routes extends React.Component {
  render() {
    const adminRoutes =
    (<div>
      <Route path="/admin/users/:user_id/timelogs" component={AdminTimelogs} />
      <Route exact path="/admin/users" component={AdminUsers} />
      <Route exact path="/admin/skills" component={AdminSkills} />
      <Route exact path="/admin/vacations" component={AdminVacations} />
    </div>);
    const memberRoutes =
    (<div>
      <Route exact path="/user/profile" component={UserProfile} />
      <Route exact path="/user/vacations" component={UserVacations} />
      <Route exact path="/user/timelogs" component={UserTimelogs} />
    </div>);
    if (this.props.logged) {
      if (this.props.admin) {
        return (
          <div>
            {adminRoutes}
            {memberRoutes}
          </div>
        );
      }
      return (
        <div>
          {memberRoutes}
        </div>
      );
    }
    return (
      null
    );
  }
}

Routes.propTypes = {
  logged: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default Routes;
