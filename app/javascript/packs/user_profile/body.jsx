import React from 'react';
import AlertContainer from 'react-alert';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: [],
    };
    this.loadUser = this.loadUser.bind(this);
    this.changeFile = this.changeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser() {
    $.ajax({
      url: '/api/v1/profile',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({
          user: data,
        });
      },
    });
  }

  changeFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  handleSubmit(e) {
    e.preventDefault();
    const avatar = new FormData();
    avatar.append('avatar', this.state.file);
    $.ajax({
      url: '/api/v1/profile',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      type: 'PATCH',
      data: avatar,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: () => {
        this.msg.success('Avatar updated');
        this.setState({ file: null });
        document.getElementById('fileInput').value = '';
        this.loadUser();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }


  render() {
    const avatar = <img src={this.state.user.photo} alt="avatar" className="img-responsive" />;
    const first_name = this.state.user.first_name;
    const last_name = this.state.user.last_name;
    const email = this.state.user.email;
    const role = this.state.user.role;
    const salary = this.state.user.salary;
    return (
      <div>
        <div className="well" key={this.state.user.id}>
          {avatar}
          <p className="lead">Name: {first_name}</p>
          <p className="lead">Last name: {last_name}</p>
          <p className="lead">Email: {email}</p>
          <p className="lead">Role: {role}</p>
          <p className="lead">Salary: {salary}</p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <p className="lead">Select image to upload</p>
          <input
            id="fileInput"
            className="file"
            type="file"
            accept="image/*"
            onChange={this.changeFile}
          />
          <button
            className="btn btn-info"
            type="submit"
            style={this.state.file ? { visibility: 'visible' } : { visibility: 'hidden' }}
            onClick={this.handleSubmit}
          >
          Upload avatar
          </button>
        </form>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default Body;
