import React from 'react';

class Comment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      body: this.props.body,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const commentId = this.props.id;
      const body = this.state.body;
      const comment = { id: commentId, body: body };
      this.props.handleUpdate(comment);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }

  handleChange(event) {
    this.setState({ body: event.target.value });
  }

  render() {
    const name = this.state.editable ?
      (<div>
        <input className="form-control" type="text" onChange={this.handleChange} defaultValue={this.props.body} />
      </div>)
      :
      (<div>
        <p>{this.props.body}</p>
      </div>);
    return (
      <div key={this.props.id}>
        {name}
        <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
        <button className="btn btn-info" onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
        <button
          className="btn btn-default"
          id="back-button"
          style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}
          onClick={this.handleBack}
        >
          Back
        </button><br/> <br/> <br/>
      </div>
    );
  }
}

export default Comment;