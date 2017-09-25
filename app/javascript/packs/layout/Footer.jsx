import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <div className="navbar navbar-default navbar-fixed-bottom">
        <div className="container">
          <h4>
            <p className="navbar-text pull-left">© 2017 -
              <a href="http://upwave.net" rel="noopener noreferrer" target="_blank"> UpWave</a></p>
          </h4>
          <a href="https://www.linkedin.com/company/upwaveagency" className="btn pull-right">
            <i className="fa fa-linkedin-square fa-3x" aria-hidden="true" /></a>
          <a href="https://github.com/UpWave" className="btn pull-right">
            <i className="fa fa-github fa-3x" aria-hidden="true" /></a>
        </div>
      </div>
    );
  }
}

export default Footer;
