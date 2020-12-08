import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  DrawerLayoutAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../dashboard/menu';

class GetClassAttendanceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classAttendance: '',
    };
  }
  componentDidMount() {
    this.getClassAttendanceFromAsync();
  }

  getClassAttendanceFromAsync = async () => {
    const classList = await AsyncStorage.getItem('classAttendance');
    const newClassList = await JSON.parse(classList);
    console.log(newClassList, 'NEWCLASSSLISSSTTT');

    this.setState({
      classAttendance: newClassList,
    });
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
              onPress={() => this.props.navigation.navigate('GetContent')}>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    // color: 'white',
                    fontSize: 35,
                  }}
                />
                <Text style={styles.eAssignText}>Class Attendance</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.container}>
          {this.state.classAttendance.Output?.map((item) => {
            return (
              <View style={styles.mainAttendance}>
                <View style={styles.attendance}>
                  <Text
                    style={{
                      height: 40,
                      width: '30%',
                      marginRight: '10%',
                      marginLeft: '3%',
                      fontFamily: 'Comfortaa-VariableFont_wght',
                      fontSize: 13,
                    }}>
                    Name:
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Comfortaa-VariableFont_wght',
                      fontSize: 13,
                    }}>
                    {item.FullName}
                  </Text>
                </View>

                <View style={styles.attendance}>
                  <Text
                    style={{
                      height: 40,
                      width: '30%',
                      marginRight: '10%',
                      marginLeft: '3%',
                      fontFamily: 'Comfortaa-VariableFont_wght',
                      fontSize: 13,
                    }}>
                    Matric Number:
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Comfortaa-VariableFont_wght',
                      fontSize: 13,
                    }}>
                    {item.MatricNumber}
                  </Text>
                </View>

                {/* <Text>{item.Id}</Text> */}
                <TouchableWithoutFeedback
                  style={styles.score}
                  onPress={() => this.scoreStudent(item.Id)}>
                  <Text style={styles.scoreText}>Score</Text>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

export default GetClassAttendanceList;

const styles = StyleSheet.create({
  attendance: {
    display: 'flex',
    flexDirection: 'row',

    // justifyContent: 'space-between',
  },
  container: {
    // backgroundColor: '#fff',
    flex: 1,
  },
  mainAttendance: {
    elevation: 15,
    overflow: 'hidden',
    marginLeft: '3%',
    marginRight: '3%',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: '18%',
    paddingTop: 5,
    marginTop: 20,
  },
  score: {
    alignSelf: 'flex-end',
    marginRight: '7%',
    backgroundColor: '#1F88E5',
    marginTop: -10,
    borderRadius: 5,
  },
  Dashboard: {
    height: '15%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 0.5,
    borderColor: '#1F88E5',
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
    // marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
  },
  navTab: {
    display: 'flex',
    flexDirection: 'row',
  },
  eAssignText: {
    marginTop: 3,
    marginLeft: 10,
    // color: '#fff',
    fontSize: 17,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  scoreText: {
    fontFamily: 'Comfortaa-VariableFont_wght',
    color: '#fff',
    padding: 5,
  },
});
