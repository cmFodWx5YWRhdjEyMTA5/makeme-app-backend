import React, { Component, PropTypes } from 'react'
import Config from '../../config/app';
import firebase from '../../config/database';
import Common from '../../common.js'
import { Link } from 'react-router'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import SkyLight from 'react-skylight';
import moment from 'moment';
import axios from 'axios';

const ConditionalWrap = ({ condition, wrap, children }) => condition ? wrap(children) : children;
const ConditionalDisplay = ({ condition, children }) => condition ? children : <div></div>;
const SortableItem = SortableElement(({ children }) => children);
const SortableTable = SortableContainer(({ items, creator }) => {
  return (
    <tbody>
      {
        items ?
          items.map((item, index) => {
            return (
              <SortableItem key={`item-${index}`} index={index} >
                {creator(item, index)}
              </SortableItem>
            );
          })
          :
          ""
      }
    </tbody>
  );
});
const NormalTable = (({ items, creator }) => {
  return (
    <tbody>
      {
        items ?
          items.map((item, index) => {
            return creator(item, index);
          })
          :
          ""
      }
    </tbody>
  );
});


class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: this.props.headers,
      data: this.props.data,
      originalData: this.props.data,
      filter: "",
      currentTab: this.props.name,
      currentData: null,
      actionButtons: this.props.actionButtons,
      venues: this.props.venues,
    };
    this.createTableRow = this.createTableRow.bind(this);
    this.deleteAction = this.deleteAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectOnchangeStatus = this.selectOnchangeStatus.bind(this);
  }

  /**
  * componentDidMount event of React, fires when component is mounted and ready to display
  * Start connection to firebase
  */
  componentDidMount() {
    // if (this.props.name === 'teamMembers') {
    //   this.getVenueDetails()
    // }
    if (this.props.headers && this.props.headers.length > 0) {
      //We already know who are our headers,preset
    } else {
      //Loop throught all items ( in data ) to find our headers
      var headers = []
      var headersCounter = {};
      for (var i = 0; i < this.state.data.length; i++) {

        //The type of our array items
        var parrentType = Common.getClass(this.state.data);
        var type = Common.getClass(this.state.data[i]);

        //OBJECTS INSIDE
        if (type == "Object") {
          //In CASE we have OBJECT as array items
          for (var key in this.state.data[i]) {
            // skip loop if the property is from prototype
            if (!this.state.data[i].hasOwnProperty(key)) continue;

            var obj = this.state.data[i][key];
            var objType = Common.getClass(obj);

            //Consider onyl String, Bool, Number
            if ((objType === "String" || objType === "Boolean" || objType === "Number") && key != "uidOfFirebase") {
              if (headersCounter[key]) {
                headersCounter[key]++
              } else {
                headersCounter[key] = 1;
              }
            }
          }
        }

        //STRING INSIDE
        else if (type == "String") {
          headers = ["Value"];
          headersCounter["Value"] = 1;
          break;
        }
      }
      //END looking for headers

      var numHeadersCounter = 0;
      for (var key in headersCounter) {
        numHeadersCounter++;
      }

      //ARRAYS INSIDE
      if (numHeadersCounter == 0) {
        headers = ["Items"];
        headersCounter["Items"] = 1;
        type = "ArtificialArray"; //Artificial
      }

      //Now we have the headers, with their number of occurences
      //Convert object to array
      var headersCounterAsArray = [];
      for (var key in headersCounter) {
        headersCounterAsArray.push({ key: key, counter: headersCounter[key] })
      }

      headersCounterAsArray.sort(function (b, a) {
        return parseFloat(a.counter) - parseFloat(b.counter);
      });

      //Pick headers based on their number of appereances 2
      headers = [];
      for (var k = 0; k < headersCounterAsArray.length && k < Config.adminConfig.maxNumberOfTableHeaders; k++) {
        headers.push(headersCounterAsArray[k].key)
      }

      //Update the state

      this.setState({ headers: headers, type: type })
    }


  }

  updateData(id) {
    const db = firebase.app.firestore();
    db.collection(this.state.currentTab).doc(id).update(this.currentData)
      .then((res) => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
      })
  }

  deleteAction(index, theLink) {
    if (this.props.isFirestoreSubArray) {
      this.props.deleteFieldAction(index, true, theLink);
    } else {
      this.props.deleteFieldAction(index, true);
    }

  }

  createEditButton(theLink) {
    if (this.props.isFirestoreSubArray) {
      return (
        <a
          onClick={() => {
            this.props.showSubItems(theLink)
          }}
        >
          <span className="btn btn-simple btn-danger btn-icon edit">
            <i className="material-icons">mode edit</i>
          </span>
        </a>
      );
    } else {
      return (
        <Link to={theLink}>
          <span className="btn btn-simple btn-warning btn-icon edit">
            <i className="material-icons">mode edit</i>
          </span>
        </Link>
      )
    }
  }

  editItem(theLink) {
    if (this.props.isFirestoreSubArray) {
      return (<div style={{ padding: '20px' }} />);
    } else {
      return (
        <Link to={theLink}>
          <button
            className="btn"
            style={{ backgroundColor: '#00BED9' }}
          >
            View
          </button>
        </Link>
      )
    }
  }

  // getVenueDetails(id) {
  //   const db = firebase.app.firestore();
  //   db.collection('venues').get()
  //   .then((res) => {
  //     const venues= [];
  //     res.forEach(item => {
  //       let data = item.data();
  //       data.id = item.id;
  //       venues.push(data);
  //     });
  //     this.setState({ venues });
  //   })
  // }

  getVenueName(venueId) {
    const venue = this.state.venues.find(i => i.id === venueId);
    return venue.name;
  }

  selectOnchangeStatus(e) {
    const { name, value } = e.target;
    const db = firebase.app.firestore();
    console.log(name, value);
    console.log(this.state);
    // db.collection('venues').doc(id).update({ [name]: value })
    //   .then((res) => {
    //     console.log('SUCCESS !!', res);
    //   })
    // this.setState({
    //   venue: {
    //     ...this.state.venue,
    //     [e.target.name]: e.target.value,
    //   }
    // })
  }

  createTableRow(item, index) {
    var theLink = this.props.routerPath.replace(":sub", "") + this.props.sub;
    if (this.props.isFirestoreSubArray) {
      if (this.props.fromObjectInArray) {
        theLink += Config.adminConfig.urlSeparatorFirestoreSubArray + item.uidOfFirebase;
      } else {
        if (this.props.isJustArray) {
          theLink += Config.adminConfig.urlSeparatorFirestoreSubArray + index;
        } else {
          theLink += Config.adminConfig.urlSeparatorFirestoreSubArray + this.props.name + Config.adminConfig.urlSeparatorFirestoreSubArray + index;
        }
      }
    } else {
      if (this.props.fromObjectInArray) {
        theLink += Config.adminConfig.urlSeparator + item.uidOfFirebase;
      } else {
        if (this.props.isJustArray) {
          theLink += Config.adminConfig.urlSeparator + index;
        } else {
          theLink += Config.adminConfig.urlSeparator + this.props.name + Config.adminConfig.urlSeparator + index;
        }
      }
    }
    return (
      <tr>
        {
          this.state.headers ?
            this.state.headers.map((key, subindex) => {
              if (Config.adminConfig.fieldsTypes.photo.indexOf(key) > -1 || this.state.currentTab === 'profileImages') {
                //This is photo
                if (this.state.currentTab === 'profileImages') {
                  return (
                    <td>
                      <div className="tableImageDiv" >
                        <img className="tableImage" src={item} style={{ borderRadius: '20px' }} />
                      </div>
                    </td>
                  )
                } else {
                  return (
                    <td>
                      <div className="tableImageDiv" >
                        <img className="tableImage" src={item[key]} style={{ borderRadius: '40px', height: '80px', width: '80px' }} />
                      </div>
                    </td>
                  )
                }
              } else {
                //Normal value
                //But can be string
                if (this.state.type == "String") {
                  return subindex == 0 ?
                    (
                      <td>
                        {item}
                      </td>
                    )
                    :
                    (
                      <td>
                        {item}
                      </td>
                    )
                }
                if (this.state.type == "ArtificialArray") {
                  if (Config.adminConfig.showItemIDs) {
                    return subindex == 0 ?
                      (
                        <td>
                          {this.state.data[subindex].uidOfFirebase}
                        </td>
                      )
                      :
                      (
                        <td>
                          {this.state.data[subindex].uidOfFirebase}
                        </td>
                      )
                  } else {
                    return subindex == 0 ?
                      (
                        <td>
                          {"Item " + (index + 1)}
                        </td>
                      )
                      :
                      (
                        <td>
                          {"Item " + (index + 1)}
                        </td>
                      )
                  }
                } else {
                  return subindex == 0 ?
                    (
                      <td>
                        {item[key]}
                      </td>
                    )
                    :
                    (
                      <td>
                        {item[key]}
                      </td>
                    )
                }

              }
            })
            :
            ""
        }
        {
          this.state.currentTab === 'teamMembers' &&
          <td className="text-right">
            <p>{this.getVenueName(item.venueId)}</p>
          </td>
        }
        {
          this.state.currentTab === 'users' &&
          <td className="text-right">
            <button
              onClick={() => {
                const id = item.uidOfFirebase;
                let { data } = this.state;

                const result = data.findIndex(i => i.uidOfFirebase === id);
                const db = firebase.app.firestore();
                db.collection('users').doc(id).update({ enabled: !data[result].enabled })
                  .then((res) => {
                    data[result].enabled = !data[result].enabled;
                    this.setState({
                      data: data,
                    });
                  })
              }}
              className={item.enabled ? 'btn btn-success' : 'btn btn-default'}
              style={{
                borderRadius: '30px'
              }}
            >
              {item.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </td>
        }
        {
          this.state.currentTab === 'venues' &&
          <td className="text-right">
            <select
              style={{ height: '50px', width: '200px', justifyContent: 'center', borderWidth: 0, borderStyle: 'none' }}
              className={"form-control"}
              value={item.status}
              name="status"
              onChange={(e) => {
                const { name, value } = e.target;
                const db = firebase.app.firestore();
                let venue = this.state.data;
                if(venue[index].status === 'pending' && value.toString() === 'accepted') {
                  db.collection('users').get().then(users => {
                    users.forEach(item => {
                      const { firstName } = item.data();
                      const message = {
                        hasRead: false,
                        notificationType: 'user',
                        type: 'newVenue',
                        "userId": item.id,
                        createdAt: moment().format('LLL'),
                        venueName: venue[index].name,
                        "message": `Hi ${firstName} new venue ${venue[index].name} is now available for booking check the app to book their services.`
                      };

                      db.collection('notifications').add(message).then(ref => {
                        
                      }).catch((err) => {
                        console.log('error')
                      })
                      
                    });
                  }).catch(error => {
                    console.log('error fetching users', error);
                  })
                } else {
                  console.log('dont send please');
                }

                
                venue[index].status = value.toString();
                this.setState({
                  data: venue,
                }, () => {
                  db.collection('venues').doc(item.uidOfFirebase).update({ status: value.toString() })
                    .then((res) => {
                      console.log('res', res);
                    })
                    .catch(err => {
                      console.log('err', err);
                    })
                })
                if (value === "accepted") {
                  try {
                    db.collection("users").doc(venue[index].ownerId).get().then(function (doc) {
                      if (doc.exists) {
                        const data = {
                          "from": "motqin3@gmail.com",
                          "to": doc.data().email,
                          "subject": "Welcome to Makeme",
                          "template": 'businessOwner',
                          "context": {
                            "name": doc.data().firstName
                          }
                        };
                        axios.post('https://udcdp1ycue.execute-api.us-east-1.amazonaws.com/dev/mail/send', data).then(function (res) {
                          console.log(`SUCCEFULLY SENT EMAIL TO ${doc.data().email}`)
                        }).catch(err => {
                          console.log(`UNSUCCEFULLY SENT EMAIL TO ${doc.data().email}`)
                        });
                        console.log("Document data:", doc.data());
                      } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                      }
                    })
                  }
                  catch (err) {
                    console.log(err)
                  }
                }
              }}
            >
              <option value={'disabled'}>Disabled</option>
              <option value={'accepted'}>Accepted</option>
              <option value={'rejected'}>Rejected</option>
            </select>
          </td>
        }
        {
          !this.props.isFirestoreSubArray && this.state.currentTab !== 'venues' ?
            <td className="text-right">
              <Link to={theLink}>
                <button
                  className="btn"
                  style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
                >
                  View
                </button>
              </Link>
            </td>
            :
            <td className="text-right">
              <Link to={`editVenue/${item.uidOfFirebase}`}>
                <button
                  onClick={() => {
                    console.log('SFDS', item);
                  }}
                  className="btn"
                  style={{ backgroundColor: '#00BED9', borderRadius: '30px' }}
                >
                  View
                </button>
              </Link>
            </td>
        }
        {
          this.state.currentTab === 'profileImages' &&
          <td className="text-right">
            <button
              className="btn"
              style={{ backgroundColor: 'tomato', borderRadius: '30px' }}
            >
              Remove
                </button>
          </td>
        }
      </tr>)
  }

  handleChange(event) {
    this.setState({ filter: event.target.value });
    if (event.target.value.length == 0) {
      //Reset
      this.setState({ data: this.state.originalData });
    } else {
      //Do the filtering
      //Go throught the fields
      var itemToShow = [];
      this.state.originalData.map((item, index) => {
        var stringRepresnetation = JSON.stringify(item);
        if (stringRepresnetation.indexOf(event.target.value) != -1) {
          itemToShow.push(item);
        }
      })
      this.setState({ data: itemToShow });
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    var modifiedData = arrayMove(this.state.data, oldIndex, newIndex);
    this.setState({
      data: modifiedData,
    });
    this.props.updateAction("DIRECT_VALUE_OF_CURRENT_PATH", modifiedData, false);
  };

  venuesLayout() {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Name" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Description" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Service for" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Services Offers" />
          </div>
        </div>
      </div>
    )
  }

  usersLayout() {
    const { currentData } = this.state;
    console.log('CURRENT', currentData);
    if (currentData) {
      return (
        <div style={{ padding: '20px' }}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label style={{ fontSize: '25px', fontWeight: '600' }}>Email address</label>
                <input style={{ fontSize: '20px', fontWeight: '500' }} type="text" className="form-control" placeholder="Email" value={currentData.email} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label style={{ fontSize: '25px', fontWeight: '600' }}>First name</label>
                <input
                  style={{ fontSize: '20px', fontWeight: '500' }}
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  value={currentData.firstName}
                  onChange={(e) => {
                    const { currentData } = this.state;
                    const field = e.target.name;
                    const value = e.target.value;
                    this.setState({
                      ...this.state,
                      currentData: {
                        ...currentData,
                        firstName: value
                      }
                    })
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label style={{ fontSize: '25px', fontWeight: '600' }}>Last name</label>
                <input
                  style={{ fontSize: '20px', fontWeight: '500' }}
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  value={currentData.lastName}
                  onChange={(e) => {
                    const { currentData } = this.state;
                    const field = e.target.name;
                    const value = e.target.value;
                    this.setState({
                      ...this.state,
                      currentData: {
                        ...currentData,
                        lastName: value
                      }
                    })
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label style={{ fontSize: '25px', fontWeight: '600' }}>Mobile number</label>
                <input
                  style={{ fontSize: '20px', fontWeight: '500' }}
                  type="number"
                  className="form-control"
                  placeholder="Last name"
                  value={currentData.mobile}
                  onChange={(e) => {
                    const { currentData } = this.state;
                    const field = e.target.name;
                    const value = e.target.value;
                    this.setState({
                      ...this.state,
                      currentData: {
                        ...currentData,
                        mobile: value
                      }
                    })
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label style={{ fontSize: '25px', fontWeight: '600' }}>User type</label>
                <input
                  style={{ fontSize: '20px', fontWeight: '500' }}
                  readOnly={false}
                  type="text"
                  className="form-control"
                  placeholder="User type"
                  value={currentData.userType}

                />
              </div>
            </div>
          </div>
          <button
            style={{ display: 'flex', alignSelf: 'flex-end', float: 'right', backgroundColor: 'tomato', fontSize: '20px' }}
            className="btn"
            onClick={() => {

              this.updateData(currentData.uidOfFirebase)
            }}
          >
            SAVE
        </button>
        </div>
      )
    }
    return <h1>user</h1>
  }

  bookingsLayout() {
    return (
      <div className="row">
        <h1>bookings layout</h1>
      </div>
    )
  }

  render() {
    const { currentTab } = this.state;
    console.log(currentTab, 'hello world', this.state.data);
    return (
      <div>
        <ConditionalDisplay
          condition={Config.adminConfig.showSearchInTables}
        >
          <div className="row">
            <SkyLight
              hideOnOverlayClicked
              ref={ref => this.simpleDialog = ref}
              title={currentTab === 'venues' ? "Venue details" : currentTab === 'users' ? "User details" : "Booking details"}
              dialogStyles={{
                backgroundColor: '#FFFFFF',
                width: '75%',
                height: '500px',
                marginTop: '-300px',
                marginLeft: '-35%',
                padding: '0px',
                borderRadius: '10px'
              }}
              titleStyle={{
                margin: '0px',
                textAlign: 'center',
                backgroundColor: 'lightblue',
                color: 'white',
                fontWeight: 600,
                fontSize: '26px',
                padding: '10px',
                borderTopRightRadius: '10px',
                borderTopLeftRadius: '10px'
              }}
            >
              {currentTab === 'venues' ? this.venuesLayout() : currentTab === 'users' ? this.usersLayout() : this.bookingsLayout()}
            </SkyLight>
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <div className="form-group form-search is-empty">
                <input type="text" className="form-control" placeholder=" Search " value={this.state.filter} onChange={this.handleChange} />
                <span className="material-input"></span>
                <span className="material-input"></span>
              </div>
            </div>
          </div>
        </ConditionalDisplay>
        <table className="table datatable table-striped table-no-bordered table-hover">
          { /* This the part where headers are loop */}
          <thead>
            <tr>
              {
                this.state.headers ?
                  this.state.headers.map((key) => {
                    if (this.state.currentTab === 'bookings') {
                      return (
                        <th>
                          {
                            key === 'invoiceId' ?
                              "Order ID"
                              : key === 'name' && this.state.currentTab === 'bookings' ?
                                "Venue name"
                                : key === 'firstName' && this.state.currentTab === 'bookings' ?
                                  "Client"
                                  :
                                  Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    } else if (this.state.currentTab === 'users') {
                      return (
                        <th>
                          {
                            key === 'firstName' ?
                              "First name"
                              : key === 'lastName' ?
                                "Last name"
                                : key === 'email' ?
                                  "Email address"
                                  : key === 'mobile' ?
                                    "Mobile number"
                                    : key === 'userType' ?
                                      "User type" :
                                      Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    } else if (this.state.currentTab === 'venues') {
                      return (
                        <th>
                          {
                            key === 'venueAddress' ?
                              "Venue address"
                              :
                              key === 'name' ?
                                "Venue name"
                                :
                                Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    } else if (this.state.currentTab === 'profileImages') {
                      return (
                        <th>
                          Images
                          </th>
                      )
                    } else {
                      return (
                        <th>
                          {
                            Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    }
                  })
                  :
                  ""
              }
              {
                this.state.currentTab === 'teamMembers' &&
                <th className="disabled-sorting text-right">Venue</th>
              }
              {
                this.state.currentTab === 'users' &&
                <th className="disabled-sorting text-right">User status</th>
              }
              {
                this.state.currentTab === 'profileImages' &&
                <th className="disabled-sorting text-right">Actions</th>
              }
              {
                this.state.currentTab === 'venues' &&
                <th className="disabled-sorting text-right">Venue Action</th>
              }
              {
                this.state.actionButtons &&
                <th className="disabled-sorting text-right">Actions</th>
              }
            </tr>
          </thead>
          <tfoot>
            <tr>
              {
                this.state.headers ?
                  this.state.headers.map((key) => {
                    if (this.state.currentTab === 'bookings') {
                      return (
                        <th>
                          {
                            key === 'invoiceId' ?
                              "Order ID"
                              : key === 'name' && this.state.currentTab === 'bookings' ?
                                "Venue name"
                                : key === 'firstName' && this.state.currentTab === 'bookings' ?
                                  "Client"
                                  :
                                  Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    } else if (this.state.currentTab === 'users') {
                      return (
                        <th>
                          {
                            key === 'firstName' ?
                              "First name"
                              : key === 'lastName' ?
                                "Last name"
                                : key === 'email' ?
                                  "Email address"
                                  : key === 'mobile' ?
                                    "Mobile number"
                                    : key === 'userType' ?
                                      "User type" :
                                      Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    } else if (this.state.currentTab === 'profileImages') {
                      return (
                        <th>
                          Images
                          </th>
                      )
                    } else {
                      return (
                        <th>
                          {
                            Common.capitalizeFirstLetter(key)
                          }
                        </th>
                      )
                    }
                  })
                  :
                  ""
              }
              {
                this.state.currentTab === 'teamMembers' &&
                <th className="disabled-sorting text-right">Venue</th>
              }
              {
                this.state.currentTab === 'users' &&
                <th className="disabled-sorting text-right">User status</th>
              }
              {
                this.state.currentTab === 'venues' &&
                <th className="disabled-sorting text-right">Venue Action</th>
              }
              {
                this.state.actionButtons &&
                <th className="disabled-sorting text-right">Actions</th>
              }
            </tr>
          </tfoot>
          <ConditionalDisplay condition={Array.isArray(this.state.data) && this.props.caller == "firebase"}>
            <SortableTable pressDelay={200} onSortEnd={this.onSortEnd} items={this.state.data} creator={this.createTableRow} />
          </ConditionalDisplay>
          <ConditionalDisplay condition={!(Array.isArray(this.state.data) && this.props.caller == "firebase")}>
            <NormalTable items={this.state.data} creator={this.createTableRow} />
          </ConditionalDisplay>
        </table>
      </div>
    )
  }
}
export default Table;

Table.propTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  routerPath: PropTypes.string.isRequired,
  isJustArray: PropTypes.bool.isRequired,
  sub: PropTypes.string,
  fromObjectInArray: PropTypes.bool.isRequired,
  deleteFieldAction: PropTypes.func.isRequired,
};
