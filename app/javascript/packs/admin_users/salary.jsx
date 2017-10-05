import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Select from 'react-normalized-select';
import Collapsible from 'react-collapsible';
import AlertContainer from 'react-alert';
import GreyWarnIcon from '../images/grey-warn-icon.png';
import RedWarnIcon from '../images/red-warn-icon.png';
import Fetch from '../Fetch';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(235, 235, 235, 0.5)',
  },
};

class Salary extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      modalIsOpen: false,
      editableSalary: false,
      newSalary: false,
      amount: 0,
      reviewDate: '',
      salaryType: this.props.salaryTypes[0],
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSalaryChange = this.handleSalaryChange.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
    this.handleEditSalary = this.handleEditSalary.bind(this);
    this.handleBackSalary = this.handleBackSalary.bind(this);
    this.checkValues = this.checkValues.bind(this);
    this.handleReviewDateChange = this.handleReviewDateChange.bind(this);
    this.checkSetSalaryButton = this.checkSetSalaryButton.bind(this);
    this.warningIcon = this.warningIcon.bind(this);
    this.mouseOverRed = this.mouseOverRed.bind(this);
    this.mouseOverGrey = this.mouseOverGrey.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
  }

  componentDidMount() {
    Fetch.json(`/api/v1/admin/user/users/${this.props.user.id}/salaries`)
      .then((data) => {
        // data will be null when user is created,
        // but salary not assigned yet
        if (data !== null) {
          this.setState({
            amount: data.amount,
            reviewDate: data.review_date,
            salaryType: data.type,
          });
          this.checkValues();
        } else {
          this.setState({
            amount: 0,
            reviewDate: 'Not set yet',
          });
        }
      });
  }

  setNewSalary() {
    const salary = {
      amount: this.state.amount,
      review_date: this.state.reviewDate,
      type: this.state.salaryType,
    };
    this.props.setNewSalary(salary, this.props.user.id);
  }

  handleEditSalary() {
    if (this.state.editableSalary) {
      const salary = {
        amount: this.state.amount,
        review_date: this.state.reviewDate,
        type: this.state.salaryType,
      };
      this.props.handleUpdateSalary(salary, this.props.user.id);
    }
    this.setState({ editableSalary: !this.state.editableSalary });
  }

  handleBackSalary() {
    this.setState({ editableSalary: !this.state.editableSalary });
  }

  handleSalaryChange(event) {
    this.setState({ amount: event.target.value }, () => {
      this.checkSetSalaryButton();
    });
  }

  handleReviewDateChange(event) {
    this.setState({ reviewDate: event.target.value }, () => {
      this.checkSetSalaryButton();
    });
  }

  checkSetSalaryButton() {
    if ((this.state.amount > 0) && (/^\d+-\d+-\d+/.test(this.state.reviewDate))) {
      $('#edit_submit').css('visibility', 'visible');
    } else {
      $('#edit_submit').css('visibility', 'hidden');
    }
  }

  mouseOverRed() {
    this.msg.error('You have missed review date!');
  }

  mouseOverGrey() {
    this.msg.info('Review salary in few days!');
  }

  mouseLeave() {
    this.msg.removeAll();
  }

  warningIcon() {
    if ((new Date(this.state.reviewDate) - new Date()) < 0) {
      return (<div>
        <img
          onMouseOver={() => this.mouseOverRed()}
          onMouseLeave={() => this.mouseLeave()}
          src={RedWarnIcon}
          alt="red-warn-icon"
        />
        <br />
      </div>);
    } else if ((new Date(this.state.reviewDate) - new Date()) < 1.21e+9) {
      return (<div>
        <img
          onMouseOver={() => this.mouseOverGrey()}
          onMouseLeave={() => this.mouseLeave()}
          src={GreyWarnIcon}
          alt="grey-warn-icon"
        />
        <br />
      </div>);
    }
    return null;
  }

  checkValues() {
    if (this.state.reviewDate === null) {
      this.setState({ reviewDate: 'Not set yet' });
    }
    if (this.state.amount === null) {
      this.setState({ amount: 0 });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const salary = this.state.editableSalary ?
      <input className="form-control" type="number" min="0" onChange={this.handleSalaryChange} defaultValue={this.state.amount} />
      :
      <p className="lead">Amount: {this.state.amount} $</p>;
    const salaryType = this.state.editableSalary ?
      (<Select
        className="form-control"
        defaultValue={this.state.salaryType}
        onChange={e => this.setState({ salaryType: e.target.value })}
      >
        {this.props.salaryTypes.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p className="lead">Type: {this.state.salaryType}</p>;
    const warningImg = this.warningIcon();
    const reviewDate = this.state.editableSalary ?
      <input className="form-control" type="date" defaultValue={this.state.reviewDate} onChange={this.handleReviewDateChange} />
      :
      <p className="lead">Review date: {this.state.reviewDate}</p>;
    const editSubmitButton = this.state.amount === 0 ?
      null
      :
      <button className="btn btn-default" onClick={this.handleEditSalary}>{this.state.editableSalary ? 'Submit' : 'Edit'}</button>;
    const newSalary = this.state.editableSalary ?
      null
      :
      (<Collapsible
        id="collapse"
        trigger="Set new salary"
        triggerClassName="btn btn-default"
      >
        <text className="lead">Salary:</text>
        <input
          className="form-control"
          type="number"
          min="0"
          onChange={this.handleSalaryChange}
          defaultValue={this.state.amount}
        />
        <text className="lead">Review date:</text>
        <input className="form-control" type="date" onChange={this.handleReviewDateChange} />
        <text className="lead">Type:</text>
        <Select
          className="form-control"
          defaultValue={this.state.salaryType}
          onChange={e => this.setState({ salaryType: e.target.value })}
        >
          {this.props.salaryTypes.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <button id="edit_submit" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.setNewSalary}>Submit</button>
      </Collapsible>);
    return (
      <div id="salary">
        <span
          role="button"
          tabIndex={0}
          onClick={this.openModal}
        >
          <i className="fa fa-money fa-3x" />
        </span>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Salary"
        >
          <h2 className="display-3">Salary</h2>
          <div className="well">
            {warningImg}
            {salary}
            {salaryType}
            {reviewDate}
            {editSubmitButton}
            <button
              id="back-button"
              className="btn btn-default"
              style={this.state.editableSalary ? { visibility: 'visible' } : { visibility: 'hidden' }}
              onClick={this.handleBackSalary}
            >
              Back
            </button>
            {newSalary}
            <br />
          </div>
        </Modal>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

Salary.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  handleUpdateSalary: PropTypes.func.isRequired,
  setNewSalary: PropTypes.func.isRequired,
  salaryTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Salary;
