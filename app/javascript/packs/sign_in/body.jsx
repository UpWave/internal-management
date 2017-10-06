import React from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';


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

  handleSubmit(event) {
    event.preventDefault();
    Fetch.postJSON('/users/sign_in', {
      user: {
        email: this.state.email,
        password: this.state.password,
      },
    })
      .then(() => {
        this.props.isSignedIn();
      }).catch((errorResponse) => {
        if (errorResponse.length < 50) {
          this.msg.error(errorResponse);
        } else {
          this.msg.error(errorResponse.error);
        }
      });
  }

  handleKeyPressed(event) {
    if (event.charCode === 13) {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div id="sign-in-container" key="sign-in">
        <div className="main-wthree">
          <div className="container">
            <div className="sin-w3-agile">
              <div className="footer">
                <div style={{ width: '50%', margin: '0 auto' }}>
                  <span style={{ paddingLeft: '30%' }} />
                  <a href="/users/auth/google_oauth2">
                    <i className="fa fa-google fa-3x" />
                  </a>
                  <span style={{ paddingLeft: '5%' }} />
                  <a href="/users/auth/trello">
                    <i className="fa fa-trello fa-3x" />
                  </a>
                </div>
              </div>
              <h2>Sign In</h2>
              <form action="#" method="post">
                <div className="username">
                  <span className="username">Email:</span>
                  <input
                    type="email"
                    name="name"
                    className="name"
                    placeholder=""
                    required=""
                    onChange={this.changeEmail}
                  />
                  <div className="clearfix" />
                </div>
                <div className="password-agileits">
                  <span className="username">Password:</span>
                  <input
                    type="password"
                    name="password"
                    className="password"
                    placeholder=""
                    required=""
                    onChange={this.changePassword}
                  />
                  <div className="clearfix" />
                </div>
                <div className="login-w3">
                  <input
                    type="submit"
                    className="login"
                    value="Sign In"
                    onClick={this.handleSubmit}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

Body.propTypes = {
  isSignedIn: PropTypes.func.isRequired,
};

export default Body;
