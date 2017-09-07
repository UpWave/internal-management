import React from 'react';
import ReactDOM from 'react-dom';
import Vacations from './vacations';
import NewVacation from './new_vacation';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      vacations: [],
      vacationTypes: [],
      startDate: 0,
      endDate: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.removeVacation = this.removeVacation.bind(this);
    this.loadVacations = this.loadVacations.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/vacations/types',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ vacationTypes: data });
      },
    });
    this.loadVacations();
  }

  loadVacations() {
    $.ajax({
      url: '/api/v1/vacations',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ vacations: data });
      },
    });
  }

  handleSubmit() {
    this.loadVacations();
  }

  handleDelete(id) {
    $.ajax({
      url: `/api/v1/vacations/${id}`,
      type: 'DELETE',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      success: () => {
        this.removeVacation(id);
      },
    });
  }

  removeVacation() {
    this.loadVacations();
  }

  render() {
    if (this.state.vacations.length === 0) {
      return (
        <div>
          <h3>You have no pending Vacations</h3>
          <NewVacation
            key="new_vacation"
            handleSubmit={this.handleSubmit}
            vacationTypes={this.state.vacationTypes}
          />
        </div>
      );
    }
    return (
      <div>
        <Vacations
          key={this.state.vacations.length.toString()}
          vacations={this.state.vacations}
          handleDelete={this.handleDelete}
        />
        <NewVacation
          key="new_vacation"
          handleSubmit={this.handleSubmit}
          vacationTypes={this.state.vacationTypes}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root'),
);
