import React from 'react';
import PropTypes from 'prop-types';
import Comment from './comment';

class Comments extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comments: [],
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  onUpdate(comment) {
    this.props.onUpdate(comment);
  }

  handleDelete(id){
    this.props.handleDelete(id);
  }

  render() {
    const comments = this.props.comments.map(comment => (
      <div key={comment.id}>
        <Comment
          id={comment.id}
          key={comment.id}
          body={comment.body}
          handleUpdate={this.onUpdate}
          handleDelete={this.handleDelete}
        />
      </div>
    ));
    return (
      <div>
        <h3>Comments</h3>
        <div className="row">
          {comments}
        </div>
      </div>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    body: PropTypes.string,
  })).isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Comments;
