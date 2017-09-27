import React from 'react';
import PropTypes from 'prop-types';
import Timelog from './timelog';

class Timelogs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }
  onUpdate(timelog) {
    this.props.onUpdate(timelog);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const timelogs = this.props.timelogs.map(timelog => (
      <div key={timelog.id} className="col-sm-6">
        <div className="well">
          <Timelog
            id={timelog.id}
            key={timelog.id.toString()}
            trelloCards={this.props.trelloCards}
            timelog={timelog}
            handleDelete={this.handleDelete}
            handleUpdate={this.onUpdate}
          />
        </div>
      </div>
    ));
    return (
      <div className="row">
        {timelogs}
      </div>
    );
  }
}

Timelogs.propTypes = {
  timelogs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    trello_card: PropTypes.string,
    duration: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  })).isRequired,
  trelloCards: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Timelogs;
