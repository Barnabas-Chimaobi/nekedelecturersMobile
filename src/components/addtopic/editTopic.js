import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage,
  DrawerLayoutAndroid,
  ScrollView,
} from 'react-native';
import Menu from '../dashboard/menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class EditTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      courseDescription: '',
      startDate: '',
      endDate: '',
      courseAllocationId: '',
      fromTime: '',
      toTime: '',
      Active: true,
      id: '',
    };
  }

  componentDidMount() {
    this.fetchId();
  }

  fetchId = async () => {
    const courseId = await AsyncStorage.getItem('oneTopic');
    const newId = await JSON.parse(courseId);
    console.log(newId, 'DFDFDFDFDD');

    const apiDate = new Date(newId.start);
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

    const apiDate1 = new Date(newId.end);
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

    this.setState({
      id: newId.id,
      topic: newId.name,
      courseDescription: newId.description,
      fromTime: trueTime,
      toTime: trueTime1,
      courseAllocationId: newId.Id,
    });
    // console.log(mapid, 'vgvjhvj');
  };

  handleChange = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  editTopic = async () => {
    const reqBody = {
      Name: this.state.topic,
      Description: this.state.courseDescription,
      Id: this.state.id,
      Active: true,
      IsDelete: false,
      StartTime: this.state.fromTime,
      EndTime: this.state.toTime,
      CourseAllocation: this.state.courseAllocationId,
    };

    const topicAdd = await fetch(
      'http://10.211.55.11:3000/api/E_LearningLMobile/EditEcontentType',
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      },
    );

    const addedTopic = await topicAdd.json();
    console.log(addedTopic, 'ADDEDTOPICCCCCC');
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
                this.props.navigation.navigate('AllocatedCourseContent')
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
                <Text style={styles.eAssignText}>Add Topic</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}>Edit</Text>
            </View>
            <View>
              <Text style={styles.text}>Topic</Text>
              <TextInput
                onChangeText={this.handleChange('topic')}
                value={this.state.topic}
                name="topic"
                style={styles.textInput}
              />
            </View>

            <View>
              <Text style={styles.text}>Course Registration</Text>
              <TextInput
                onChangeText={this.handleChange('courseDescription')}
                value={this.state.courseDescription}
                name="courseDescription"
                style={styles.textInput}
              />
            </View>
            {/* 
          <View style={styles.dates}>
            <View style={styles.dates1}>
              <Text style={styles.text}>Start Date</Text>
              <TextInput
                onChangeText={this.handleChange('startDate')}
                value={this.state.startDate}
                name="startDate"
                style={styles.textInput3}
              />
            </View>

            <View style={styles.dates11}>
              <Text style={styles.text}>End Date</Text>
              <TextInput
                onChangeText={this.handleChange('endDate')}
                value={this.state.endDate}
                name="endDate"
                style={styles.textInput3}
              />
            </View>
          </View> */}

            <View style={styles.timeView}>
              <View style={styles.timeView1}>
                <Text style={styles.text2}>From Time</Text>
                <TextInput
                  onChangeText={this.handleChange('fromTime')}
                  value={this.state.fromTime}
                  name="fromTime"
                  style={styles.textinput2}
                />
              </View>

              <View style={styles.timeView11}>
                <Text style={styles.text2}>To Time</Text>
                <TextInput
                  onChangeText={this.handleChange('toTime')}
                  value={this.state.toTime}
                  name="toTime"
                  style={styles.textinput2}
                />
              </View>
            </View>

            <View style={styles.bottonView}>
              <TouchableWithoutFeedback onPress={this.editTopic}>
                <Text style={styles.button}>Create</Text>
              </TouchableWithoutFeedback>
            </View>
            {/* <View style={styles.bottonView}>
            <TouchableWithoutFeedback onPress={this.getTopic}>
              <Text style={styles.button}>View or Edit Topics</Text>
            </TouchableWithoutFeedback>
          </View> */}
          </ScrollView>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    height: '95%',
    margin: 5,
    borderRadius: 5,
    borderColor: '#42A5F5',
    backgroundColor: '#fff',
    marginTop: '-25%',
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  textInput: {
    borderWidth: 0.5,
    margin: 10,
    height: 40,
    marginTop: 0,
    borderRadius: 5,
    borderColor: '#a9a9a9',
  },
  button: {
    // borderWidth: 0.5,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 40,
    padding: 10,
    backgroundColor: '#42A5F5',
    color: 'white',
    fontFamily: 'Comfortaa-VariableFont_wght',
    borderRadius: 50,
  },
  text: {
    margin: 10,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  text2: {
    margin: 10,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  textinput2: {
    borderWidth: 0.5,
    margin: 10,
    height: 40,
    marginTop: 0,
    width: '50%',
    borderRadius: 5,
    borderColor: '#a9a9a9',
  },
  timeView: {
    display: 'flex',
    flexDirection: 'row',
    width: '95%',
  },
  timeView1: {
    width: '84%',
  },
  timeView11: {
    width: '84%',
    marginLeft: -100,
  },
  dates: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  dates1: {
    width: '84%',
  },
  dates11: {
    width: '84%',
    marginLeft: -100,
  },
  textInput3: {
    borderWidth: 0.5,
    margin: 10,
    height: 40,
    marginTop: 0,
    width: '50%',
    borderRadius: 5,
    borderColor: '#a9a9a9',
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
