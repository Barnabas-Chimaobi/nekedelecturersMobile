import React, {Component} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  AsyncStorage,
  TouchableWithoutFeedback,
  DrawerLayoutAndroid,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../dashboard/menu';
import API from '../../../global';

export default class AllocatedCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allocated: [],
      courseId: '',
    };
  }

  componentDidMount() {
    this.fetchedAllocatedCourses();
    // this.getAssignment();
  }

  fetchedAllocatedCourses = async () => {
    const getCourseDetails = await AsyncStorage.getItem('courseDetails');
    const parsedCourseDetails = await JSON.parse(getCourseDetails);
    console.log(parsedCourseDetails, 'PARSEDCOURSEDETAILS');

    this.setState({
      allocated: parsedCourseDetails,
    });

    const Id = await this.state.allocated.map((item) => {
      return item.allocId;
    });

    const listAssignment = await fetch(
      `${API.BASE_URL}/AssignmentViewContent?courseId=${Id}`,
    );
    const listOfAssignments = await listAssignment.json();
    console.log(listOfAssignments, 'LISTOFASSIGNMENTS');
    AsyncStorage.setItem('allAssignments', JSON.stringify(listOfAssignments));
    // console.log(Id, 'IDDDDDDDDDDD');
    this.setState({
      courseId: Id,
    });
  };

  // getAssignment = async () => {
  //   const listAssignment = await fetch(
  //     `http://10.211.55.11:3000/api/E_LearningLMobile/AssignmentViewContent?courseId=${this.state.courseId}`,
  //   );
  //   const listOfAssignments = await listAssignment.json();
  //   console.log(listOfAssignments, 'LISTOFASSIGNMENTS');
  //   AsyncStorage.setItem('allAssignments', JSON.stringify(listOfAssignments));
  //   // this.props.navigation.navigate('GivenAssignments');
  // };

  // remapp = (assignmentId) => {
  //   console.log('ASSIGN ID: ', assignmentId);
  //   const newObject = this.state.CourseId.map((item) => {
  //     return {
  //       Id: item.Id,
  //       instruction1: item.Instructions,
  //       Text: item.AssignmentinText,
  //       Url: item.URL,
  //       Semester: item.Semester,
  //       DateSet: item.DateSet,
  //       DueDate: item.DueDate,
  //       Assignment: item.Assignment,
  //       CourseName: item.CourseName,
  //       CourseCode: item.CourseCode,
  //     };
  //   });

  //   const {state, setParams, navigate} = this.props.navigation;
  //   const params = state.params || {};

  //   this.setState({modalVisible: false});

  //   const selectedAsignment = newObject.find((as) => as.Id === assignmentId);

  //   console.log(selectedAsignment, ':ASDDDDDDD');
  //   this.setState({assignment: selectedAsignment});
  //   console.log(this.state.assignment, ':ASSIGNMT');
  //   this.props.navigation.navigate('ViewAssignment', {
  //     finds: selectedAsignment,
  //     PersonDetails: params.PersonDetails,
  //   });
  // };

  // renderBtnConditionally(item) {
  //   const {state, setParams, navigate} = this.props.navigation;
  //   const params = state.params || {};
  //   return this.state.modalVisible ? (
  //     <View
  //       style={{
  //         height: 60,
  //         width: 120,
  //         borderWidth: 0.5,
  //         backgroundColor: 'white',
  //         borderColor: 'gray',
  //         marginLeft: -95,
  //         paddingTop: 10,
  //         marginTop: -50,
  //         elevation: 5,
  //         paddingLeft: 5,
  //       }}>
  //       <TouchableWithoutFeedback
  //         onPress={() => {
  //           this.remapp(item.Id);
  //         }}>
  //         <Text style={{color: 'green'}}>View Assignment</Text>
  //       </TouchableWithoutFeedback>
  //       <TouchableWithoutFeedback
  //         onPress={() => {
  //           this.remapp(item.Id);
  //           this.props.navigation.navigate('SubmitAssignment', {
  //             PersonDetails: params.PersonDetails,
  //             CourseId: this.state.assignment,
  //           });
  //         }}>
  //         <Text style={{color: 'green', paddingTop: 10}}>
  //           Submit Assignment
  //         </Text>
  //       </TouchableWithoutFeedback>
  //     </View>
  //   ) : null;
  // }
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
              onPress={() => this.props.navigation.navigate('Eassignment')}>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    color: 'white',
                    fontSize: 35,
                    marginLeft: -20,
                  }}
                />
                <Text style={styles.eAssignText}>E-Assigment</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerHeaderText}>
              Select to View Assignments
            </Text>
          </View>
          {this.state.allocated.map((item) => {
            return (
              <View style={styles.assignmentContainer}>
                <View style={styles.assignmentNavs}>
                  <View style={styles.courses}>
                    <Text style={styles.text}>{item.Name}</Text>
                    <Text style={styles.text}>{item.Code}</Text>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.props.navigation.navigate('GivenAssignments')
                      }>
                      <Text style={styles.addText}>View</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.props.navigation.navigate('CreateAssignment')
                      }>
                      <Text style={styles.addText}>Add</Text>
                    </TouchableWithoutFeedback>
                  </View>
                  {/* <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('CreateAssignment')
                    }>
                    <View style={styles.createAssignment}>
                      <Text>Create Assignments</Text>
                    </View>
                  </TouchableWithoutFeedback> */}
                </View>
              </View>
            );
          })}
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: '-20%',
    // borderWidth: 0.5,
    height: '83%',
    borderWidth: 0.5,
    // height: '95%',
    borderRadius: 10,
    borderColor: '#42A5F5',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#fff',
  },
  courses: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // margin: 10,
    // borderWidth: 0.5,
    // height: 30,
    // borderTopLeftRadius: 15,
    // borderBottomRightRadius: 15,
    // backgroundColor: '#d1634a',
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
  buttonView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  addText: {
    marginRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1F88E5',
    fontWeight: 'bold',
  },
});
