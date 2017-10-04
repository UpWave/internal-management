import React from 'react';
import AlertContainer from 'react-alert';
import moment from 'moment';
import 'moment-timezone';
import Fetch from '../Fetch';
import Content from './content';


class AdminInvoices extends React.Component {
  constructor(props) {
    super(props);
    this.userIdPattern = /users\/\d+/g;
    this.userId = window.location.href.match(this.userIdPattern)[0].replace('users/', '');
    this.state = {
      invoices: [],
      user: [],
      salaryType: '',
      salary: 0,
      dayOffs: 0,
    };
    this.loadInvoices = this.loadInvoices.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.loadInvoices(moment().format('YYYY-MM-DD'));
  }

  loadInvoices(date) {
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/invoices`, {
      date: date,
    })
      .then((data) => {
        this.setState({
          invoices: data.invoice,
          user: data.user,
          salaryType: data.salary_type,
          salary: data.salary_amount,
          dayOffs: data.day_offs_this_month,
        });
      });
  }

  handleDateChange(event) {
    this.loadInvoices(moment(event.target.value).format('YYYY-MM-DD'));
  }


  render() {
    const monthNow = moment().format('YYYY-MM');
    const title =
    (<div>
      <h2>Invoice of {this.state.user.email}</h2>
      <div className="row">
        <div className="col-sm-3">
          <input
            type="month"
            className="form-control"
            defaultValue={monthNow}
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
