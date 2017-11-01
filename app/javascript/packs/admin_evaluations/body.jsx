import React from 'react';
import AlertContainer from 'react-alert';
import { Link } from 'react-router-dom';
import Evaluations from './evaluations';
import Fetch from '../Fetch';


class AdminEvaluations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userId = this.props.match.params.user_id;
    this.state = {
      evaluations: [],
    };
    this.loadEvaluations = this.loadEvaluations.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount() {
    this.loadEvaluations();
  }

  loadEvaluations() {
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/evaluations`)
      .then((data) => {
        this.setState({ evaluations: data });
      });
  }

  handleDelete(id) {
    Fetch.deleteJSON(`/api/v1/admin/user/users/${this.userId}/evaluations/${id}`)
      .then(() => {
        this.loadEvaluations();
      });
  }

  handleUpdate(evaluation, id) {
    Fetch.putJSON(`/api/v1/admin/user/users/${this.userId}/evaluations/${id}`, {
      evaluation,
    })
      .then(() => {
        this.msg.success('Evaluation updated');
        this.loadEvaluations();
      });
  }


  render() {
    const evaluationsTable = this.state.evaluations.length > 0 ?
      (<div className="agile-grids">
        <div className="agile-tables">
          <div className="w3l-table-info">
            <Evaluations
              userId={this.userId}
              evaluations={this.state.evaluations}
              handleDelete={this.handleDelete}
              onUpdate={this.handleUpdate.bind(this)}
            />
          </div>
        </div>
      </div>)
      :
      null;

    return (
      <div>
        {evaluationsTable}
        <Link to={`/admin/users/${this.userId}/new_evaluation`} className="btn btn-success">Add New Evaluation</Link>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default AdminEvaluations;
