import React from 'react';
import Fetch from 'fetch-rails';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';
import { browserHistory } from 'react-router';
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
    Fetch.postJSON('/users/sign_in', {
      user: {
        email: this.state.email,
        password: this.state.password,
      },
    })
      .then(() => {
        this.props.isSignedIn();
        this.msg.success('Welcome back!');
        browserHistory.push('/');
      }).catch((errorResponse) => {
        if (errorResponse.length < 50) {
          this.msg.error(errorResponse);
        } else {
          this.msg.error('Some errors prevented you from accessing. Reload page or try again later');
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
      <div id="sign-in-container" className="container" style={{ visibility: 'hidden' }} key="sign-in">
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
                    onKeyPress={this.handleKeyPressed}
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
                  <Link
                    to="/"
                    className="btn btn-info"
                    type="submit"
                    onClick={this.handleSubmit}
                  >
                    Sign in
                  </Link>
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

Body.propTypes = {
  isSignedIn: PropTypes.func.isRequired,
};

export default Body;
