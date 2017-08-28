import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const createTimelog = <button onClick={myFunction}>Create Timelog</button>;
function myFunction() {
    alert("I am an alert box!");
}
ReactDOM.render(
  createTimelog,
  document.body.appendChild(document.createElement('div'))
);