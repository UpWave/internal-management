import React from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
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

  handleDelete(id) {
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
      <div id="comments">
          <h2 className="text-center">Comments</h2>
          <div>
            {comments}
          </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
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