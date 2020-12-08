import React, {Component} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  DrawerLayoutAndroid,
  Image,
  BackHandler,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Menu from '../dashboard/menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class Dashboard extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleSubmit = () => {
    this.props.navigation.navigate('Eassignment');
  };

  handleSubmit1 = () => {
    this.props.navigation.navigate('EContent');
  };

  openDrawer = () => {
    this.drawer.openDrawer();
  };

  // handles action for closing android/menu drawer
  closeDrawer = () => {
    this.drawer.closeDrawer();
  };

  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
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
        <View>
          <View style={styles.Dashboard}>
            <View style={styles.container}>
              <TouchableWithoutFeedback onPress={() => this.openDrawer()}>
                <MaterialIcon
                  name="menu"
                  style={{
                    color: 'white',
                    fontSize: 23,
                    marginLeft: 8,
                  }}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <MaterialIcon
                  name="notification-important"
                  style={{
                    color: 'white',
                    fontSize: 23,
                    marginLeft: 8,
                  }}
                />
              </TouchableWithoutFeedback>
            </View>

            <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text>
          </View>
          <View style={styles.assignmentContainer}>
            <View style={styles.eAssignmentView}>
              <TouchableWithoutFeedback
                style={styles.assignmentButton}
                onPress={this.handleSubmit}>
                <Image
                  style={styles.images}
                  source={require('../../assets/homework1.png')}
                />

                <Text style={styles.text}>E-Assignment</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.eAssignmentView}>
              <TouchableWithoutFeedback
                style={styles.assignmentButton}
                onPress={this.handleSubmit1}>
                <Image
                  style={styles.images}
                  source={require('../../assets/qa1.png')}
                />

                <Text style={styles.text}>E-Contents</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'blue',
  },
  assignmentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // borderWidth: 0.5,
    margin: 5,
    height: '95%',
    borderRadius: 5,
    // borderColor: '#0982B8',
    // flexWrap: 'wrap',
  },
  eAssignmentView: {
    width: '40%',
    height: '35%',
    borderWidth: 0.5,
    marginTop: '15%',
    borderRadius: 5,
    borderColor: '#42A5F5',
    backgroundColor: '#E3F2FD',
    elevation: 20,
    overflow: 'hidden',
  },

  text: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    backgroundColor: '#42A5F5',
    height: '38.9%',
    paddingTop: 20,
    color: 'white',
    elevation: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#42A5F5',
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
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
  images: {
    width: '85%',
    height: '40%',
    alignSelf: 'center',
    borderWidth: 0.5,
  },
});
