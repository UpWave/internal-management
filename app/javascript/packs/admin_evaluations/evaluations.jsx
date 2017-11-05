import React from 'react';
import Evaluation from './evaluation';

class Evaluations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(evaluation, id) {
    this.props.onUpdate(evaluation, id);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const evaluations = this.props.evaluations.map(evaluation => (
      <Evaluation
        id={evaluation.id}
        key={evaluation.id}
        evaluation={evaluation}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
      />
    ));


    return (
      <table id="table">
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Goals</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluations}
        </tbody>
      </table>
    );
  }
}

export default Evaluations;
