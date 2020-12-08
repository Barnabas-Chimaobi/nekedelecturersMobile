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
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

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
          `http://10.211.55.11:3000/api/E_LearningLMobile/LoginLecturer?UserName=${this.state.username}&Password=${this.state.password}`,
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

        if (loggedIn.OutPut == null) {
          alert('incorrect username or password');
        } else {
          this.props.navigation.navigate('Dashboard');
        }
      } else {
        alert('please supply username and password');
      }
    } catch (err) {
      throw err;
    }
  };
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
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
              <View style={styles.buttonView}>
                <TouchableWithoutFeedback onPress={this.handleSubmit}>
                  <Text style={styles.login}>Login</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    marginTop: -50,
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
    borderWidth: 0.5,
    width: '90%',
    backgroundColor: '#0982B8',
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  login: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  label: {
    marginLeft: 10,
  },
  topbox: {
    height: '30%',
    backgroundColor: '#E3F2FD',
  },
  // loginContainer: {
  //   height: '70%',
  // },
});
