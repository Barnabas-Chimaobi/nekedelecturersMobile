import React, {Component} from 'react';
import {Picker} from '@react-native-community/picker';
import {
  AsyncStorage,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  DrawerLayoutAndroid,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Menu from '../dashboard/menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class EditContent extends Component {
  constructor(props) {
    super(props);
    const {state, setParams, navigate} = this.props.navigation;
    const params = state.params || {};
    this.state = {
      listTopics: [{Id: 0, Name: 'Select Topic'}],
      topics: [],
      selectedTopics: '',
      id: params.findOne.Id,
      videoUrl: params.findOne.videoUrl,
      liveStreamLink: params.findOne.liveStream,
      startDate: params.findOne.startTime,
      endDate: params.findOne.endTime,
      pdfName: '',
      pdfUri: '',
      mainpdf: params.findOne.url,
      eachTopic: '',
      selectedName: '',
      showAlert: false,
    };
  }

  componentDidMount() {
    this.getId();
    const {state, setParams, navigate} = this.props.navigation;
    const params = state.params || {};
    console.log(params, 'NEW PARAMS');
    // this.selectTopic();
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
    this.props.navigation.navigate('GetContent');
  };

  getId = async () => {
    const id = await AsyncStorage.getItem('courseDetails');
    const newId = await JSON.parse(id);
    const gottenId = newId.map((item) => {
      return item.allocId;
    });

    const topic = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/ManageCourseContent?courseAllocId=${gottenId}`,
    );

    const retrievedTopic = await topic.json();
    const arrayOfTopics = retrievedTopic.Output.map((item) => {
      return {
        Name: item.Name,
        Id: item.Id,
      };
    });

    // this.setState({
    //   topics: arrayOfTopics,
    // });
    // console.log(this.state.topics);

    const newListTopics = this.state.listTopics.concat(arrayOfTopics);
    this.setState({
      topics: newListTopics,
    });
    console.log(newListTopics);
  };

  pickTopics = () => {
    return this.state.topics.map((y, z) => {
      return <Picker.Item value={y.Id} label={y.Name} key={z} />;
    });
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

  handleSubmit = async () => {
    const formData = new FormData();
    formData.append('Url', this.state.mainpdf);

    const addContent = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/EditCourseContent?videoUrl=${this.state.videoUrl}&liveStreamLink=${this.state.liveStreamLink}&startDate=${this.state.startDate}&endDate=${this.state.endDate}&Id=${this.state.id}`,
      {
        method: 'PUT',
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );
    const uploadedContent = await addContent.json();
    if (this.state.videoUrl != '' || this.state.mainpdf != '') {
      this.showAlert();
    } else {
      alert('fields cannot be empty');
    }
    console.log(uploadedContent, 'UPLOADED SUCCESSFULLY');
  };

  handleChange = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  remappedData = (CourseAllocationIds, CourseNameForDisplay) => {
    console.log('ASSIGN ID: ', CourseAllocationIds);
    console.log('COURsENAme:', CourseNameForDisplay);
    const newObject = this.state.topics.map((item) => {
      return {
        Id: item.Id,
      };
    });

    const selectedAllocation = newObject.find(
      (as) => as.Id === CourseAllocationIds,
    );

    console.log(selectedAllocation, ':ASDDDDDDD');
    console.log(CourseNameForDisplay, ':NewCoursename');
    // this.setState({assignment: selectedAsignment});
    // console.log(this.state.assignment, ':ASSIGNMT');
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
                <Text style={styles.eAssignText}>E-Content</Text>
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
            message="Content Updated Successfully!"
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
            <View style={styles.picker}>
              <Picker
                selectedValue={this.state.selectedTopics}
                // style={{height: 50, width: 100}}

                onValueChange={(itemValue, itemIndex) => {
                  this.state.topics && this.state.topics !== null
                    ? this.setState({
                        selectedTopics: itemValue,
                        // selectedName: itemIndex,
                        // eachTopic: this.state.topics.find((t) => t.Id === itemValue)
                        //   ?.Name,
                      })
                    : null;
                  // console.log(this.state.selectedTopics, 'SEHGHFVGVFGC');
                  // const dffd = this.state.topics.find(
                  //   (t) => t.Id === this.state.selectedTopics,
                  // );
                  this.remappedData(this.state.selectedTopics);

                  console.log(this.state.eachTopic, 'great topics');
                }}>
                {this.pickTopics()}
              </Picker>
            </View>
            <View style={styles.selectedTopics}>
              <View>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.fileUpload();
                  }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginLeft: 5,
                      marginTop: 10,
                      backgroundColor: '#a7e3ef',
                      width: 115,
                      textAlign: 'center',
                      height: 25,
                      paddingTop: 3,
                      marginTop: 10,
                    }}>
                    Select File
                  </Text>
                </TouchableWithoutFeedback>

                <Text style={{paddingLeft: 5}}>{this.state.pdfName}</Text>
              </View>
              <View style={styles.addtopic}>
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.navigate('AddTopic')}>
                  <Text style={styles.text1}>Add Topic</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View>
              <View style={styles.textInputView}>
                <Text style={styles.text1}>Video URL</Text>
                <TextInput
                  onChangeText={this.handleChange('videoUrl')}
                  value={this.state.videoUrl}
                  name="videoUrl"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.textInputView}>
                <Text style={styles.text1}>liveStream Link(Zoom)</Text>
                <TextInput
                  onChangeText={this.handleChange('liveStreamLink')}
                  value={this.state.liveStreamLink}
                  name="liveStreamLink"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.textInputView}>
                <Text style={styles.text1}>Start Date</Text>
                <TextInput
                  onChangeText={this.handleChange('startDate')}
                  value={this.state.startDate}
                  name="startDate"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.textInputView}>
                <Text style={styles.text1}>End Date</Text>
                <TextInput
                  onChangeText={this.handleChange('endDate')}
                  value={this.state.endDate}
                  name="endDate"
                  style={styles.textInput}
                />
              </View>
            </View>
            <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
              <View style={styles.submit}>
                <Text style={styles.text}>submit</Text>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // margin: 5,
    // padding: 10,
    borderRadius: 5,
    height: '85%',
    borderWidth: 0.5,
    width: '92%',
    alignSelf: 'center',
    borderColor: '#42A5F5',
    backgroundColor: '#fff',
    marginTop: '-25%',
    flex: 1,
  },
  textInput: {
    height: 35,
    borderWidth: 0.5,
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
    borderColor: '#a9a9a9',
  },
  textInputView: {
    marginTop: 30,
  },
  submit: {
    // borderWidth: 0.5,
    marginTop: 40,
    width: '90%',
    alignSelf: 'center',
    height: 35,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: '#42A5F5',
  },
  text: {
    textAlign: 'center',
    paddingTop: 5,
    color: 'white',
    fontFamily: 'Comfortaa-VariableFont_wght',
  },

  // text1: {
  //   marginBottom: 10,
  //   paddingLeft: 10,
  // },
  selectedTopics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addtopic: {
    borderWidth: 0.5,
    margin: 5,
    backgroundColor: '#a7e3ef',
    borderColor: '#a7e3ef',
    borderRadius: 5,
  },
  text1: {
    padding: 4,
    marginLeft: 5,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  picker: {
    borderWidth: 0.5,
    height: 40,
    borderRadius: 10,
    width: '70%',
    borderColor: '#a9a9a9',
    marginTop: 15,
    marginLeft: 10,
    // paddingTop: -10,
  },
  mainPicker: {
    fontFamily: 'Comfortaa-VariableFont_wght',
    height: 44,
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
