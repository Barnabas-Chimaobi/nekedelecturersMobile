import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../../global';

// import {AsyncStorage} from 'AsyncStorage';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      logArray: [],
      showIndicator: false,
    };
  }

  handleChange = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  onButtonPress = () => {
    if (this.state.password !== '' && this.state.username !== '') {
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

  handleSubmit = async () => {
    try {
      if (this.state.username !== '' && this.state.password !== '') {
        const Logs = await fetch(
          `${API.BASE_URL}LoginLecturer?UserName=${this.state.username}&Password=${this.state.password}`,
        );

        const loggedIn = await Logs.json();

        const {Username, Password, Email, Id} = loggedIn.OutPut;

        const {
          FirstName,
          LastName,
          OtherName,
          FullName,
          ImageFileUrl,
        } = loggedIn.OutPut.person;

        const personDetails = {
          Username,
          Password,
          Email,
          FirstName,
          LastName,
          OtherName,
          FullName,
          ImageFileUrl,
          Id,
        };
        this.setState({
          showIndicator: false,
        });
        AsyncStorage.setItem('personDetails', JSON.stringify(personDetails));

        console.log(loggedIn, 'GREATE');
        console.log(personDetails, 'PersonDetails');

        this.props.navigation.navigate('Dashboard');
      } else {
        Alert.alert('Incorrect User details');
      }
    } catch (err) {
      if (err) {
        console.log(err);
        this.setState({
          showIndicator: false,
        });
        alert('Incorrect Username or Password');
      }
      // throw err;
    }
  };
  render() {
    return (
      <View style={styles.parentContainer}>
        <Spinner
          color={'blue'}
          //visibility of Overlay Loading Spinner
          visible={this.state.showIndicator}
          //Text with the Spinner
          textContent={'Logging in...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView>
          <View style={styles.topbox}></View>
          <View style={styles.loginContainer}>
            <Image
              source={require('../../assets/nekedelogo.png')}
              style={styles.schoologo}
            />
            <Text style={styles.label}>Username</Text>
            <TextInput
              onChangeText={this.handleChange('username')}
              value={this.state.username}
              name="username"
              style={styles.input}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={this.handleChange('password')}
              value={this.state.password}
              name="password"
              style={styles.input1}
            />
            <View style={styles.buttonView}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.handleSubmit();
                  this.onButtonPress();
                }}>
                <Text style={styles.login}>Login</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  schoologo: {
    resizeMode: 'contain',
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginTop: -95,
    marginBottom: 50,
  },

  input: {
    borderWidth: 0.5,
    margin: 10,
    height: 40,
    borderColor: '#071b51',
    borderRadius: 5,
    marginBottom: 20,
  },
  input1: {
    borderWidth: 0.5,
    margin: 10,
    height: 40,
    borderColor: '#071b51',
    borderRadius: 5,
  },
  buttonView: {
    alignSelf: 'center',
    marginTop: 50,
    width: '60%',
    backgroundColor: '#42A5F5',
    marginBottom: 70,
    borderRadius: 10,
  },
  login: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  label: {
    marginLeft: 10,
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  topbox: {
    height: 150,
    backgroundColor: '#E3F2FD',
  },
  loginContainer: {
    flex: 1,
    borderWidth: 0.5,
    marginTop: 40,
    width: '80%',
    alignSelf: 'center',
    borderColor: '#42A5F5',
    borderRadius: 5,
  },
});
