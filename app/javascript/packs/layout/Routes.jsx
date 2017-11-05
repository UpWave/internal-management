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
import AdminInvoices from '../admin_invoices/body';
import NewUser from '../admin_users/new_user';
import Notes from '../admin_comments/body';
import NewUserTimelog from '../user_timelogs/new_timelog';
import NewAdminTimelog from '../admin_timelogs/new_timelog';
import UserEvaluations from '../user_evaluations/evaluations';
import AdminEvaluations from '../admin_evaluations/body';
import EvaluationGoals from '../admin_evaluations/evaluation_goals';
import NewAdminEvaluation from '../admin_evaluations/new_evaluation';
import UserEvaluationGoals from '../user_evaluations/evaluation_goals';

class Routes extends React.Component {
  render() {
    const adminRoutes =
      (<div>
        <Route path="/admin/users/:user_id/timelogs" component={AdminTimelogs} />
        <Route path="/admin/users/:user_id/invoices" component={AdminInvoices} />
        <Route exact path="/admin/users" component={AdminUsers} />
        <Route exact path="/admin/skills" component={AdminSkills} />
        <Route exact path="/admin/vacations" component={AdminVacations} />
        <Route exact path="/admin/new_user" component={NewUser} />
        <Route exact path="/admin/users/:user_id/notes" component={Notes} />
        <Route exact path="/admin/:user_id/new_timelog" component={NewAdminTimelog} />
        <Route exact path="/admin/users/:user_id/evaluations" component={AdminEvaluations} />
        <Route exact path="/admin/users/:user_id/evaluation/:id" component={EvaluationGoals} />
        <Route exact path="/admin/users/:user_id/new_evaluation" component={NewAdminEvaluation} />
      </div>);
    const memberRoutes =
      (<div>
        <Route exact path="/user/profile" component={UserProfile} />
        <Route exact path="/user/vacations" component={UserVacations} />
        <Route exact path="/user/timelogs" component={UserTimelogs} />
        <Route exact path="/user/new_timelog" component={NewUserTimelog} />
        <Route exact path="/user/evaluations" component={UserEvaluations} />
        <Route exact path="/user/evaluations/:id/goals" component={UserEvaluationGoals} />
      </div>);
    const guestRoutes =
      <div />;
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
      <div className="container">
        {guestRoutes}
      </div>
    );
  }
}

Routes.propTypes = {
  logged: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default Routes;
