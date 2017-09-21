import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import Header from './Header';
import Routes from './Routes';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      admin: false,
      logged: false,
      hasGoogle: false,
      hasTrello: false,
    };
    this.signOutClick = this.signOutClick.bind(this);
  }

  componentWillMount() {
    $.ajax({
      url: '/auth/is_signed_in',
      type: 'GET',
      success: (data) => {
        this.setState({ logged: data.signed_in });
        if (data.signed_in) {
          this.setState({ admin: data.user.role === 'admin' });
          this.checkIdentities();
        } else {
          this.setState({ admin: false });
        }
      },
    });
  }

  checkIdentities() {
    $.ajax({
      url: '/auth/check_identities',
      type: 'GET',
      success: (data) => {
        this.setState({ hasGoogle: data.has_google });
        this.setState({ hasTrello: data.has_trello });
      },
    });
  }

  signOutClick() {
    $.ajax({
      url: '/users/sign_out',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      type: 'DELETE',
      success: () => {
        this.setState({ logged: false });
        this.setState({ hasGoogle: false });
        this.setState({ hasTrello: false });
      },
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Header
            logged={this.state.logged}
            admin={this.state.admin}
            hasGoogle={this.state.hasGoogle}
            hasTrello={this.state.hasTrello}
            signOutClick={this.signOutClick}
          />
          <Routes
            logged={this.state.logged}
            admin={this.state.admin}
          />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('root'),
);

export default App;
