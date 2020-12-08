import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  AsyncStorage,
  DrawerLayoutAndroid,
  Image,
  ScrollView,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../dashboard/menu';

class GetTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfTopics: [],
    };
  }

  componentDidMount() {
    this.gettopic();
  }

  // componentDidUpdate() {
  //   this.gettopic();
  //   // };
  // }

  gettopic = async () => {
    const alltopics = await AsyncStorage.getItem('allTopics');
    const availableTopics = await JSON.parse(alltopics);
    const maptopic = availableTopics.Output.map((item) => {
      return item;
    });
    this.setState({
      listOfTopics: maptopic,
    });
    console.log(this.state.listOfTopics);
  };

  getId = async () => {
    const id = await AsyncStorage.getItem('courseDetails');
    const newId = await JSON.parse(id);
    const gottenId = newId.map((item) => {
      return item.allocId;
    });

    // AsyncStorage.setItem('courseId', JSON.stringify(gottenId));

    const topic = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/ManageCourseContent?courseAllocId=${gottenId}`,
    );
    const retrievedTopic = await topic.json();
    const arrayOfTopics = retrievedTopic.Output.map((item) => {
      return item;
    });
    console.log(retrievedTopic, 'GREAAATAT');

    // this.setState({
    //   topics: arrayOfTopics,
    // });
    // console.log(this.state.topics);

    // const newListTopics = this.state.listTopics.concat(arrayOfTopics);
    this.setState({
      listOfTopics: arrayOfTopics,
    });
    console.log(arrayOfTopics);
  };

  remap = (id) => {
    const eachTopic = this.state.listOfTopics.map((item) => {
      return {
        name: item.Name,
        id: item.Id,
        start: item.StartTime,
        end: item.EndTime,
        description: item.Description,
        Id: item.CourseAllocation.Id,
      };
    });

    const newObject = eachTopic.find((a) => a.id === id);
    console.log(newObject, 'EACHTOPICCCCSSSS');
    this.props.navigation.navigate('EditTopic');
    AsyncStorage.setItem('oneTopic', JSON.stringify(newObject));
  };

  onRemove = async (id) => {
    const eachTopic = this.state.listOfTopics.map((item) => {
      return {
        name: item.Name,
        id: item.Id,
        start: item.StartTime,
        end: item.EndTime,
        description: item.Description,
        Id: item.CourseAllocation.Id,
      };
    });

    const newObject = eachTopic.find((a) => a.id === id);
    console.log(newObject, 'EACHTOPICCCCSSSS');
    // this.props.navigation.navigate('GetTopic');
    const deleteTopic = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/DeleteTopic?econtentTypeId=${newObject.id}`,
    );

    const deletedTopic = await deleteTopic.json();
    this.getId();
    console.log(deletedTopic, 'DELETEDEEEEE');

    // if (deletedTopic.Output === 'Deleted') {
    // this.gettopic();
  };

  render() {
    console.log(this.state.listOfTopics, 'LISTOFTOPISHSSHHS');
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
              onPress={() => this.props.navigation.navigate('AddTopic')}>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    color: 'white',
                    fontSize: 35,
                    marginLeft: -10,
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
              <Text style={styles.pickerHeaderText}>List Of Topics</Text>
            </View>
            {this.state.listOfTopics.map((item) => {
              return (
                <View style={styles.cardDeatailsMainView}>
                  <View style={styles.cardDeatailsView}>
                    <View style={styles.assignmentView}>
                      <View style={styles.assignmentName}>
                        <Text style={styles.assignment}>
                          {item.Name.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <ScrollView>
                        <View style={styles.cardTextView}>
                          <View>
                            <TouchableWithoutFeedback
                              onPress={() => this.remap(item.Id)}>
                              <Image
                                style={styles.assignAdjust}
                                source={require('../../assets/edit.png')}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                          <View>
                            <TouchableWithoutFeedback
                              onPress={() => this.onRemove(item.Id)}>
                              <Image
                                style={styles.assignAdjust}
                                source={require('../../assets/deletes.png')}
                              />
                            </TouchableWithoutFeedback>
                          </View>
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

export default GetTopics;

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
    marginTop: '20%',
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
    marginLeft: 60,
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
  time: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
  },
  image: {
    margin: 5,
  },
});
