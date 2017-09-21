import React from 'react';
import AlertContainer from 'react-alert';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: [],
      salary: 0,
      avatar: '',
    };
    this.loadUser = this.loadUser.bind(this);
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
          user: data.user,
          salary: data.salary,
          avatar: data.avatar,
        });
      },
    });
  }

  render() {
    const avatar = <img src={this.state.avatar} alt="avatar" className="img-responsive" />;
    const email = this.state.user.email;
    const role = this.state.user.role;
    const salary = this.state.salary;
    return (
      <div>
        <div className="well" key={this.state.user.id}>
          {avatar}
          <p className="lead">Email: {email}</p>
          <p className="lead">Role: {role}</p>
          <p className="lead">Salary: {salary}</p>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default Body;
