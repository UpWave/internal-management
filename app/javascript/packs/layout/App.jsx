import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from './header';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
