import React from 'react';
import { Route } from 'react-router';
import AdminUsers from '../admin_users/body';
import AdminSkills from '../admin_skills/body';
import AdminTimelogs from '../admin_timelogs/body';
import UserVacations from '../user_vacations/body';
import UserTimelogs from '../user_timelogs/body';

export default (
  <div>
    <Route exact path="/user/vacations" component={UserVacations} />
    <Route exact path="/user/timelogs" component={UserTimelogs} />
    <Route path="/admin/users/:user_id/timelogs" component={AdminTimelogs} />
    <Route exact path="/admin/users" component={AdminUsers} />
    <Route exact path="/admin/skills" component={AdminSkills} />
  </div>
);
