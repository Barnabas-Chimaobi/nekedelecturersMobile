import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Animated,
  AsyncStorage,
} from 'react-native';
import {StatusBar} from 'react-native';
// import PushNotification from "react-native-push-notification";

export default class Splash extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      username: '',
      // personDetails: null
    };
  }

  // PushNotification.localNotificationSchedule({
  //   message: "My Notification",
  //    date: new Date(Date.now() + 500 * 1000),
  // })

  componentDidMount() {
    this.logUser();

    this.animate();
    this.animates();

    setTimeout(() => {
      this.load();
    }, 4000);
  }

  logUser = async () => {
    const user = await AsyncStorage.getItem('personDetails');
    const getUser = await JSON.parse(user);
    console.log(getUser, 'USERSRRRRRR');

    this.setState({
      password: getUser?.Password,
      username: getUser?.Username,
      // PersonDetails: getUser
    });
  };

  load = () => {
    // {
    //   this.props.navigation.navigate('Login');
    // }

    return this.state.username != null ? (
      <View> {this.props.navigation.navigate('Dashboard')}</View>
    ) : (
      <View>{this.props.navigation.navigate('Login')}</View>
    );
  };

  marginTop = new Animated.Value(5);
  animatedTitle = new Animated.Value(-200);
  animatedSubtitle = new Animated.Value(600);
  animatedButton = new Animated.Value(800);

  animate = () => {
    Animated.timing(this.marginTop, {
      toValue: 400,
      duration: 900,
    }).start();
  };

  animates = () => {
    Animated.parallel([
      Animated.timing(this.animatedTitle, {
        toValue: 200,
        duration: 800,
      }),
      Animated.timing(this.animatedSubtitle, {
        toValue: 0,
        duration: 1400,
        delay: 800,
      }),
      Animated.timing(this.animatedButton, {
        toValue: 0,
        duration: 1000,
        delay: 2200,
      }),
    ]).start();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#071b51" barStyle="default" />
        <Animated.Text style={{marginTop: this.animatedTitle}}>
          Welcome
        </Animated.Text>
        <Animated.Text style={{marginLeft: this.animatedSubtitle}}>
          Thanks for visiting our app!
        </Animated.Text>
        <Animated.View style={{marginTop: this.marginTop}}>
          <Image
            source={require('../../assets/nekedelogo.png')}
            style={styles.image}
          />
        </Animated.View>

        <Animated.Text style={{marginTop: this.animatedButton}}>
          Get Started
        </Animated.Text>

        {/* {this.load()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 220,
    resizeMode: 'contain',
    marginTop: 10,
    // alignItems: "center"
  },

  container: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
