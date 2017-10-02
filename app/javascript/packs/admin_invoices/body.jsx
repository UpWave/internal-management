import React from 'react';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';
import Content from './content';

class AdminInvoices extends React.Component {
  constructor(props) {
    super(props);
    const userIdPattern = /users\/\d+/g;
    this.state = {
      invoices: [],
      user: [],
      salaryType: '',
      salary: 0,
      dayOffs: 0,
      userId: window.location.href.match(userIdPattern)[0].replace('users/', ''),
    };
    this.loadInvoices = this.loadInvoices.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.loadInvoices(new Date());
  }

  loadInvoices(date) {
    Fetch.json(`/api/v1/admin/user/users/${this.state.userId}/invoices`, {
      date: date,
    })
      .then((data) => {
        this.setState({
          invoices: data[0],
          user: data[1],
          salaryType: data[2],
          salary: data[3],
          dayOffs: data[4],
        });
      });
  }

  handleDateChange(event) {
    this.loadInvoices(event.target.value.concat('-01'));
  }


  render() {
    const today = new Date();
    const year = today.getUTCFullYear().toString();
    let month = (today.getUTCMonth() + 1).toString();
    if (month.length === 1) {
      month = '0'.concat(month);
    }
    const defaultDate = year.concat('-') + month;
    const title =
    (<div>
      <h2>Invoice of {this.state.user.email}</h2>
      <div className="row">
        <div className="col-sm-3">
          <input
            type="month"
            className="form-control"
            defaultValue={defaultDate}
            onChange={this.handleDateChange}
          />
        </div>
      </div>
    </div>);
    return (
      <div className="well">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {title}
        <Content
          invoices={this.state.invoices}
          loadInvoices={this.loadInvoices}
          salaryType={this.state.salaryType}
          salary={this.state.salary}
          dayOffs={this.state.dayOffs}
        />
      </div>
    );
  }
}


export default AdminInvoices;
