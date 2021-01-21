import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  AsyncStorage,
  DrawerLayoutAndroid,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Menu from '../dashboard/menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../../global'

// import {AsyncStorage} from 'AsyncStorage';

export default class Eassignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionList: [' Session'],
      newSessionList: null,
      currentSession: '',
      level: [' Level'],
      newLevelList: null,
      currentlevel: '',
      semesters: [' Semester', 'First Semester', 'Second Semester'],
      currentSemester: '',
      userId: '',
      levelId: '',
      sessionId: '',
      semesterId: '',
      showIndiactor: false,
    };
  }

  componentDidMount() {
    this.selectSession();
    this.selectLevel();
    this.asyncGetItem();
  }

  onButtonPress = () => {
    if (this.state.userId != '' && this.state.sessionId != '') {
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

  asyncGetItem = async () => {
    const value = await AsyncStorage.getItem('personDetails');
    const newValue = JSON.parse(value);
    this.setState({
      userId: newValue.Id,
    });
    console.log(this.state.userId, 'USERIDDDDD');
    console.log(newValue, 'VALUEEEEEEEEESSS');
  };

  selectSession = async () => {
    const getSession = await fetch(
      `${API.BASE_URL}/AllSession`,
    );
    const retrievedSession = await getSession.json();
    // console.log(retrievedSession.OutPut.Name, 'SESSIONSSSS');

    const arr = retrievedSession.OutPut.map((item) => {
      return item.Name;
    });
    // console.log(arr, 'Newwwwww');
    // this.setState(() => {
    //   this.state.sessionList = arr;
    // });

    const newArray = this.state.sessionList.concat(arr);
    // console.log(newArray, 'newarray');
    this.setState({
      newSessionList: newArray,
    });
    console.log(this.state.newSessionList, 'newarrayssssss');

    // console.log(this.state.sessionList, 'newSessionList');
  };

  selectLevel = async () => {
    const level = await fetch(
      `${API.BASE_URL}/GetAllLevel`,
    );
    const jsonLevel = await level.json();
    // console.log(jsonLevel, 'jsooSemester');
    const mapLevel = jsonLevel.Output.map((item) => {
      return item.Name;
    });
    // console.log(mapLevel, 'MapPSemester');
    const newLevel = this.state.level.concat(mapLevel);
    // console.log(newLevel, 'NEWLEVEL');
    this.setState({
      newLevelList: newLevel,
    });
    // console.log(this.state.newLevelList);
  };

  pickerSelectSession = () => {
    if (this.state.newSessionList !== null) {
      return this.state.newSessionList.map((y, z) => {
        return <Picker.Item label={y} value={z} key={z} />;
      });
    }
  };

  pickerSelectLevel = () => {
    if (this.state.newLevelList !== null) {
      return this.state.newLevelList.map((y, z) => {
        return <Picker.Item label={y} value={z} key={z} />;
      });
    }
  };

  pickerSelectSemester = () => {
    if (this.state.semesters !== null) {
      return this.state.semesters.map((y, z) => {
        return <Picker.Item label={y} value={z} key={z} />;
      });
    }
  };

  getAllocatedCourses = async () => {
    if (
      this.state.userId != '' &&
      this.state.levelId != '' &&
      this.state.sessionId != '' &&
      this.state.semesterId != ''
    ) {
      const allocourses = await fetch(
        `${API.BASE_URL}/GetAllocatedCourses?userId=${this.state.userId}&levelId=${this.state.levelId}&sessionId=${this.state.sessionId}&semesterId=${this.state.semesterId}`,
      );

      const fetchedCourses = await allocourses.json();
      console.log(fetchedCourses, 'FETCHEDDDDDDDDD');

      const courseDetails = fetchedCourses.Output.map((item) => {
        return {
          Code: item.Course.Code,
          Name: item.Course.Name,
          Id: item.Course.Id,
          Department: item.Course.Department.Faculty.Name,
          Programme: item.Programme.Name,
          allocId: item.Id,
        };
      });
      console.log(courseDetails, 'COURSEDETAOLSSSSSSS');

      this.setState({
        showIndicator: false,
      });

      AsyncStorage.setItem('courseDetails', JSON.stringify(courseDetails));

      this.props.navigation.navigate('AllocatedCourses');
    } else {
      alert('please select all the fields');
    }
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
              onPress={() => this.props.navigation.navigate('Dashboard')}>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    color: 'white',
                    fontSize: 35,
                    marginLeft: -20,
                  }}
                />
                <Text style={styles.eAssignText}>E-Assignment</Text>
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
            textContent={'Logging in...'}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerHeaderText}>Select to proceed</Text>
          </View>
          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.sessionId}
              // style={{height: 50, width: 100}}
              onValueChange={(itemValue) =>
                this.setState({sessionId: itemValue})
              }>
              {this.pickerSelectSession()}
            </Picker>
          </View>

          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.semesterId}
              // style={{height: 50, width: 100}}
              onValueChange={(itemValue) => {
                this.setState({semesterId: itemValue});
                console.log(itemValue);
              }}>
              {this.pickerSelectSemester()}
            </Picker>
          </View>

          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.levelId}
              // style={{height: 50, width: 100}}
              onValueChange={(itemValue) => {
                this.setState({levelId: itemValue});
                console.log(itemValue);
              }}>
              {this.pickerSelectLevel()}
            </Picker>
          </View>

          <View style={styles.button}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.getAllocatedCourses();
                this.onButtonPress();
              }}>
              <Text style={styles.text}>Enter</Text>
            </TouchableWithoutFeedback>
          </View>
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
    width: '88%',
    margin: 5,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 0.5,
    borderColor: '#BDBDBD',
    margin: 10,
    height: 45,
    paddingTop: -30,
    borderRadius: 15,
    backgroundColor: '#fff',
    marginBottom: 30,
  },

  button: {
    // borderWidth: 0.5,
    marginTop: 60,
    marginLeft: 15,
    marginRight: 15,
    height: 50,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: '#42A5F5',
  },
  text: {
    textAlign: 'center',
    paddingTop: 15,
    color: 'white',
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
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // marginBottom: 50,
  },
  pickerHeaderText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
});
