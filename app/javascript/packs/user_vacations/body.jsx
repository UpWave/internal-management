import React from 'react';
import Fetch from '../Fetch';
import Vacations from './vacations';
import NewVacation from './new_vacation';

class UserVacations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      vacations: [],
      types: [],
      startDate: 0,
      endDate: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.loadVacations = this.loadVacations.bind(this);
  }

  componentDidMount() {
    Fetch.json('/api/v1/vacation_types/types')
      .then((data) => {
        this.setState({ types: data });
      });
    this.loadVacations();
  }

  loadVacations() {
    Fetch.json('/api/v1/vacations')
      .then((data) => {
        this.setState({ vacations: data });
      });
  }

  handleSubmit() {
    this.loadVacations();
  }

  handleDelete(id) {
    Fetch.deleteJSON(`/api/v1/vacations/${id}`)
      .then(() => {
        this.loadVacations();
      });
  }


  render() {
    if (this.state.vacations.length === 0) {
      return (
        <div>
          <h3>You have no pending Vacations</h3>
          <NewVacation
            key="new_vacation"
            handleSubmit={this.handleSubmit}
            types={this.state.types}
          />
        </div>
      );
    }
    return (
      <div className="agile-grids">
        <div className="agile-tables">
          <div className="w3l-table-info">
            <Vacations
              key={this.state.vacations.length.toString()}
              vacations={this.state.vacations}
              handleDelete={this.handleDelete}
            />
          </div>
          <NewVacation
            key="new_vacation"
            handleSubmit={this.handleSubmit}
            types={this.state.types}
          />
        </div>
      </div>
    );
  }
}

export default UserVacations;
