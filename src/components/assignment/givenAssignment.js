import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Image,
  DrawerLayoutAndroid,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../dashboard/menu';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import {withNavigation} from 'react-navigation';
import API from '../../../global';

export default class GivenAssignments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      showIndicator: false,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.storageFetchAssignments();
  }

  storageFetchAssignments = async () => {
    const getAssignments = await AsyncStorage.getItem('allAssignments');
    const gottenAssignments = await JSON.parse(getAssignments);
    console.log(gottenAssignments, 'GOTTENASSIGNMENTS');

    const mappedAssign = gottenAssignments.Output.map((item) => {
      return item;
    });
    // console.log(mappedAssign, 'MAPPPPPPEDDDD');

    // this.state.assignments.concat(gottenAssignments);
    this.setState({
      assignments: mappedAssign,
      showAlert: false,
    });
    // console.log(this.state.assignments, 'newassignments');
  };

  onButtonPress = () => {
    if (this.state.assignments != null) {
      this.setState({showIndicator: true});
    } else {
      this.setState({showIndicator: false});
    }
    setTimeout(() => {
      this.setState({
        showIndicator: false,
      });
    }, 25000);
  };

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  fetchedAllocatedCourses = async () => {
    const getCourseDetails = await AsyncStorage.getItem('courseDetails');
    const parsedCourseDetails = await JSON.parse(getCourseDetails);
    console.log(parsedCourseDetails, 'PARSEDCOURSEDETAILS');

    this.setState({
      refreshing: true,
    });

    const Id = await parsedCourseDetails.map((item) => {
      return item.allocId;
    });

    const listAssignment = await fetch(
      `${API.BASE_URL}/AssignmentViewContent?courseId=${Id}`,
    );
    const listOfAssignments = await listAssignment.json();
    const mappedAssign = listOfAssignments.Output.map((item) => {
      return item;
    });
    this.setState({
      // courseId: Id,
      refreshing: false,
      assignments: mappedAssign,
    });
    console.log(listOfAssignments, 'LISTOFASSIGNMENTSssss');
    AsyncStorage.setItem('allAssignments', JSON.stringify(listOfAssignments));
    // console.log(Id, 'IDDDDDDDDDDD');
  };

  remapp = async (desc) => {
    const newDesc = this.state.assignments.map((item) => {
      return {
        Id: item.Id,
        assignment: item.Assignment,
        assignmentText: item.AssignmentinText,
        dateSet: item.DateSet,
        dueDate: item.DueDate,
        instructions: item.Instructions,
        publish: item.Publish,
        isDelete: item.IsDelete,
        maxScore: item.MaxScore,
        courseAllocation: item.CourseAllocation,
        course: item.Course,
      };
    });
    const selectedDetail = newDesc.find((a) => a.Id === desc);
    console.log(selectedDetail, 'THIS WAS SELECTED');
    // const newAsync = await AsyncStorage.setItem(
    //   'remappedAssignment',
    //   JSON.stringify(selectedDetail),
    // );
    // console.log(newAsync, 'THis is a new part this assignment');
    this.props.navigation.navigate('EditAssignment', {
      findOne: selectedDetail,
    });
  };

  onRemove = async (id) => {
    const newDesc = this.state.assignments.map((item) => {
      return {
        Id: item.Id,
        assignment: item.Assignment,
        assignmentText: item.AssignmentinText,
        dateSet: item.DateSet,
        dueDate: item.DueDate,
        instructions: item.Instructions,
        publish: item.Publish,
        isDelete: item.IsDelete,
        maxScore: item.MaxScore,
        courseAllocation: item.CourseAllocation,
        course: item.Course,
      };
    });

    const newObject = newDesc.find((a) => a.Id === id);
    console.log(newObject, 'EACHTOPICCCCSSSS');
    // this.props.navigation.navigate('GetTopic');
    const deleteTopic = await fetch(
      `${API.BASE_URL}/DeleteAssignment?Assignment=${newObject.Id}`,
      {
        method: 'PUT',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    );

    const deletedTopic = await deleteTopic.json();
    this.fetchedAllocatedCourses();
    console.log(deletedTopic, 'DELETEDEEEEE');

    // if (deletedTopic.Output === 'Deleted') {
    // this.gettopic();
  };

  getSubmitted = async (id) => {
    // console.log(id, 'IDDDDDDDDssssss')

    const submit = await fetch(
      `${API.BASE_URL}/GetAssignmentSubmission?AssignmentId=${id}`,
    );

    const getSubmits = await submit.json();
    console.log(getSubmits, 'GETTTSUBMITTTEDD');
    console.log(id, 'GETTTSUBMITTTEDD');

    this.setState({
      showIndicator: false,
    });

    AsyncStorage.setItem('allSubmitted', JSON.stringify(getSubmits));
    AsyncStorage.setItem('AssignmentId', JSON.stringify(id));

    this.props.navigation.navigate('GetAssignmentSubmission');
  };

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={260}
        drawerPosition="left"
        renderNavigationView={() => (
          <Menu
            navigation={this.props.navigation}
            closeDrawer={this.closeDrawer}
          />
        )}
        ref={(_drawer) => {
          this.drawer = _drawer;
        }}>
        <View style={styles.Dashboard}>
          <View style={styles.navcontainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate('AllocatedCourses')
              }>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    color: 'white',
                    fontSize: 35,
                    marginLeft: -20,
                  }}
                />
                <Text style={styles.eAssignText}>Assigment List</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container}>
          <Spinner
            color={'blue'}
            //visibility of Overlay Loading Spinner
            visible={this.state.showIndicator}
            //Text with the Spinner
            textContent={'Loading...'}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchedAllocatedCourses}
              />
            }>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}>
                Select to View Assignments
              </Text>
            </View>
            {this.state.assignments.map((item) => {
              const apiDate = new Date(item.DateSet);
              //const apiDate = item.DueDate;

              var hours = apiDate.getHours() - 1;
              var minutes = apiDate.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0' + minutes : minutes;
              var strTime = hours + ':' + minutes + ' ' + ampm;
              let trueTime = `${apiDate.getDate()}/${
                apiDate.getMonth() + 1
              }/${apiDate.getUTCFullYear()} - ${strTime}`;

              const apiDate1 = new Date(item.DueDate);
              //const apiDate = item.DueDate;

              var hours = apiDate1.getHours() - 1;
              var minutes = apiDate1.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0' + minutes : minutes;
              var strTime1 = hours + ':' + minutes + ' ' + ampm;
              let trueTime1 = `${apiDate1.getDate()}/${
                apiDate1.getMonth() + 1
              }/${apiDate1.getUTCFullYear()} - ${strTime1}`;
              return (
                <View style={styles.cardDeatailsMainView}>
                  <View style={styles.cardDeatailsView}>
                    <View style={styles.assignmentView}>
                      <View style={styles.assignmentName}>
                        <Text style={styles.assignment}>
                          {item.Assignment.toUpperCase()}
                        </Text>
                        <View>
                          <View style={styles.time}>
                            <MaterialIcon
                              name="query-builder"
                              color="#42A5F5"
                              style={styles.image}
                            />
                            <Text>{trueTime}</Text>
                          </View>
                          <View style={styles.time}>
                            <MaterialIcon
                              name="date-range"
                              color="#42A5F5"
                              style={styles.image}
                            />
                            <Text>{trueTime1}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View>
                      <ScrollView>
                        <View style={styles.cardTextView}>
                          <View>
                            <TouchableWithoutFeedback
                              onPress={() => {
                                this.getSubmitted(item.Id);
                                this.onButtonPress();
                              }}>
                              <Text style={styles.assignAdjust}>Submitted</Text>
                            </TouchableWithoutFeedback>
                          </View>
                          <View>
                            <TouchableWithoutFeedback
                              onPress={() => this.remapp(item.Id)}>
                              <Image
                                style={styles.assignAdjust}
                                source={require('../../assets/edit.png')}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                          <View>
                            <TouchableWithoutFeedback
                              onPress={() => this.showAlert()}>
                              <Image
                                style={styles.assignAdjust}
                                source={require('../../assets/deletes.png')}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                          <AwesomeAlert
                            show={this.state.showAlert}
                            showProgress={false}
                            title="Warning"
                            message="Are you sure you want to delete this Assigment?"
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            showConfirmButton={true}
                            cancelText="No, cancel"
                            confirmText="Ok"
                            confirmButtonColor="#DD6B55"
                            onCancelPressed={() => {
                              this.hideAlert();
                            }}
                            onConfirmPressed={() => {
                              this.hideAlert();
                              this.onRemove(item.Id);
                            }}
                          />
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  // border: {
  //   borderBottomWidth: 0.5,
  //   borderColor: '#0982B8',
  //   marginTop: 10,
  // },
  // container: {
  //   margin: 5,
  // },
  assignment: {
    // fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
    fontFamily: 'Comfortaa-VariableFont_wght',
    fontSize: 12,
  },

  container: {
    // backgroundColor: 'white',
    marginTop: '-20%',
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  cardDeatailsMainView: {
    overflow: 'hidden',
    paddingBottom: 10,
  },
  cardDeatailsView: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    // paddingTop: 30,
    // paddingBottom: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 10,
    height: 100,
    // width: '30%',
  },
  cardTextView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginTop: 35,
    // width: '70%',
  },

  assignmentName: {
    backgroundColor: '#E3F2FD',
    height: 50,
    flex: 1,
    // width: '10%',
  },
  assignmentView: {
    width: '50%',
  },
  assignAdjust: {
    marginRight: 10,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  assignmentContainer: {
    // height: '25%',
    overflow: 'hidden',
    paddingBottom: 20,
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
    paddingTop: 15,
    // color: 'white',
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  Dashboard: {
    height: '25%',
    backgroundColor: '#42A5F5',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  dashboardText: {
    textAlign: 'center',
    marginTop: '15%',
    fontSize: 18,
    fontFamily: 'Comfortaa-VariableFont_wght',
    color: 'white',
  },
  navcontainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
  },
  navTab: {
    display: 'flex',
    flexDirection: 'row',
  },
  eAssignText: {
    marginTop: 5,
    marginLeft: 10,
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  pickerHeader: {
    height: 40,
    backgroundColor: '#1F88E5',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    // marginBottom: 50,
  },
  pickerHeaderText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  assignmentNavs: {
    backgroundColor: '#fff',
    // shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 15,
    padding: 10,
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
  },
  image: {
    margin: 5,
  },
});
