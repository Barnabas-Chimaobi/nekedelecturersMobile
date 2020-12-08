import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  AsyncStorage,
  DrawerLayoutAndroid,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Menu from '../dashboard/menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class EditAssignment extends Component {
  constructor(props) {
    super(props);
    const {state, setParams, navigate} = this.props.navigation;
    const params = state.params || {};

    const apiDate = new Date(params.findOne.dateSet);
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

    const apiDate1 = new Date(params.findOne.dueDate);
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

    this.state = {
      courseId: params.findOne.course.Id,
      assignment: params.findOne.assignment,
      instruction: params.findOne.instructions,
      dateSet: trueTime,
      dueDate: trueTime1,
      maxScore: params.findOne.maxScore,
      assignmentText: params.findOne.assignmentText,
      isDelete: params.findOne.isDelete,
      publish: params.findOne.publish,
      courseAllocationId: params.findOne.courseAllocation.Id,
      assignmentId: params.findOne.Id,
      pdfName: '',
      pdfUri: '',
      mainpdf: '',
      showAlert: false,
    };
  }

  handleChange = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  onButtonPress = () => {
    if (this.state.assignment != null) {
      alert('Assignment Updated succesfully');
      this.props.navigation.navigate('GivenAssignments');
    } else {
      alert('please check your input fields');
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
    this.props.navigation.navigate('GivenAssignments');
  };

  componentDidMount() {
    const {state, setParams, navigate} = this.props.navigation;
    const params = state.params || {};
    console.log(params, 'NEW PARAMS');
    this.storageFetchAssignments();
  }

  storageFetchAssignments = async () => {
    const getAssignments = await AsyncStorage.getItem('allAssignments');
    const gottenAssignments = await JSON.parse(getAssignments);
    console.log(gottenAssignments, 'GOTTENASSIGNMENTS');

    const mappedAssign = gottenAssignments.Output.map((item) => {
      return {
        assignment: item.Assignment,
        assignmentText: item.AssignmentInText,
        // dateSet:
      };
    });
    // console.log(mappedAssign, 'MAPPPPPPEDDDD');

    // this.state.assignments.concat(gottenAssignments);
    this.setState({
      assignments: mappedAssign,
    });
    // console.log(this.state.assignments, 'newassignments');
  };

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

  editAssignment = async () => {
    const formData = new FormData();
    formData.append('Url', this.state.mainpdf);
    const assignmentAdd = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/EditAssignment?Id=${this.state.assignmentId}&allocId=${this.state.courseAllocationId}&courseId=${this.state.courseId}&dateSet=${this.state.dateSet}&dueDate=${this.state.dueDate}&instruction=${this.state.instruction}&assignment=${this.state.assignment}&assignmentInText=${this.state.assignmentText}&maxScore=${this.state.maxScore}&IsDelete=${this.state.isDelete}&publish=${this.state.publish}`,
      {
        method: 'Put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );

    const addedAssignment = await assignmentAdd.json();
    if (this.state.assignment != null) {
      this.showAlert();
    }
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
                this.props.navigation.navigate('GivenAssignments')
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
                <Text style={styles.eAssignText}>E-Assignment</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container}>
          <AwesomeAlert
            show={this.state.showAlert}
            showProgress={false}
            title="Message"
            message="Assignment Updated Successfully!"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Ok"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
          <ScrollView>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}>Edit</Text>
            </View>
            <View>
              <Text style={styles.text}>Assignment</Text>
              <TextInput
                onChangeText={this.handleChange('assignment')}
                value={this.state.assignment}
                name="assignment"
                style={styles.textInput}
              />
            </View>

            <View>
              <Text style={styles.text}>Instruction</Text>
              <TextInput
                onChangeText={this.handleChange('instruction')}
                value={this.state.instruction}
                name="instruction"
                style={styles.textInput}
              />
            </View>

            <View>
              <Text style={styles.text2}>Assignment in Text</Text>
              <TextInput
                onChangeText={this.handleChange('assignmentText')}
                value={this.state.assignmentText}
                name="assignmentText"
                style={styles.textInput}
              />
            </View>

            <View style={styles.fileView}>
              <View style={styles.scoreView}>
                <Text style={styles.text2}>Max Score</Text>
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
                      backgroundColor: '#a7e3ef',
                      width: 115,
                      textAlign: 'center',
                      height: 28,
                      paddingTop: 3,
                      marginTop: 40,
                      fontFamily: 'Comfortaa-VariableFont_wght',
                    }}>
                    Select File
                  </Text>
                </TouchableWithoutFeedback>
                <Text style={{marginLeft: 5, color: '#42A5F5'}}>
                  {this.state.pdfName}
                </Text>
              </View>
            </View>

            <View style={styles.dates}>
              <View style={styles.dates1}>
                <Text style={styles.text}>Start Date</Text>
                <TextInput
                  onChangeText={this.handleChange('dateSet')}
                  value={this.state.dateSet}
                  name="dateSet"
                  style={styles.textInput3}
                />
              </View>

              <View style={styles.dates11}>
                <Text style={styles.text}>End Date</Text>
                <TextInput
                  onChangeText={this.handleChange('dueDate')}
                  value={this.state.dueDate}
                  name="dueDate"
                  style={styles.textInput3}
                />
              </View>
            </View>

            <View style={styles.bottonView}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.editAssignment();
                  // this.onButtonPress();
                }}>
                <Text style={styles.button}>Create</Text>
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
    height: '90%',
    margin: 5,
    borderRadius: 5,
    flex: 1,
    width: '92%',
    alignSelf: 'center',
    borderColor: '#42A5F5',
    backgroundColor: '#fff',
    marginTop: '-25%',
  },
  textInput: {
    borderWidth: 0.5,
    margin: 10,
    height: 40,
    marginTop: 0,
    borderRadius: 5,
    borderColor: '#a9a9a9',
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  button: {
    // borderWidth: 0.5,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 40,
    padding: 10,
    // borderTopRightRadius: 15,
    // borderBottomLeftRadius: 15,
    backgroundColor: '#42A5F5',
    color: 'white',
    fontFamily: 'Comfortaa-VariableFont_wght',
    borderRadius: 50,
    height: 40,
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
});
