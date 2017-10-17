import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { progressBarFetch, setOriginalFetch } from 'react-fetch-progressbar';
import Fetch from '../Fetch';
import Sidebar from './Sidebar';
import Content from './Content';
import SignIn from '../sign_in/body';


setOriginalFetch(window.fetch);
window.fetch = progressBarFetch;


class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      toggle: true,
      loadingFinished: false,
      admin: false,
      logged: false,
      hasGoogle: false,
      hasTrello: false,
    };
    this.isSignedIn = this.isSignedIn.bind(this);
    this.signOutClick = this.signOutClick.bind(this);
    this.sideBarCollapse = this.sideBarCollapse.bind(this);
  }

  componentWillMount() {
    this.isSignedIn();
  }

  isSignedIn() {
    Fetch.json('/auth/is_signed_in')
      .then((data) => {
        this.setState({ logged: data.signed_in });
        this.setState({ loadingFinished: true });
        if (data.signed_in) {
          this.setState({ admin: data.user.role === 'admin' });
          this.checkIdentities();
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
        this.setState({
          logged: false,
          admin: false,
          hasTrello: false,
          hasGoogle: false,
        });
      });
  }

  sideBarCollapse() {
    if (this.state.toggle) {
      $('.page-container').addClass('sidebar-collapsed').removeClass('sidebar-collapsed-back');
      $('#menu span').css({ position: 'absolute' });
    } else {
      $('.page-container').removeClass('sidebar-collapsed').addClass('sidebar-collapsed-back');
      setTimeout(() => {
        $('#menu span').css({ position: 'relative' });
      }, 400);
    }
    this.setState({ toggle: !this.state.toggle });
  }

  render() {
    const loadingFinished = this.state.loadingFinished;
    const logged = this.state.logged;
    let signIn = (loadingFinished && (logged === false)) ?
      (<SignIn
        isSignedIn={this.isSignedIn}
      />)
      :
      null;
    if (window.location.href.match(/users\/password/)) {
      signIn = null;
    }
    const mainComponent =
    (<div>
      <Sidebar
        logged={this.state.logged}
        admin={this.state.admin}
        hasGoogle={this.state.hasGoogle}
        signOutClick={this.signOutClick}
        hasTrello={this.state.hasTrello}
        sideBarCollapse={this.sideBarCollapse}
      />
      <Content
        logged={this.state.logged}
        admin={this.state.admin}
      />
    </div>);
    function renderAll() {
      if (loadingFinished && logged) {
        return mainComponent;
      }
      return signIn;
    }
    return (
      <Router>
        <div className="page-container" >
          {renderAll()}
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
