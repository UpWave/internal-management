//  import 'whatwg-fetch';
import React from 'react';
// import Fetch from 'fetch-rails';
import AlertContainer from 'react-alert';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
    };
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit() {
    // fetch('/users/sign_in', {
    //   credentials: 'same-origin',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     user: {
    //       email: this.state.email,
    //       password: this.state.password,
    //     },
    //   }),
    // });
    // Fetch.postJSON('/users/sign_in')
    //   .then(() => {
    //   }).catch((errorResponse) => {
    //     if (errorResponse.length < 50) {
    //       this.msg.error(errorResponse);
    //     } else {
    //       this.msg.error('Some errors prevented you from accessing. Reload page or try again later');
    //     }
    //   });

    $.ajax({
      url: '/users/sign_in',
      type: 'POST',
      data: {
        user: {
          email: this.state.email,
          password: this.state.password,
        },
        authenticity_token: $('meta[name="csrf-token"]').attr('content'),
        commit: 'Log in',
      },
      error: (xhr) => {
        if (xhr.responseText.length < 50) {
          this.msg.error(xhr.responseText);
        } else {
          this.msg.error('Some errors prevented you from accessing. Reload page or try again later');
        }
      },
    });
  }

  handleKeyPressed(event) {
    if (event.charCode === 13) {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div className="container" key="sign-in">
        <div className="row">
          <div className="col-md-4 col-md-offset-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="col-xs-10">
                  <input
                    className="form-control"
                    id="emailInput"
                    type="email"
                    placeholder="Email"
                    onChange={this.changeEmail}
                  />
                </div>
                <br />
                <br />
                <div className="col-xs-10">
                  <input
                    className="form-control"
                    id="paswwordInput"
                    type="password"
                    placeholder="Password"
                    onKeyPress={this.handleKeyPressed}
                    onChange={this.changePassword}
                  />
                  <br />
                  <button
                    className="btn btn-info"
                    type="submit"
                    onClick={this.handleSubmit}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default Body;
