import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  AsyncStorage,
  DrawerLayoutAndroid,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../dashboard/menu';

class ScoreAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentId: '',
      assignmentId: '',
      score: '',
      remarks: '',
    };
  }

  componentDidMount() {
    this.getScoreParams();
  }

  handlechange = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  getScoreParams = async () => {
    const params1 = await AsyncStorage.getItem('AssignmentId');
    const parseParams1 = await JSON.parse(params1);

    const params2 = await AsyncStorage.getItem('studentId');
    const parseParams2 = await JSON.parse(params2);

    this.setState({
      studentId: parseParams2,
      assignmentId: parseParams1,
    });
  };

  scoreStudent = async () => {
    const score = await fetch(
      `http://10.211.55.11:3000/api/E_LearningLMobile/ScoreAssignment?AssignmentId=${this.state.assignmentId}&Score=${this.state.score}&studentId=${this.state.studentId}&remarks=${this.state.remarks}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonScore = await score.json();
    console.log(jsonScore, 'Scoreddddddddddasssi');
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
              onPress={() =>
                this.props.navigation.navigate('GetAssignmentSubmission')
              }>
              <View style={styles.navTab}>
                <MaterialIcon
                  name="keyboard-arrow-left"
                  style={{
                    // color: 'white',
                    fontSize: 35,
                  }}
                />
                <Text style={styles.eAssignText}>Assigment List</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <Text style={styles.dashboardText}>Welcome to Admin Dashboard</Text> */}
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <View style={styles.scoreView}>
              <Text style={styles.textScore}>Score</Text>
              <TextInput
                onChangeText={this.handlechange('score')}
                name="score"
                placeholder="30"
                value={this.state.score}
                style={styles.scoring}
              />
            </View>

            <View style={styles.scoreView}>
              <Text style={styles.textScore}>Remarks</Text>
              <TextInput
                onChangeText={this.handlechange('remarks')}
                name="remarks"
                value={this.state.remarks}
                placeholder="Very good"
                style={styles.remarking}
              />
            </View>

            <TouchableWithoutFeedback
              style={styles.publish}
              onPress={() => this.scoreStudent()}>
              <Text style={styles.publishText}>Publish Score</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

export default ScoreAssignment;

const styles = StyleSheet.create({
  scoring: {
    borderWidth: 0.5,
    height: 40,
    marginTop: 5,
    borderRadius: 5,
    borderColor: '#E5E5E5',
  },
  remarking: {
    borderWidth: 0.5,
    height: 40,
    marginTop: 5,
    borderRadius: 5,
    borderColor: '#E5E5E5',
  },
  scoreView: {
    marginTop: '8%',
  },
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#42A5F5',
    height: '70%',
    padding: 10,
    borderRadius: 10,
  },
  publish: {
    width: '100%',
    backgroundColor: '#42A5F5',
    height: 35,
    borderRadius: 50,
    marginTop: '30%',
  },
  publishText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#fff',
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
  Dashboard: {
    height: '15%',
    backgroundColor: '#fff',
    // borderBottomLeftRadius: 50,
    // borderBottomRightRadius: 50,
    // borderWidth: 0.5,
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
  textScore: {
    fontFamily: 'Comfortaa-VariableFont_wght',
  },
});
