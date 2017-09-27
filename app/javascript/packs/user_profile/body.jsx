import 'whatwg-fetch';
import React from 'react';
import Fetch from 'fetch-rails';
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
    Fetch.json('/api/v1/profile')
      .then((data) => {
        this.setState({ user: data });
      });
  }

  changeFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  handleSubmit(e) {
    e.preventDefault();
    const file = new FormData();
    file.append('avatar', this.state.file);
    fetch('/api/v1/profile', {
      method: 'PATCH',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      body: file,
      credentials: 'same-origin',
    })
      .then(() => {
        this.msg.success('Avatar updated');
        this.setState({ file: null });
        document.getElementById('fileInput').value = '';
        this.loadUser();
      });
  }


  render() {
    const avatar = <img src={this.state.user.photo} alt="avatar" className="img-responsive" />;
    const email = this.state.user.email;
    const role = this.state.user.role;
    const salary = this.state.user.salary;
    return (
      <div>
        <div className="well" key={this.state.user.id}>
          {avatar}
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
