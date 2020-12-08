//Menu.js
// /components/Menu.js
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Menu = (props) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    getPersonDetails();
  });

  const getPersonDetails = async () => {
    const user = await AsyncStorage.getItem('personDetails');
    const getUser = JSON.parse(user);
    setUserName(getUser.FullName);
    setEmail(getUser.Email);
    console.log(getUser, 'USERRRRRRR');
  };

  let [loading, setLoading] = useState(false);

  const signOut = () => {
    // Alert.alert("You Are Logged Out")
    props.navigation.navigate('Logout');
    // AsyncStorage.clear();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Alert.alert('Oops!');
    }, 3000);
  };

  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      //   style={styles.imageBackground}
      source={require('../../assets/nekede.jpg')}>
      <View style={styles.Menucontainer}>
        <ScrollView>
          <View>
            {/* <Image style={styles.profileImage} source={{uri: ImageFileUrl}} /> */}
            <Text
              style={{
                alignSelf: 'flex-start',
                marginTop: 10,
                color: 'white',
                marginLeft: 20,
                fontFamily: 'Comfortaa-VariableFont_wght',
                fontSize: 15,
              }}>
              {userName}
            </Text>

            <Text
              style={{
                alignSelf: 'flex-start',
                margin: 5,
                color: '#000000',
                marginLeft: 20,
                borderWidth: 1,
                borderColor: '#fbcbce',
                backgroundColor: '#fbcbce',
                padding: 5,
                borderRadius: 5,
                marginBottom: 20,
                fontFamily: 'Comfortaa-VariableFont_wght',
                fontSize: 12,
              }}>
              {email}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#42A5F5',
              width: '100%',
              marginBottom: 5,
            }}
          />
          <View style={styles.board}>
            <View style={styles.eachIcon}>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.navigation.navigate('Dashboard'), props.closeDrawer();
                }}>
                <View>
                  <MaterialIcons
                    name="contact-mail"
                    size={20}
                    color="#42A5F5"
                    style={styles.icon}
                  />
                  <Text style={styles.boardText}>Dashboard</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.eachIcon}>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.navigation.navigate('Eassignment'), props.closeDrawer();
                }}>
                <View>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color="#42A5F5"
                    style={styles.icon}
                  />
                  <Text style={styles.boardText}>E-Assignment</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.eachIcon}>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.navigation.navigate('EContent'), props.closeDrawer();
                }}>
                <View>
                  <MaterialIcons
                    name="notifications"
                    size={20}
                    color="#42A5F5"
                    style={styles.icon}
                  />
                  <Text style={styles.boardText}>E-Contents</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            {/* <View style={styles.eachIcon}>
              <MaterialIcons
                name="contact-mail"
                size={20}
                color="#42A5F5"
                style={styles.icon}
              />
              <Text style={styles.boardText}>Profile</Text>
            </View> */}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableWithoutFeedback
            onPress={() => {
              signOut();
              props.closeDrawer();
            }}>
            <View>
              <MaterialIcons
                name="vpn-key"
                size={20}
                color=""
                style={styles.key}
              />
              <Text style={styles.signout}>Sign Out</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Menu;

const styles = StyleSheet.create({
  Menucontainer: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
  },
  board: {
    // marginLeft: 'auto',
    // marginRight: 'auto',
    // borderColor: 'white',
    // borderStyle: 'solid',
    height: 450,
    width: 350,
    marginTop: 20,
  },
  boardText: {
    fontSize: 13,
    marginLeft: 20,
    marginTop: -20,
    marginLeft: 70,
    color: 'white',
  },
  signout: {
    fontSize: 14,
    marginLeft: 20,
    marginTop: -20,
    marginLeft: 70,
    color: '#000000',
  },
  icon: {
    marginTop: 2,
    marginLeft: 20,
  },
  key: {
    paddingTop: 15,
    marginLeft: 20,
  },
  eachIcon: {
    borderBottomColor: 'lightgrey',
    paddingBottom: 7,
    marginTop: 20,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderColor: '#28EB53',
    alignSelf: 'flex-start',
    borderWidth: 3,
    borderRadius: 100,
    marginTop: 40,
    marginLeft: 15,
  },
  footer: {
    borderBottomColor: 'lightgrey',
    paddingBottom: 7,
    marginTop: 20,
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#42A5F5',
  },
});
