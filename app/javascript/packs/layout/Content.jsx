import React from 'react';
import PropTypes from 'prop-types';
import Routes from './Routes';

class Content extends React.Component {
  render() {
    return (
      <div className="left-content">
        <Routes
          logged={this.props.logged}
          admin={this.props.admin}
        />
      </div>
    );
  }
}

Content.propTypes = {
  logged: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default Content;
