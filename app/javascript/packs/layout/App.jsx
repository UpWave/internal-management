import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

ReactDOM.render(
  <App />, document.getElementById('root'),
);

export default App;
