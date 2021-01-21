import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  DrawerLayoutAndroid,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../dashboard/menu';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import API from '../../../global';

class GetContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentList: [],
      EcontentId: '',
      Id: '',
      showIndicator: false,
      showAlert: false,
    };
  }

  componentDidMount() {
    this.getContent();
  }

  onButtonPress = () => {
    if (this.state.contentList != null) {
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

  getContent = async () => {
    const contents = await AsyncStorage.getItem('courseContents');
    const fetchedContents = await JSON.parse(contents);
    console.log(fetchedContents, 'FETCHEDCONTENTSSSSSS');
    const mappedContent = fetchedContents.Output.map((item) => {
      return item;
    });
    console.log(mappedContent, 'MAPPEDDDDDD');

    this.setState({
      contentList: mappedContent,
      EcontentId: mappedContent.map((item) => {
        return item.EContentType.Id;
      }),
    });
    console.log(this.state.EcontentId, 'EcontentTTTTTTTT');

    const getCourseDetails = await AsyncStorage.getItem('courseDetails');
    const parsedCourseDetails = await JSON.parse(getCourseDetails);
    console.log(parsedCourseDetails, 'PARSEDCOURSEDETAILS');

    const courseId = parsedCourseDetails.map((item) => {
      return item.Id;
    });
    // console.log(courseId, 'IDDDDDDDDDDD');
    this.setState({
      Id: courseId,
    });
  };

  getCurrentContent = async () => {
    const allContents = await fetch(
      `${API.BASE_URL}/GetCourseContents?Id=${this.state.Id}`,
    );

    const fetchedContents = await allContents.json();
    console.log(fetchedContents, 'FTECHED CONTENTS');
    AsyncStorage.setItem('courseContents', JSON.stringify(fetchedContents));
    const remapContents = fetchedContents.Output.map((item) => {
      return item;
    });

    this.setState({
      contentList: remapContents,
    });
    // this.props.navigation.navigate('GetContent');
  };

  classList = async (id) => {
    const attendance = await fetch(
      `${API.BASE_URL}/GetClassAttendanceList?EcontentId=${id}`,
    );
    const fetchedAttendance = await attendance.json();
    console.log(fetchedAttendance, 'FETCEDATTENDAAAAAAAA');
    this.setState({
      showIndicator: false,
    });
    AsyncStorage.setItem('classAttendance', JSON.stringify(fetchedAttendance));
    this.props.navigation.navigate('GetClassAttendanceList');
  };

  remapp = async (desc) => {
    const newDesc = this.state.contentList.map((item) => {
      return {
        Id: item.Id,
        courseId: item.Course.Id,
        eContentType: item.EContentType.Id,
        endTime: item.EndTime,
        startTime: item.StarTime,
        url: item.Url,
        videoUrl: item.VideoUrl,
        isDelete: item.IsDelete,
        liveStream: item.LiveStreamLink,
        active: item.Active,
      };
    });
    const selectedDetail = newDesc.find((a) => a.Id === desc);
    console.log(selectedDetail, 'THIS WAS SELECTED');
    // const newAsync = await AsyncStorage.setItem(
    //   'remappedAssignment',
    //   JSON.stringify(selectedDetail),
    // );
    // console.log(newAsync, 'THis is a new part this assignment');
    this.props.navigation.navigate('EditContent', {
      findOne: selectedDetail,
    });
  };

  deleteContent = async (id) => {
    const deleteItem = await fetch(`${API.BASE_URL}/DeleteEContent?id=${id}`, {
      method: 'DELETE',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const deleted = await deleteItem.json();
    this.getCurrentContent();
    console.log(deleted, 'DELETTTEEEDDD');
  };

  render() {
    let API_ROOT = 'http://10.211.55.11:3000/api/E_LearningLMobile/';

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
          <ScrollView>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}>
                Select to View Assignments
              </Text>
            </View>
            {this.state.contentList.map((item) => {
              const pdfword = ` ${API_ROOT}${item.Url.substring(
                2,
                item.Url.length,
              )}`;
              return (
                <View style={styles.cardDeatailsMainView}>
                  <View style={styles.cardDeatailsView}>
                    <View style={styles.assignmentView}>
                      <View style={styles.assignmentName}>
                        <View>
                          <View style={styles.time}>
                            <MaterialIcon
                              name="picture-as-pdf"
                              color="#42A5F5"
                              style={styles.image}
                            />
                            <TouchableWithoutFeedback
                              onPress={() => {
                                Linking.openURL(pdfword);
                              }}>
                              <Text style={styles.assignment}>PDF </Text>
                            </TouchableWithoutFeedback>
                          </View>
                          <View style={styles.time}>
                            <MaterialIcon
                              name="video-call"
                              color="red"
                              style={styles.image}
                            />
                            <TouchableWithoutFeedback
                              onPress={() => {
                                Linking.openURL(item.LiveStreamLink);
                              }}>
                              <Text style={styles.assignment}>
                                Live StreamLink
                              </Text>
                            </TouchableWithoutFeedback>
                          </View>
                          <View style={styles.time}>
                            <MaterialIcon
                              name="play-arrow"
                              color="red"
                              style={styles.image}
                            />
                            <TouchableWithoutFeedback
                              onPress={() => {
                                Linking.openURL(item.VideoUrl);
                              }}>
                              <Text style={styles.assignment}>
                                Video Tutorials
                              </Text>
                            </TouchableWithoutFeedback>
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
                                this.classList(item.Id);
                                this.onButtonPress();
                              }}>
                              <Text style={styles.assignAdjust}>
                                Attendance
                              </Text>
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
                            message="Are you sure you want to delete this Content?"
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
                              this.deleteContent(item.Id);
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

export default GetContent;

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
    marginLeft: 10,
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
    fontSize: 14,
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
    margin: 2,
    fontSize: 15,
  },
});
