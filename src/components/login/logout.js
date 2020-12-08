import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableWithoutFeedback,
  AsyncStorage,
  Button,
} from 'react-native';

export default function App(props) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    Alert.alert('Exit', 'Exiting Application?', [
      {
        text: 'Cancel',
        onPress: () => {
          props.navigation.navigate('Dashboard');
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          BackHandler.exitApp();
          AsyncStorage.clear();
        },
      },
    ]);
    BackHandler.exitApp;
    return true;
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}> You Are About Logging out of this App </Text>
        <Text style={{textAlign: 'center', margin: 5}}>
          When logged out, you will need to sign in again in order to Continue
          using all features of this app
        </Text>
        <View
          style={{
            marginTop: 15,
            backgroundColor: '#1F88E5',
            marginLeft: '30%',
            marginRight: '30%',
            height: 40,
            elevation: 10,
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              backAction();
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 18,
                paddingTop: 7,
              }}>
              Proceed
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFE9DA',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
