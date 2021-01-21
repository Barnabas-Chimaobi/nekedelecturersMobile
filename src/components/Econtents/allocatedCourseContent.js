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

export default class AllocatedCourseContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allocated: [],
      courseId: '',
      Id: '',
      usersId: '',
    };
  }

  componentDidMount() {
    this.fetchedAllocatedCourses();
  }

  fetchedAllocatedCourses = async () => {
    const getCourseDetails = await AsyncStorage.getItem('courseDetails');
    const parsedCourseDetails = await JSON.parse(getCourseDetails);
    console.log(parsedCourseDetails, 'PARSEDCOURSEDETAILS');

    this.setState({
      allocated: parsedCourseDetails,
    });

    const Id = this.state.allocated.map((item) => {
      return item.allocId;
    });

    const courseId = this.state.allocated.map((item) => {
      return item.Id;
    });
    console.log(Id, 'IDDDDDDDDDDD');
    this.setState({
      courseId: Id,
      Id: courseId,
    });

    const personId = await AsyncStorage.getItem('personDetails');
    const gottenPersonId = await JSON.parse(personId);
    this.setState({
      usersId: gottenPersonId.Id,
    });
  };

  cred = () => {
    this.props.navigation.navigate('Chat', {
      cAllocId: this.state.courseId,
      uId: this.state.usersId,
    });
  };

  getAssignment = async () => {
    const listAssignment = await fetch(
      `${API.BASE_URL}/AssignmentViewContent?courseId=${this.state.courseId}`,
    );
    const listOfAssignments = await listAssignment.json();
    console.log(listOfAssignments, 'LISTOFASSIGNMENTS');
    AsyncStorage.setItem('allAssignments', JSON.stringify(listOfAssignments));
    this.props.navigation.navigate('AddContent');
  };

  getContent = async () => {
    const allContents = await fetch(
      `${API.BASE_URL}/GetCourseContents?Id=${this.state.Id}`,
    );
    const fetchedContents = await allContents.json();
    console.log(fetchedContents, 'FTECHED CONTENTS');
    AsyncStorage.setItem('courseContents', JSON.stringify(fetchedContents));
    this.props.navigation.navigate('GetContent');
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
              onPress={() => this.props.navigation.navigate('EContent')}>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    color: 'white',
                    fontSize: 35,
                    marginLeft: -20,
                  }}
                />
                <Text style={styles.eAssignText}>E-Contents</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container1}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerHeaderText}>View or Add Contents</Text>
          </View>
          {this.state.allocated.map((item) => {
            return (
              <View style={styles.assignmentContainer}>
                <View style={styles.assignmentNavs}>
                  <View style={styles.courses1}>
                    <Text style={styles.text}>{item.Name}</Text>
                    <Text style={styles.text}>{item.Code}</Text>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableWithoutFeedback onPress={() => this.getContent()}>
                      <Text style={styles.addText}>View</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => this.getAssignment()}>
                      <Text style={styles.addText}>Add</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.cred()}>
                      <Text style={styles.addText}>Chat Room</Text>
                    </TouchableWithoutFeedback>
                  </View>
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
  container1: {
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
  courses1: {
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
    // marginTop: 10,
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
