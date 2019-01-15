import React, { Component } from "react";
import firebase from "../config/database";
var Loader = require('halogen/PulseLoader');

export default class EditVenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venueId: this.props.params.id,
      venue: {},
      loading: false,
      homeService: false,
      clinic: false,
      salon: false,
      spa: false,
      currentServiceItem: null,
      isEditingService: false,
      currentScheduleItem: null,
      isEditingSchedules: false,
      times: [
        "12:00 am",
        "01:00 am",
        "02:00 am",
        "03:00 am",
        "04:00 am",
        "05:00 am",
        "06:00 am",
        "07:00 am",
        "08:00 am",
        "09:00 am",
        "10:00 am",
        "11:00 am",
        "12:00 pm",
        "01:00 pm",
        "02:00 pm",
        "03:00 pm",
        "04:00 pm",
        "05:00 pm",
        "06:00 pm",
        "07:00 pm",
        "08:00 pm",
        "09:00 pm",
        "10:00 pm",
        "11:00 pm"
      ],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      teamMembers: [],
      reviews: [],
      isteamMemberEditing: false,
      currentTeamMemberItem: {},
      isEditingMemberSchedule: false,
      currentTeamMemberScheduleItem: {},
    };
    this.onChange = this.onChange.bind(this)
    this.checkboxOnchange = this.checkboxOnchange.bind(this)
    this.onChangeEditService = this.onChangeEditService.bind(this)
    this.createTableSchedules = this.createTableSchedules.bind(this)
    this.createTableTeamMembers = this.createTableTeamMembers.bind(this)
    this.onChangeEditSchedule = this.onChangeEditSchedule.bind(this)
    this.selectOnchange = this.selectOnchange.bind(this)
    this.selectOnchangeEditSchedule = this.selectOnchangeEditSchedule.bind(this)
    this.getTeamMembers = this.getTeamMembers.bind(this)
    this.getReviews = this.getReviews.bind(this)
    this.createTeamMemberSchedules = this.createTeamMemberSchedules.bind(this)
    this.onChangeTeamMember = this.onChangeTeamMember.bind(this)
    this.selectOnchangeTeamMemberEditSchedule = this.selectOnchangeTeamMemberEditSchedule.bind(this)
  }
  componentDidMount() {
    this.getVenue();
    this.getReviews();
  }

  getVenue() {
    const db = firebase.app.firestore();
    this.setState({ loading: true }, () => {
      db.collection("venues")
      .doc(this.state.venueId)
      .onSnapshot(res => {
        this.setState({ venue: res.data(), loading: false }, () => {
          this.initCheckbox();
        });
      }).catch(error => {
        this.setState({ loading: false });
      })
    });
    setTimeout(() => {
      this.getTeamMembers();
    }, 10);
  }
  getTeamMembers() {
    const db = firebase.app.firestore();
    db.collection("teamMembers")
      .where('venueId', '==', this.props.params.id)
      .onSnapshot(res => {
        const teamMembers = [];
        res.forEach(i => {
          const member = i.data();
          member.id = i.id;
          teamMembers.push(member);
        });
        this.setState({ loading: false, teamMembers }, () => {
          console.log('this.stated ndndjdnjdndndj', this.state)
        });
      }).catch(error => {
        this.setState({ loading: false });
      })
  }
  getReviews() {
    const db = firebase.app.firestore();
    db.collection("ratingsReviews")
    .where('venueId', '==', this.props.params.id)
    .onSnapshot(res => {
      const reviews = [];
      res.forEach(i => {
        const review = i.data();
        review.id = i.id;
        reviews.push(review);
      });
      this.setState({ reviews }, () => {
        console.log('New Reviews', this.state)
      });
    }).catch(error => {
      this.setState({ loading: false });
    })
  }
  onChange(e) {
    this.setState({
      venue: {
        ...this.state.venue,
        [e.target.name]: e.target.value,
      }
    })
  }
  initCheckbox() {
    const { venue } = this.state;
    if (Object.getOwnPropertyNames(this.state.venue).length > 0) {
      const object = {}
      venue.categories.forEach(i => {
        if (i === 'home service') {
          object.homeService = true;
        } else if (i === 'clinic') {
          object.clinic = true;
        } else if (i === 'salon') {
          object.salon = true;
        } else if (i === 'spa') {
          object.spa = true;
        }
      })
      this.setState({
        ...this.state,
        ...object
      })
    }
  }
  checkboxOnchange(e) {
    const { checked, name } = e.target
    const { venue } = this.state;
    if (name === 'home service') {
      this.setState({ homeService: !this.state.homeService });
    } else {
      this.setState({ [name]: !this.state[name] });
    }
    if (checked) {
      venue.categories.push(name)
      this.setState({
        venue: {
          ...venue,
          categories: venue.categories,
        }
      })
      
    } else {
      this.setState({
        venue: {
          ...venue,
          categories: venue.categories.filter(i => i !== name),
        }
      })
    }
  }
  createTable(item) {
    if (Object.getOwnPropertyNames(this.state.venue).length > 0) {
      return item.map((service, index) => 
        <tr key={index}>
          <td>{service.serviceName}</td>
          <td>{service.price}</td>
          <td>{service.category}</td>
          <td>{service.discount}</td>
          <td>
            <button
              className="btn"
              style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
              onClick={(e) => {
                e.preventDefault()
                this.setState({
                  isEditingService: true,
                  currentServiceItem: service,
                  serviceIndex: index,
                })
              }}
            >
              Edit
            </button>
          </td>
        </tr>
      )
    }
  }
  createTableTeamMembers() {
    if (this.state.teamMembers.length > 0) {
      return this.state.teamMembers.map((member, index) => 
        <tr key={index}>
          <td style={{ fontWeight: '500' }}>{member.id}</td>
          <td>{member.name}</td>
          <td>{member.gender}</td>
          <td>
            <button
              className="btn"
              style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
              onClick={(e) => {
                e.preventDefault()
                this.setState({
                  isteamMemberEditing: true,
                  currentTeamMemberItem: member,
                })
              }}
            >
              Edit
            </button>
          </td>
        </tr>
      )
    }
  }
  createTableReviews() {
    if (this.state.reviews.length > 0) {
      return this.state.reviews.map((review, index) => 
        <tr key={index}>
          {/* <td style={{ fontWeight: '500' }}>{review.id}</td> */}
          <td>{review.userDetails.firstName}</td>
          <td>{review.rating}</td>
          <td>{review.feedbackText}</td>
          {/* <td>
            <button
              className="btn"
              style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
              onClick={(e) => {
                e.preventDefault()
                // this.setState({
                //   isEditingService: true,
                //   currentServiceItem: service,
                //   serviceIndex: index,
                // })
              }}
            >
              Images
            </button>
          </td> */}
          <td>
            <button
              className="btn"
              style={{ backgroundColor: '#ec4040', borderRadius: '30px' }}
              onClick={(e) => {
                e.preventDefault()
                firebase.app.firestore().collection("ratingsReviews").doc(review.id).delete().then(function() {
                  console.log("Document successfully deleted!");
              }).catch(function(error) {
                  console.error("Error removing document: ", error);
              });
              }}
            >
              Remove
            </button>
          </td>

        </tr>
      )
    }
  }
  createTeamMemberSchedules() {
    if (Object.getOwnPropertyNames(this.state.currentTeamMemberItem.availability).length > 0) {
      return this.state.currentTeamMemberItem.availability.map((schedule, index) => 
        <tr key={index}>
          <td>{schedule.open}</td>
          <td>{schedule.close}</td>
          <td>{schedule.day}</td>
          <td>
            <button
              className="btn"
              style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
              onClick={(e) => {
                e.preventDefault()
                this.setState({
                  currentTeamMemberScheduleItem: schedule,
                  isEditingMemberSchedule: true,
                  teamMemberScheduleIndex: index,
                })
              }}
            >
              Edit
            </button>
          </td>
        </tr>
      )
    }
  }
  createTableSchedules(item) {
    if (Object.getOwnPropertyNames(this.state.venue).length > 0) {
      return item.map((schedule, index) => 
        <tr key={index}>
          <td>{schedule.open}</td>
          <td>{schedule.close}</td>
          <td>{schedule.day}</td>
          <td>
            <button
              className="btn"
              style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
              onClick={(e) => {
                e.preventDefault()
                this.setState({
                  isEditingSchedules: true,
                  currentScheduleItem: schedule,
                  scheduleIndex: index,
                })
              }}
            >
              Edit
            </button>
          </td>
        </tr>
      )
    }
  }
  onChangeEditService(e) {
    const { name, value } = e.target;
    this.setState({ 
      currentServiceItem: {
        ...this.state.currentServiceItem,
        [name]: value.toString()
      }
     });
  }
  onChangeEditSchedule(e) {
    const { name, value } = e.target;
    this.setState({ 
      currentScheduleItem: {
        ...this.state.currentScheduleItem,
        [name]: value.toString()
      }
     });
  }
  onChangeTeamMember(e) {
    const { name, value } = e.target;
    this.setState({ 
      currentTeamMemberItem: {
        ...this.state.currentTeamMemberItem,
        [name]: value.toString()
      }
     });
  }
  selectOnchange(e) {
    this.setState({
      venue: {
        ...this.state.venue,
        [e.target.name]: e.target.value,
      }
    })
  }
  selectOnchangeEditSchedule(e) {
    const { name, value } = e.target;
    this.setState({ 
      currentScheduleItem: {
        ...this.state.currentScheduleItem,
        [name]: value.toString()
      }
     });
  }
  selectOnchangeTeamMemberEditSchedule(e) {
    const { name, value } = e.target;
    this.setState({ 
      currentTeamMemberScheduleItem: {
        ...this.state.currentTeamMemberScheduleItem,
        [name]: value.toString()
      }
     });
  }
  optionTimeLooped(type) {
    return this.state[type].map((time, index) => <option key={index} value={time}>{time}</option>);
  }
  render() {
    const { name, description, venueAddress, serviceFor, status, headerImage  } = this.state.venue;
    return (
      <div className="App">
        <div className="col-md-12">
        <div style={{textAlign: 'center'}}>
        {this.state.loading ? <Loader color="#8637AD" size="12px" margin="4px"/> : ""}
        </div>
          <div className="card">
            <form className="form-horizontal">
              <div
                className="card-header card-header-text"
                data-background-color="rose"
              >
                <h4 className="card-title">
                  Edit Venue
                </h4>
              </div>
              <div key={0} className="card-content">                
                <div className="row">
                  {/* <div>
                    <div 
                      style={{
                        margin: '50px',
                        width: '100%',
                        height: '300px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        style={{
                          width: '100%',
                          height: '400px',
                          margin: '-75px 0 0 -100px',
                        }}
                        src={headerImage}
                      />
                    </div>
                  </div> */}
                  <label className="col-sm-3 label-on-left">Venue name</label>
                  <div className="col-sm-8">
                    <div className="form-group label-floating is-empty">
                      <label className="control-label" />
                      <input
                        name="name"
                        type="text"
                        className={"form-control"}
                        value={name}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <label className="col-sm-3 label-on-left">Description</label>
                  <div className="col-sm-8">
                    <div className="form-group label-floating is-empty">
                      <label className="control-label" />
                      <input type="text" className={"form-control"} value={description} name="description" onChange={this.onChange}/>
                    </div>
                  </div>
                  <label className="col-sm-3 label-on-left">Venue address</label>
                  <div className="col-sm-8">
                    <div className="form-group label-floating is-empty">
                      <label className="control-label" />
                      <input type="text" className={"form-control"} value={venueAddress} name="venueAddress" onChange={this.onChange} />
                    </div>
                  </div>
                  <label className="col-sm-3 label-on-left">Venue Status</label>
                  <div className="col-sm-8">
                      <label className="control-label"></label>
                      <select
                        className={"form-control"}
                        value={status}
                        name="status"
                        onChange={this.selectOnchange}
                      >
                        <option value={'disabled'}>Disabled</option>
                        <option value={'accepted'}>Accepted</option>
                        <option value={'rejected'}>Rejected</option>
                      </select>
                  </div>
                  <label className="col-sm-3 label-on-left">Venue service for</label>
                  <div className="col-sm-8">
                    <label className="control-label"></label>
                    <select
                      className={"form-control"}
                      value={serviceFor}
                      name="serviceFor"
                      onChange={this.selectOnchange}
                    >
                      <option value={'male'}>Male</option>
                      <option value={'female'}>Female</option>
                      <option value={'both'}>Both</option>
                    </select>
                  </div>
                  <label className="col-sm-3 label-on-left"></label>
                  <div className="col-sm-8">
                  <div className="form-group label-floating is-empty checkbox-radios">
                    <label style={{ margin: '10px', fontSize: '18px' }}>Home service </label>
                    <input
                      style={{ fontSize: '30px'}}
                      className="form-check-input"
                      type="checkbox"
                      name="home service"
                      checked={this.state.homeService}
                      onChange={this.checkboxOnchange}
                    />
                    <label style={{ margin: '10px', fontSize: '18px' }}>Clinic </label>
                    <input
                      style={{ fontSize: '30px'}}
                      className="form-check-input"
                      type="checkbox"
                      checked={this.state.clinic}
                      name="clinic"
                      onChange={this.checkboxOnchange}
                    />
                    <label style={{ margin: '10px', fontSize: '18px' }}>Salon </label>
                    <input
                      style={{ fontSize: '30px'}}
                      className="form-check-input"
                      checked={this.state.salon}
                      type="checkbox"
                      name="salon"
                      onChange={this.checkboxOnchange}
                    />
                    <label style={{ margin: '10px', fontSize: '18px' }}>Spa </label>
                    <input
                      style={{ fontSize: '30px'}}
                      className="form-check-input"
                      checked={this.state.spa}
                      type="checkbox"
                      name="spa"
                      onChange={this.checkboxOnchange}
                    />
                  </div>
                  </div>
                </div>
                <button
                  style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                  className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(this.state.venue);
                    const db = firebase.app.firestore();
                    this.setState({
                      loading: true,
                    }, () => {
                      db.collection('venues').doc(this.state.venueId).update(this.state.venue)
                      .then((res) => {
                        this.setState({ loading: false }, () => {
                          alert('Succefully saved');     
                        })
                      })
                      .catch(err => {
                        this.setState({ loading: false }, () => {
                          alert('Something went wrong');
                        })
                      })
                    })
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          {
            this.state.isEditingService &&
              <div className="col-md-12">
                  <div className="card">
                      <div className="card-header card-header-icon" data-background-color="lightblue">
                          <i className="material-icons">assignment</i>
                      </div>
                      <div className="card-content">
                        <form className="form-horizontal">
                            <h4 className="card-title">Edit Service Form</h4>
                            <div className="row">
                              <label className="col-sm-3 label-on-left">Service name</label>
                              <div className="col-sm-8">
                                <div className="form-group label-floating is-empty">
                                  <label className="control-label" />
                                  <input
                                    name="serviceName"
                                    type="text"
                                    className={"form-control"}
                                    value={this.state.currentServiceItem.serviceName}
                                    onChange={this.onChangeEditService}
                                  />
                                </div>
                              </div>
                              <label className="col-sm-3 label-on-left">Service Price</label>
                              <div className="col-sm-8">
                                <div className="form-group label-floating is-empty">
                                  <label className="control-label" />
                                  <input
                                    name="price"
                                    type="number"
                                    className={"form-control"}
                                    value={this.state.currentServiceItem.price}
                                    onChange={this.onChangeEditService}
                                  />
                                </div>
                              </div>
                              <label className="col-sm-3 label-on-left">Service category</label>
                              <div className="col-sm-8">
                                <div className="form-group label-floating is-empty">
                                  <label className="control-label" />
                                  <input
                                    name="category"
                                    type="text"
                                    className={"form-control"}
                                    value={this.state.currentServiceItem.category}
                                    onChange={this.onChangeEditService}
                                  />
                                </div>
                              </div>
                              <label className="col-sm-3 label-on-left">Service discount</label>
                              <div className="col-sm-8">
                                <div className="form-group label-floating is-empty">
                                  <label className="control-label" />
                                  <input
                                    name="discount"
                                    type="number"
                                    className={"form-control"}
                                    value={this.state.currentServiceItem.discount}
                                    onChange={this.onChangeEditService}
                                  />
                                </div>
                              </div>
                            </div>
                            <button
                              style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                              className="btn btn-warning"
                              onClick={(e) => {
                                e.preventDefault();
                                const db = firebase.app.firestore();
                                const { servicesOffers } = this.state.venue;
                                const index = this.state.serviceIndex;
                                
                                servicesOffers[index].price = this.state.currentServiceItem.price;
                                servicesOffers[index].serviceName = this.state.currentServiceItem.serviceName;
                                servicesOffers[index].category = this.state.currentServiceItem.category;
                                servicesOffers[index].discount = this.state.currentServiceItem.discount;
                                this.setState({
                                  loading: true,
                                }, () => {
                                  db.collection('venues').doc(this.state.venueId).update(this.state.venue)
                                  .then((res) => {
                                    alert('Succefully saved');     
                                    this.setState({
                                      currentServiceItem: {},
                                      isEditingService: false,
                                      loading: false,
                                    })
                                  })
                                  .catch(err => {
                                    this.setState({
                                      currentServiceItem: {},
                                      isEditingService: false,
                                      loading: false,
                                    })
                                  })
                                })
                              }}
                            >
                              Save
                            </button>
                            <button
                              style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                              className="btn btn-default"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ isEditingService: false })
                              }}
                            >
                              Cancel
                            </button>
                        </form>
                      </div>
                  </div>
              </div>
          }
          <div className="col-md-12">
              <div className="card">
                  <div className="card-header card-header-icon" data-background-color="lightblue">
                      <i className="material-icons">assignment</i>
                  </div>
                  <div className="card-content">
                      <h4 className="card-title">Services</h4>
                      <div className="toolbar"></div>
                      <div className="material-datatables">
                        <table className="table datatable table-striped table-no-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Service name</th>
                              <th>Price</th>
                              <th>Category</th>
                              <th>Discount</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.createTable(this.state.venue.servicesOffers)}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>Service name</th>
                              <th>Price</th>
                              <th>Category</th>
                              <th>Discount</th>
                              <th>Actions</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                  </div>
              </div>
          </div>
          {
            this.state.isEditingSchedules &&
              <div className="col-md-12">
                  <div className="card">
                      <div className="card-header card-header-icon" data-background-color="lightblue">
                          <i className="material-icons">assignment</i>
                      </div>
                      <div className="card-content">
                        <form className="form-horizontal">
                            <h4 className="card-title">Edit Schedule Form</h4>
                            <div className="row">
                            <label className="col-sm-3 label-on-left">Venue Open</label>
                            <div className="col-sm-8">
                                <label className="control-label"></label>
                                <select
                                  className={"form-control"}
                                  value={this.state.currentScheduleItem.open}
                                  name="open"
                                  onChange={this.selectOnchangeEditSchedule}
                                >
                                  {this.optionTimeLooped('times')}
                                </select>
                            </div>
                            <label className="col-sm-3 label-on-left">Venue Close</label>
                            <div className="col-sm-8">
                                <label className="control-label"></label>
                                <select
                                  className={"form-control"}
                                  value={this.state.currentScheduleItem.close}
                                  name="close"
                                  onChange={this.selectOnchangeEditSchedule}
                                >
                                  {this.optionTimeLooped('times')}
                                </select>
                            </div>
                            <label className="col-sm-3 label-on-left">Venue Close</label>
                            <div className="col-sm-8">
                                <label className="control-label"></label>
                                <select
                                  className={"form-control"}
                                  value={this.state.currentScheduleItem.day}
                                  name="day"
                                  onChange={this.selectOnchangeEditSchedule}
                                >
                                  {this.optionTimeLooped('days')}
                                </select>
                            </div>
                            </div>
                            <button
                              style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                              className="btn btn-warning"
                              onClick={(e) => {
                                e.preventDefault();
                                const db = firebase.app.firestore();
                                const { schedules } = this.state.venue;
                                const index = this.state.scheduleIndex;
                                
                                schedules[index].open = this.state.currentScheduleItem.open;
                                schedules[index].close = this.state.currentScheduleItem.close;
                                schedules[index].day = this.state.currentScheduleItem.day;

                                this.setState({
                                  loading: true,
                                }, () => {
                                  db.collection('venues').doc(this.state.venueId).update(this.state.venue)
                                  .then((res) => {
                                    alert('Succefully saved');     
                                    this.setState({
                                      currentScheduleItem: {},
                                      isEditingSchedules: false,
                                      loading: false,
                                    })
                                  })
                                  .catch(err => {
                                    this.setState({
                                      currentScheduleItem: {},
                                      isEditingSchedules: false,
                                      loading: false,
                                    })
                                  })
                                })
                              }}
                            >
                              Save
                            </button>
                            <button
                              style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                              className="btn btn-default"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ isEditingSchedules: false })
                              }}
                            >
                              Cancel
                            </button>
                        </form>
                      </div>
                  </div>
              </div>
          }
          <div className="col-md-12">
              <div className="card">
                  <div className="card-header card-header-icon" data-background-color="lightblue">
                      <i className="material-icons">assignment</i>
                  </div>
                  <div className="card-content">
                      <h4 className="card-title">Schedule</h4>
                      <div className="toolbar"></div>
                      <div className="material-datatables">
                        <table className="table datatable table-striped table-no-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Venue Open</th>
                              <th>Venue Closed</th>
                              <th>Venue Day</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.createTableSchedules(this.state.venue.schedules)}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>Venue Open</th>
                              <th>Venue Closed</th>
                              <th>Venue Day</th>
                              <th>Actions</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                  </div>
              </div>
          </div>
          {
            this.state.isteamMemberEditing &&
              <div className="col-md-12">
                  <div className="card">
                      <div className="card-header card-header-icon" data-background-color="lightblue">
                          <i className="material-icons">assignment</i>
                      </div>
                      <div className="card-content">
                        <form className="form-horizontal">
                            <h4 className="card-title">Edit Team member</h4>
                            <div className="row">
                            <label className="col-sm-3 label-on-left">Team Member Name</label>
                            <div className="col-sm-8">
                              <div className="form-group label-floating is-empty">
                                <label className="control-label" />
                                <input
                                  name="name"
                                  type="text"
                                  className={"form-control"}
                                  value={this.state.currentTeamMemberItem.name}
                                  onChange={this.onChangeTeamMember}
                                />
                              </div>
                            </div>
                            <label className="col-sm-3 label-on-left">Venue service for</label>
                            <div className="col-sm-8">
                              <label className="control-label"></label>
                              <select
                                className={"form-control"}
                                value={this.state.currentTeamMemberItem.gender}
                                name="gender"
                                onChange={this.onChangeTeamMember}
                              >
                                <option value={'male'}>Male</option>
                                <option value={'female'}>Female</option>
                              </select>
                            </div>
                            {
                              this.state.isEditingMemberSchedule &&
                              <div className="col-sm-12">
                                <div className="card">
                                  <div className="card-header card-header-icon" data-background-color="blue">
                                    <i className="material-icons">assignment</i>
                                  </div>
                                  <div className="card-content">
                                    <form className="form-horizontal">
                                      <h4 className="card-title">Edit Team Members Schedules</h4>
                                      <div className="toolbar"></div>
                                      <div className="row">
                                      <label className="col-sm-3 label-on-left">Team Member Available From</label>
                                      <div className="col-sm-8">
                                          <label className="control-label"></label>
                                          <select
                                            className={"form-control"}
                                            value={this.state.currentTeamMemberScheduleItem.open}
                                            name="open"
                                            onChange={this.selectOnchangeTeamMemberEditSchedule}
                                          >
                                            {this.optionTimeLooped('times')}
                                          </select>
                                      </div>
                                      <label className="col-sm-3 label-on-left">Team Member Available To</label>
                                      <div className="col-sm-8">
                                          <label className="control-label"></label>
                                          <select
                                            className={"form-control"}
                                            value={this.state.currentTeamMemberScheduleItem.close}
                                            name="close"
                                            onChange={this.selectOnchangeTeamMemberEditSchedule}
                                          >
                                            {this.optionTimeLooped('times')}
                                          </select>
                                      </div>
                                      <label className="col-sm-3 label-on-left">Team Member Available Day</label>
                                      <div className="col-sm-8">
                                          <label className="control-label"></label>
                                          <select
                                            className={"form-control"}
                                            value={this.state.currentTeamMemberScheduleItem.day}
                                            name="day"
                                            onChange={this.selectOnchangeTeamMemberEditSchedule}
                                          >
                                            {this.optionTimeLooped('days')}
                                          </select>
                                      </div>
                                      </div>
                                    </form>
                                    <button
                                      style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                                      className="btn btn-warning"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const { currentTeamMemberScheduleItem, currentTeamMemberItem, teamMemberScheduleIndex } = this.state;
                                        
                                        currentTeamMemberItem.availability[teamMemberScheduleIndex].open = currentTeamMemberScheduleItem.open;
                                        currentTeamMemberItem.availability[teamMemberScheduleIndex].close = currentTeamMemberScheduleItem.close;
                                        currentTeamMemberItem.availability[teamMemberScheduleIndex].day = currentTeamMemberScheduleItem.day;
                                        const db = firebase.app.firestore();
                                        db.collection('teamMembers').doc(this.state.currentTeamMemberItem.id).update(this.state.currentTeamMemberItem)
                                        .then(success => {
                                          this.setState({
                                            isEditingMemberSchedule: false
                                          })
                                        })
                                        .catch(error => {
                                          this.setState({
                                            isEditingMemberSchedule: false
                                          })
                                        })
                                      }}
                                    >
                                      Set
                                    </button>
                                  </div>
                                </div>
                              </div>
                            }
                            <div className="col-sm-12">
                            <div className="card">
                            <div className="card-header card-header-icon" data-background-color="blue">
                              <i className="material-icons">assignment</i>
                            </div>
                            <div className="card-content">
                            <h4 className="card-title">Team Members Schedules</h4>
                              <div className="toolbar"></div>
                              <div className="material-datatables">
                                <table className="table datatable table-striped table-no-bordered table-hover">
                                  <thead>
                                    <tr>
                                      <th>Team Member Available From</th>
                                      <th>Team Member Available To</th>
                                      <th>Team Member Available Day</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.createTeamMemberSchedules()}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <th>Team Member Available From</th>
                                      <th>Team Member Available To</th>
                                      <th>Team Member Available Day</th>
                                      <th>Actions</th>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            <button
                              style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                              className="btn btn-warning"
                              onClick={(e) => {
                                e.preventDefault();
                                const db = firebase.app.firestore();
                                db.collection('teamMembers').doc(this.state.currentTeamMemberItem.id).update(this.state.currentTeamMemberItem)
                                .then(success => {
                                  this.setState({
                                    isteamMemberEditing: false
                                  })
                                })
                                .catch(error => {
                                  this.setState({
                                    isteamMemberEditing: false
                                  })
                                })
                                // this.state.currentTeamMemberItem
                                // this.setState({ isteamMemberEditing: false })
                              }}
                            >
                              Save
                            </button>
                            <button
                              style={{ margin: '20px', float: 'right', borderRadius: '30px' }}
                              className="btn btn-default"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ isteamMemberEditing: false })
                              }}
                            >
                              Cancel
                            </button>
                        </form>
                      </div>
                  </div>
                </div>
          }
          <div className="col-md-12">
              <div className="card">
                  <div className="card-header card-header-icon" data-background-color="lightblue">
                      <i className="material-icons">assignment</i>
                  </div>
                  <div className="card-content">
                      <h4 className="card-title">Team Members</h4>
                      <div className="toolbar"></div>
                      <div className="material-datatables">
                        <table className="table datatable table-striped table-no-bordered table-hover">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Team Member Name</th>
                              <th>Team Member Gender</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.createTableTeamMembers()}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>ID</th>
                              <th>Team Member Name</th>
                              <th>Team Member Gender</th>
                              <th>Actions</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                  </div>
              </div>
          </div>

          <div className="col-md-12">
              <div className="card">
                  <div className="card-header card-header-icon" data-background-color="lightblue">
                      <i className="material-icons">assignment</i>
                  </div>
                  <div className="card-content">
                      <h4 className="card-title">Reviews</h4>
                      <div className="toolbar"></div>
                      <div className="material-datatables">
                        <table className="table datatable table-striped table-no-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Rating</th>
                              <th>Feedback</th>
                              {/* <th>Image</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.createTableReviews()}
                          </tbody>
                          <tfoot>
                          <tr>
                              <th>Name</th>
                              <th>Rating</th>
                              <th>Feedback</th>
                              {/* <th>Image</th> */}
                              <th>Action</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
