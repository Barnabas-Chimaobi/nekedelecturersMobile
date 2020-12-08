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
import DateTimePicker from '@react-native-community/datetimepicker';

export default class AddTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      courseDescription: '',
      startDate: new Date(),
      endDate: new Date(),
      courseAllocationId: 14,
      fromTime: '',
      toTime: '',
      Active: true,
      id: '',
      show: false,
      showEndDate: false,
      showStartTime: false,
      showEndTime: false,
    };
  }

  componentDidMount() {
    this.fetchId();
  }

  date = () => {
    this.setState({
      show: true,
    });
  };

  date1 = () => {
    this.setState({
      showEndDate: true,
    });
  };

  time = () => {
    this.setState({
      showStartTime: true,
    });
  };

  time1 = () => {
    this.setState({
      showEndTime: true,
    });
  };

  fetchId = async () => {
    const courseId = await AsyncStorage.getItem('courseDetails');
    const newId = await JSON.parse(courseId);

    const mapid = await newId.map((item) => item.allocId);
    this.setState({
      id: mapid,
    });
    console.log(mapid, 'vgvjhvj');
  };

  handleChange = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  addTopic = async () => {
    const topicAdd = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/CreateTopic?topic=${this.state.topic}&coursedescription=${this.state.courseDescription}&StartDate=${this.state.startDate}&EndDate=${this.state.endDate}&Active=${this.state.Active}&courseAllocationId=${this.state.courseAllocationId}&fromTime=${this.state.fromTime}&toTime=${this.state.toTime}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    const addedTopic = await topicAdd.json();
    console.log(addedTopic, 'ADDEDTOPICCCCCC');
  };

  getTopic = async () => {
    const gettopics = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/ManageCourseContent?courseAllocId=${this.state.id}`,
    );
    const gottenTopics = await gettopics.json();
    // console.log(courseId, 'IDDD');
    AsyncStorage.setItem('allTopics', JSON.stringify(gottenTopics));
    // console.log(gottenTopics, 'Topics');
    this.props.navigation.navigate('GetTopics');
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
              <Text style={styles.pickerHeaderText}>Add</Text>
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

            <View style={styles.dates}>
              <View style={styles.dates1}>
                <Text style={styles.text1}>Start Date</Text>
                <TouchableWithoutFeedback onPress={() => this.date()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <Text>{this.state.startDate?.toLocaleDateString()}</Text>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.show && (
                  <DateTimePicker
                    mode="date"
                    value={this.state.startDate}
                    is24Hour={true}
                    display="default"
                    onChange={(event, d) => {
                      if (d !== undefined) {
                        this.setState({
                          startDate: d,
                          show: false,
                        });
                      }
                      console.log('value:', d);
                    }}
                  />
                )}
                {/* <TextInput
                  onChangeText={this.handleChange('dateSet')}
                  value={this.state.dateSet}
                  name="dateSet"
                  style={styles.textInput3}
                  // editable={false}
                /> */}
              </View>

              <View style={styles.dates11}>
                <Text style={styles.text1}>End Date</Text>
                <TouchableWithoutFeedback onPress={() => this.date1()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <Text>{this.state.endDate?.toLocaleDateString()}</Text>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showEndDate && (
                  <DateTimePicker
                    mode="date"
                    value={this.state.endDate}
                    is24Hour={true}
                    display="default"
                    onChange={(event, d) => {
                      if (d !== undefined) {
                        this.setState({
                          endDate: d,
                          showEndDate: false,
                        });
                      }
                      console.log('value:', d);
                    }}
                  />
                )}
                {/* <TextInput
                  onChangeText={this.handleChange('dueDate')}
                  value={this.state.dueDate}
                  name="dueDate"
                  style={styles.textInput3}
                /> */}
              </View>
            </View>

            <View style={styles.dates}>
              <View style={styles.dates1}>
                <Text style={styles.text1}>From Time</Text>
                <TouchableWithoutFeedback onPress={() => this.date()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <Text>{this.state.fromTime?.toLocaleTimeString()}</Text>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showStartTime && (
                  <DateTimePicker
                    mode="time"
                    value={this.state.fromTime}
                    is24Hour={true}
                    display="default"
                    onChange={(event, d) => {
                      if (d !== undefined) {
                        this.setState({
                          fromTime: d,
                          showStartTime: false,
                        });
                      }
                      console.log('value:', d);
                    }}
                  />
                )}
                {/* <TextInput
                  onChangeText={this.handleChange('dateSet')}
                  value={this.state.dateSet}
                  name="dateSet"
                  style={styles.textInput3}
                  // editable={false}
                /> */}
              </View>

              <View style={styles.dates11}>
                <Text style={styles.text1}>To Time</Text>
                <TouchableWithoutFeedback onPress={() => this.date1()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <Text>{this.state.toTime?.tolocaleTimeString()}</Text>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showEndTime && (
                  <DateTimePicker
                    mode="time"
                    value={this.state.toTime}
                    is24Hour={true}
                    display="default"
                    onChange={(event, d) => {
                      if (d !== undefined) {
                        this.setState({
                          toTime: d,
                          showEndTime: false,
                        });
                      }
                      console.log('value:', d);
                    }}
                  />
                )}
                {/* <TextInput
                  onChangeText={this.handleChange('dueDate')}
                  value={this.state.dueDate}
                  name="dueDate"
                  style={styles.textInput3}
                /> */}
              </View>
            </View>

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
              <TouchableWithoutFeedback onPress={this.addTopic}>
                <Text style={styles.button}>Create</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.bottonView}>
              <TouchableWithoutFeedback onPress={this.getTopic}>
                <Text style={styles.button}>View or Edit Topics</Text>
              </TouchableWithoutFeedback>
            </View>
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
  text1: {
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
    marginLeft: '-16%',
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
  calender: {
    fontSize: 20,
    color: '#1F88E5',
    marginLeft: 10,
    marginRight: 5,
  },
  dateView: {
    display: 'flex',
    flexDirection: 'row',
  },
});
