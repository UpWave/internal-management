import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class Form extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);
    this.handleGoalNameChange = this.handleGoalNameChange.bind(this);
    this.handleMarkChange = this.handleMarkChange.bind(this);
    this.handleAddGoal = this.handleAddGoal.bind(this);
  }

  handleSubmit() {
    this.props.handleSubmit();
  }

  handleDueDateChange(e) {
    this.props.handleDueDateChange(e);
  }

  handleGoalNameChange() {
    this.props.handleGoalNameChange();
  }

  handleMarkChange() {
    this.props.handleMarkChange();
  }

  handleAddGoal() {
    this.props.handleAddGoal();
  }

  render() {
    const submitButton = this.props.evaluation.goals_attributes.length > 0 && this.props.evaluation.dueDate !== '' ?
      (
        <button
          id="submit"
          className="btn btn-success"
          onClick={this.props.handleSubmit}
        >
          Create Evaluation
        </button>
      )
      :
      null;

    const marks = Array(10).fill(0).map((e, i) => i + 1);

    return (
      <div className="row">
        <div className="col-md-4">
          <h3>Add new Goal:</h3>
          <div className="goals-fieldset">
            <input
              className="form-control"
              type="text"
              placeholder="Goal Name"
              value={this.props.goalName}
              onChange={this.props.handleGoalNameChange}
            />
            <br />
            <Select
              className="form-control"
              value={this.props.goalMark}
              onChange={this.props.handleMarkChange}
            >
              <option key='0' value='0'>Choose mark</option>)
              {marks.map(option =>
                <option key={option} value={option}>{option}</option>)}
            </Select>
          </div>
          <br />
          {
            this.props.goalName.length > 0 ?
              <button
                className="btn btn-success"
                onClick={this.handleAddGoal}
              >
                + Add Goal
              </button>
              : null
          }

        </div>

        <div className="col-md-4">
          <h3>Evaluation due date:</h3>
          <input
            className="form-control"
            type="date"
            min={new Date().toJSON().slice(0, 10)}
            onChange={e => this.handleDueDateChange(e)}
          />
          <br />
          {submitButton}
        </div>
      </div>
    );
  }
}

export default Form;

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleDueDateChange: PropTypes.func.isRequired,
  handleGoalNameChange: PropTypes.func.isRequired,
  handleMarkChange: PropTypes.func.isRequired,
  handleAddGoal: PropTypes.func.isRequired,
};
