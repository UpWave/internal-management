import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Fetch from 'fetch-rails';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

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
    Fetch.json('/auth/is_signed_in')
      .then((data) => {
        this.setState({ logged: data.signed_in });
        if (data.signed_in) {
          this.setState({ admin: data.user.role === 'admin' });
          this.checkIdentities();
        } else {
          this.setState({ admin: false });
        }
      });
  }

  checkIdentities() {
    Fetch.json('/auth/check_identities')
      .then((data) => {
        this.setState({
          hasGoogle: data.has_google,
          hasTrello: data.has_trello,
        });
      });
  }

  signOutClick() {
    Fetch.deleteJSON('/users/sign_out')
      .then(() => {
        this.setState({ logged: false });
        location.reload();
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
            signOutClick={this.signOutClick}
            hasTrello={this.state.hasTrello}
          />
          <br /><br /><br /><br />
          <Content
            logged={this.state.logged}
            admin={this.state.admin}
          />
          <Footer />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

export default App;
