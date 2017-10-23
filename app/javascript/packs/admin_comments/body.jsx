import React from 'react';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';
import Comments from './comments';

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      userId: this.props.match.params.user_id,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadComments = this.loadComments.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadComments();
  }

  loadComments() {
    Fetch.json(`/api/v1/admin/user/users/${this.state.userId}/comments`)
      .then((data) => {
        this.setState({
          comments: data,
        });
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleCreate() {
    Fetch.postJSON(`/api/v1/admin/user/users/${this.state.userId}/comments`, {
      body: this.state.body,
      user_id: this.state.userId,
    })
      .then(() => {
        this.msg.success('Successfully added comment');
        this.setState({ body: '' });
        this.loadComments();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleUpdate(comment) {
    Fetch.putJSON(`/api/v1/admin/user/users/${this.props.userId}/comments/${comment.id}`, {
      body: comment.body,
    })
      .then(() => {
        this.msg.success('Successfully updated comment');
        this.loadComments();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleDelete(id) {
    Fetch.deleteJSON(`/api/v1/admin/user/users/${this.props.userId}/comments/${id}`)
      .then(() => {
        this.msg.success('Comment deleted');
        this.loadComments();
      }).catch(() => {
        this.loadComments();
      });
  }

  handleChange(event) {
    this.setState({ body: event.target.value });
  }

  render() {
    return (
      <div className="well col-md-6 col-md-offset-3">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div>
          <input className="form-control" type="text" value={this.state.body} onChange={this.handleChange} />
          <br />
          <button className="btn btn-success" onClick={this.handleCreate}>Add comment</button>
          <br />
        </div>
        <Comments
          key={this.state.comments.length.toString()}
          comments={this.state.comments}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
          userId={this.state.userId}
        />
      </div>
    );
  }
}

export default Notes;
