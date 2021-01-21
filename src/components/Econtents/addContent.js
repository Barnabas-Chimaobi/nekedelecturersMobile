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
import DateTimePicker from '@react-native-community/datetimepicker';
import API from '../../../global';

export default class AddTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTopics: [{Id: 0, Name: 'Select Topic'}],
      topics: [],
      selectedTopics: '',
      videoUrl: '',
      liveStreamLink: '',
      startDate: new Date(),
      endDate: new Date(),
      pdfName: '',
      pdfUri: '',
      mainpdf: '',
      eachTopic: '',
      selectedName: '',
      show: false,
      showEndDate: false,
      displayDate: '',
      displayDate1: '',
    };
  }

  componentDidMount() {
    this.getId();
    // this.selectTopic();
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

  getId = async () => {
    const id = await AsyncStorage.getItem('courseDetails');
    const newId = await JSON.parse(id);
    const gottenId = newId.map((item) => {
      return item.allocId;
    });

    AsyncStorage.setItem('courseId', JSON.stringify(gottenId));

    const topic = await fetch(
      `${API.BASE_URL}/ManageCourseContent?courseAllocId=${gottenId}`,
    );
    const retrievedTopic = await topic.json();
    const arrayOfTopics = retrievedTopic.Output.map((item) => {
      return {
        Name: item.Name,
        Id: item.Id,
      };
    });
    console.log(retrievedTopic, 'GREAAATAT');

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
      `${API.BASE_URL}/AddContent?videoUrl=${this.state.videoUrl}&liveStreamLink=${this.state.liveStreamLink}&startDate=${this.state.startDate}&endDate=${this.state.endDate}`,
      {
        method: 'POST',
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );
    const uploadedContent = await addContent.json();
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
          <ScrollView>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}>Edit</Text>
            </View>
            <View style={styles.picker}>
              <Picker
                style={styles.mainPicker}
                itemStyle={{height: 44}}
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
              <TouchableWithoutFeedback
                onPress={() => {
                  this.fileUpload();
                }}>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginLeft: 10,
                    marginTop: 10,
                    backgroundColor: '#a7e3ef',
                    width: 115,
                    textAlign: 'center',
                    height: 25,
                    paddingTop: 3,
                    marginTop: 10,
                    fontFamily: 'Comfortaa-VariableFont_wght',
                  }}>
                  Select File
                </Text>
              </TouchableWithoutFeedback>

              <View style={styles.addtopic}>
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.navigate('AddTopic')}>
                  <Text style={styles.text1}>Add Topic</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <Text
              style={{
                paddingLeft: 10,
              }}>
              {this.state.pdfName}
            </Text>

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

              {/* <View style={styles.textInputView}>
                <Text style={styles.text1}>Start Date</Text>
                <TextInput
                  onChangeText={this.handleChange('startDate')}
                  value={this.state.startDate}
                  name="startDate"
                  style={styles.textInput}
                />
              </View> */}
            </View>
            <View style={styles.dates}>
              <View style={styles.dates1}>
                <Text style={styles.text1}>Start Date</Text>
                <TouchableWithoutFeedback onPress={() => this.date()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <View>
                      {this.state.displayDate == '' ? (
                        <Text>{this.state.startDate.toLocaleDateString()}</Text>
                      ) : (
                        <Text>{this.state.displayDate}</Text>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.show && (
                  <DateTimePicker
                    mode="date"
                    value={this.state.startDate}
                    is24Hour={true}
                    display="default"
                    onChange={(event, d) => {
                      let trueTime = `${d.getDate()}/${
                        d.getMonth() + 1
                      }/${d.getUTCFullYear()}`;
                      if (d !== undefined) {
                        this.setState({
                          startDate: trueTime,
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
                <Text style={styles.text1}>End Date</Text>
                <TouchableWithoutFeedback onPress={() => this.date1()}>
                  <View style={styles.dateView}>
                    <MaterialIcon name="date-range" style={styles.calender} />
                    <View>
                      {this.state.displayDate1 == '' ? (
                        <Text>{this.state.endDate.toLocaleDateString()}</Text>
                      ) : (
                        <Text>{this.state.displayDate1}</Text>
                      )}
                    </View>
                    {/* <Text>{this.state.endDate?.toLocaleDateString()}</Text> */}
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showEndDate && (
                  <DateTimePicker
                    mode="date"
                    value={this.state.endDate}
                    is24Hour={true}
                    display="default"
                    onChange={(event, d) => {
                      let trueTime1 = `${d.getDate()}/${
                        d.getMonth() + 1
                      }/${d.getUTCFullYear()}`;
                      if (d !== undefined) {
                        this.setState({
                          endDate: trueTime1,
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
            {/* 
              <View style={styles.textInputView}>
                <Text style={styles.text1}>End Date</Text>
                <TextInput
                  onChangeText={this.handleChange('endDate')}
                  value={this.state.endDate}
                  name="endDate"
                  style={styles.textInput}
                />
              </View> */}

            <TouchableWithoutFeedback onPress={this.handleSubmit}>
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
  text1: {
    margin: 10,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
});
