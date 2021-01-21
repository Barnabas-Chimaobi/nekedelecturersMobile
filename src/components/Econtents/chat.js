import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Picker,
  TouchableWithoutFeedback,
  TextInput,
  AsyncStorage,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import API from '../../../global';

const Chat = (props) => {
  let [Input, setInput] = useState('');
  let [DateOfChat, setDateOfChat] = useState('');
  const [isEnter, setIsEnter] = useState([]);
  const [usersId, setUserId] = useState('');
  const [allocId, setAllocId] = useState('');

  //   const getCredentials = async () => {
  //     const allocationId = await AsyncStorage.getItem('courseDetails');
  //     const gottenId = await JSON.parse(allocationId);
  //     const Id = gottenId.map((item) => {
  //       return item.allocId;
  //     });
  //     // console.log(Id, 'SSSSSSSSSSSSSSS');
  //     setAllocId(Id);
  //     console.log(allocId, 'ALLOCIIDDD');

  //     const personId = await AsyncStorage.getItem('personDetails');
  //     const gottenPersonId = await JSON.parse(personId);
  //     // console.log(gottenPersonId.Id, 'SSSSSSSSSSSSSSS');
  //     setUserId(gottenPersonId.Id);
  //     console.log(usersId, 'USERSIDDDDD');
  //   };

  const {state, setParams, navigate} = props.navigation;
  const params = state.params || {};

  const PersonId = params.uId;
  // const CourseAllo = params.courses.map((c) => {
  //   return {
  //     CourseAllocationId: c.CourseAllocationId,
  //     CourseCode: c.CourseCode,
  //     CourseId: c.CourseId,
  //     CourseName: c.CourseName,
  //   };
  // });
  const sampleCourseAllocation = params.cAllocId;

  const loadChatMessages = async () => {
    const response = await fetch(
      `${API.BASE_URL}/AjaxLoadChatBoard?courseAllocationId=${sampleCourseAllocation}&UserId=${PersonId}`,
      {method: 'GET'},
    );

    const jsonResponse = await response.json();
    console.log(jsonResponse, 'RESPIONSEESSSS');

    setIsEnter(jsonResponse.Output);
    // console.log(isEnter, 'isEnterererrrrr');
  };

  const onSend = async () => {
    //const [a, ...b] = newMessages;
    const response = await fetch(
      `${API.BASE_URL}/SaveChatResponse?courseAllocationId=${sampleCourseAllocation}&response=${Input}&UserId=${PersonId}`,
      {method: 'Post'},
    );

    const data = await response.json();

    await loadChatMessages();

    console.log(response, ':CHATTTT');
    console.log(Input, ': CHATTTT');

    setInput('');

    //setMessages(GiftedChat.append(isEnter, newMessages, true));
  };

  const myAsync = async () => {
    // await getCredentials();
    await loadChatMessages();
  };

  const myAsync1 = () => {
    setInterval(async () => await loadChatMessages(), 15000);
    // setInterval(async () => await getCredentials(), 15000);
  };

  useEffect(() => {
    myAsync();
    // getCredentials();

    const date = new Date();
    const chatDate = date.toDateString();
    setDateOfChat(chatDate);

    myAsync1();
    // testNotification()
    const interval = setInterval(() => {
      // testNotification()
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* <ScrollView> */}
      <View style={styles.chatNav}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('AllocatedCourseContent');
          }}>
          <MaterialIcon
            name="keyboard-arrow-left"
            size={35}
            style={{paddingLeft: '-20%'}}
          />
        </TouchableWithoutFeedback>
        <Text style={styles.notification}>Discussion</Text>
      </View>
      <View style={styles.subContainer}>
        <ScrollView>
          <Text style={{color: '#000000', textAlign: 'center'}}>
            {DateOfChat}
          </Text>
          {isEnter?.length >= 0 ? (
            isEnter.map((message, index) => {
              const apiDate = new Date(message.DateSent);
              var hours = apiDate.getHours() - 1;
              var minutes = apiDate.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0' + minutes : minutes;
              var strTime = hours + ':' + minutes + ' ' + ampm;

              let time = new Date(message.DateSent);
              let times = time.toDateString();
              let stripDay = times.substring(3, times.length);

              DateOfChat = `${stripDay} ${strTime}`;
              return (
                <View>
                  {!message.ActiveSender ? (
                    <View style={styles.notificationContainer}>
                      <View
                        style={{
                          marginTop: -5,
                          display: 'flex',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={
                            {
                              // display: 'flex',
                              // flexDirection: 'row',
                              // justifyContent: 'space-between',
                              // width: '100%',
                            }
                          }>
                          <Text
                            style={{
                              fontFamily: 'Castoro-Regular',
                              fontSize: 12,
                            }}>
                            {message.Response}
                          </Text>
                          <View style={styles.text}>
                            <Text
                              style={{
                                flexDirection: 'row',
                                width: '70%',
                                marginTop: 3,
                              }}>
                              <Text style={styles.name}>
                                {message.DateOfChat}
                              </Text>
                              {/* <Text> </Text> */}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={{
                            fontFamily: 'Castoro-Regular',
                            fontSize: 12,
                            marginLeft: 30,
                          }}>
                          4: 00
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.notificationContainer1}>
                      {/* <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../asset/ballroom.png')}
              /> */}
                      <View
                        style={{
                          marginTop: -5,
                          display: 'flex',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={
                            {
                              // display: 'flex',
                              // flexDirection: 'row',
                              // justifyContent: 'space-between',
                              // width: '100%',
                            }
                          }>
                          <Text
                            style={{
                              fontFamily: 'Comfortaa-VariableFont_wght',
                              fontSize: 12,
                            }}>
                            {message.Sender}
                          </Text>
                          <View style={styles.text}>
                            <Text
                              style={{
                                flexDirection: 'row',
                                width: '70%',
                                marginTop: 3,
                              }}>
                              <Text style={styles.name}>
                                {message.Response}
                              </Text>
                              <Text style={styles.name}>{DateOfChat}</Text>

                              {/* <Text> </Text> */}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={{
                            fontFamily: 'Castoro-Regular',
                            fontSize: 12,
                            marginLeft: 30,
                          }}>
                          4: 00
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View>
              <Text>No messages to display</Text>
            </View>
          )}
        </ScrollView>
      </View>
      {/* </ScrollView> */}
      <View style={styles.floatingView}>
        <View style={styles.textInput}>
          <TextInput
            placeholder="start your chat"
            onChangeText={(text) => setInput(text)}
            value={Input}
            clearTextOnFocus={true}
            multiline={true}
          />
        </View>
        <View style={styles.sendIconView}>
          <TouchableWithoutFeedback
            onPress={() => {
              onSend();
            }}>
            <Image
              style={styles.floating}
              source={require('../../assets/sendicon.png')}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  notification: {
    // textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
    marginTop: 5,
    marginLeft: '28%',
  },

  container: {
    backgroundColor: '#F2F1F1',
    flex: 1,
    // height: '100%',
  },
  subContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    // alignSelf: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    // height: 580,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  image: {
    borderRadius: 50,
    marginRight: 10,
    height: 48,
    width: 48,
  },
  notificationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 25,
    width: '75%',
    backgroundColor: '#E3D6F3',
    padding: 8,
    height: 45,
    borderRadius: 5,
  },
  notificationContainer1: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 25,
    width: '75%',
    backgroundColor: '#E5E5E5',
    padding: 8,
    height: 45,
    borderRadius: 5,
  },
  linethrough: {
    borderWidth: 0.3,
    // borderColor: '#EEEEEE',
  },
  text: {
    height: 45,
    marginTop: -5,
  },
  name: {
    // paddingRight: 5,
    // fontFamily: 'Poppins-SemiBold',
    // fontSize: 13,
    width: 170,
    fontSize: 11,
  },
  follow: {
    fontFamily: 'Poppins-Light',
    fontSize: 10,
    paddingLeft: 5,
  },
  time: {
    fontFamily: 'Poppins-Light',
    fontSize: 11,
  },
  dateView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: '-5%',
    marginTop: 20,
    marginRight: '-5%',
  },
  prevDateView: {
    // height: 50,
    // width: 55,
  },
  prevDateText: {
    textAlign: 'center',
    width: 42,
    height: 42,
    paddingTop: 50,
    marginLeft: -10,
  },
  nextDateView: {
    backgroundColor: '#F3F3F3',
    height: 20,
    width: 20,
    borderWidth: 0.5,
    borderColor: '#F2F1F1',
    borderRadius: 5,
    marginTop: 15,
  },
  nextDateText: {
    textAlign: 'center',
    width: 18,
    height: 18,
  },
  currentDateView: {
    height: 50,
    width: '50%',
    marginTop: -15,
    marginLeft: -50,
  },
  currentDateText: {
    // textAlign: 'center',
    paddingTop: 15,
    // marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  calender: {
    height: 12,
    width: 12,
    marginLeft: 20,
  },
  pickerView: {
    width: '40%',
    height: 35,
    marginTop: -15,
  },
  calenderView: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  floatingView: {
    display: 'flex',
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 90,
    // flex: 1,
    // right: 15,
    // marginLeft: '10%',
    // marginRight: '5%',
    marginBottom: 5,
    width: '95%',
    alignSelf: 'center',
  },
  chatNav: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
  },
  linethrough1: {
    borderWidth: 0.2,
    marginTop: 10,
  },
  textInput: {
    width: '83%',
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    height: 35,
  },
  floating: {
    width: 35,
    height: 20,
    marginTop: 8,
    alignSelf: 'center',
  },
  sendIconView: {
    width: '12%',
    backgroundColor: '#E5E5E5',
    marginLeft: '5%',
    borderRadius: 50,
    height: 40,
    marginTop: -3,
  },
});
