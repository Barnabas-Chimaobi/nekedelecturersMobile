import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  DrawerLayoutAndroid,
  Platform,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Menu from '../dashboard/menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import API from '../../../global';

export default class CreateAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: '',
      assignment: '',
      instruction: '',
      dateSet: new Date(),
      dueDate: new Date(),
      maxScore: '',
      assignmentText: '',
      isDelete: '',
      publish: '',
      courseAllocationId: '',
      pdfName: '',
      pdfUri: '',
      mainpdf: '',
      mode: '',
      show: false,
      showEndDate: false,
      displayDate: '',
      displayDate1: '',
    };
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

  handleChange = (name) => {
    return (text) => {
      this.setState({
        [name]: text,
      });
    };
  };

  // onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || this.state.date;
  //   this.setState({
  //     show: Platform.OS === 'ios',
  //     date: currentDate,
  //   });
  // };

  fileUpload = async () => {
    try {
      let res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
      this.setState({
        pdfName: res.name,
        pdfUri: res.uri,
        mainpdf: res,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
      console.log(err);
    }
  };

  addAssignment = async () => {
    const formData = new FormData();
    formData.append('Url', this.state.mainpdf);
    const assignmentAdd = await fetch(
      `${API.BASE_URL}/AssignmentAddContent?allocId=${14}&dateSet=${
        this.state.displayDate
      }&dueDate=${this.state.displayDate1}&courseId=22&instruction=${
        this.state.instruction
      }&assignmentInText=${this.state.assignmentText}&maxscore=${
        this.state.maxScore
      }&assignment=${this.state.assignment}&IsDelete=${false}&publish=${true}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );

    const addedAssignment = await assignmentAdd.json();
    console.log(addedAssignment, 'ADDEDTOPICCCCCC');
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
                <Text style={styles.eAssignText}> E - Assignments </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}> Add </Text>
            </View>
            <View>
              <Text style={styles.text}> Assignment </Text>
              <TextInput
                onChangeText={this.handleChange('assignment')}
                value={this.state.assignment}
                name="assignment"
                style={styles.textInput}
              />
            </View>
            <View>
              <Text style={styles.text}> Instruction </Text>
              <TextInput
                onChangeText={this.handleChange('instruction')}
                value={this.state.instruction}
                name="instruction"
                style={styles.textInput}
              />
            </View>
            <View>
              <Text style={styles.text2}> Assignment in Text </Text>
              <TextInput
                onChangeText={this.handleChange('assignmentText')}
                value={this.state.assignmentText}
                name="assignmentText"
                style={styles.textInput}
              />
            </View>
            <View style={styles.fileView}>
              <View style={styles.scoreView}>
                <Text style={styles.text2}> Max Score </Text>
                <TextInput
                  onChangeText={this.handleChange('maxScore')}
                  value={this.state.maxScore}
                  name="maxScore"
                  style={styles.textinput2}
                />
              </View>
              <View>
                <TouchableWithoutFeedback
                  style={styles.selectedTopics}
                  onPress={() => {
                    this.fileUpload();
                  }}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 10,
                      backgroundColor: '#a7e3ef',
                      width: 115,
                      textAlign: 'center',
                      height: 25,
                      paddingTop: 3,
                      marginTop: 40,
                    }}>
                    Select File
                  </Text>
                </TouchableWithoutFeedback>
                <Text style={{width: '50%'}}> {this.state.pdfName} </Text>
              </View>
            </View>
            <View style={styles.dates}>
              <View style={styles.dates1}>
                <Text style={styles.text}> Start Date </Text>
                <TouchableWithoutFeedback onPress={() => this.date()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <View>
                      <Text> {this.state.dateSet.toLocaleDateString()} </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.show && (
                  <DateTimePicker
                    mode="date"
                    value={this.state.dateSet}
                    is24Hour={true}
                    // display="default"
                    onChange={(event, d) => {
                      let trueTime = `${d.getDate()}/${
                        d.getMonth() + 1
                      }/${d.getUTCFullYear()}`;

                      // console.log(trueTime);
                      if (d !== undefined) {
                        this.setState({
                          dateSet: d,
                          show: false,
                          displayDate: trueTime,
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
                <Text style={styles.text}> End Date </Text>
                <TouchableWithoutFeedback onPress={() => this.date1()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <View>
                      <Text> {this.state.dueDate.toLocaleDateString()} </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showEndDate && (
                  <DateTimePicker
                    mode="date"
                    value={this.state.dueDate}
                    is24Hour={true}
                    // display="default"
                    onChange={(event, d) => {
                      let trueTime1 = `${d.getDate()}/${
                        d.getMonth() + 1
                      }/${d.getUTCFullYear()}`;
                      if (d !== undefined) {
                        this.setState({
                          dueDate: d,
                          showEndDate: false,
                          displayDate1: trueTime1,
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
            <View style={styles.bottonView}>
              <TouchableWithoutFeedback onPress={this.addAssignment}>
                <Text style={styles.button}> Create </Text>
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
    flex: 1,
    borderColor: '#42A5F5',
    backgroundColor: '#fff',
    marginTop: '-25%',
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
    width: '85%',
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
  scoreView: {
    width: '65%',
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
  fileView: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'space-between',
  },
  selectedTopics: {
    paddingLeft: 200,
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
