import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../components/login/login';
import Dashboard from '../components/dashboard/dashboard';
import Eassignment from '../components/Eassignment/eassignment';
import AllocatedCourses from '../components/allocatedcourses/allocatedCourses';
import AddTopic from '../components/addtopic/addTopic';
import Splash from '../components/spalsh/splash';
import GivenAssignments from '../components/assignment/givenAssignment';
import EContent from '../components/Econtents/eContent';
import AllocatedCourseContent from '../components/Econtents/allocatedCourseContent';
import AddContent from '../components/Econtents/addContent';
import CreateAssignment from '../components/assignment/createAssignment';
import EditAssignment from '../components/assignment/editAssignment';
import GetContent from '../components/Econtents/getContent';
import EditContent from '../components/Econtents/editContent';
import GetTopics from '../components/addtopic/getTopics';
import EditTopic from '../components/addtopic/editTopic';
import GetClassAttendanceList from '../components/Econtents/getClassAttendance';
import GetAssignmentSubmission from '../components/assignment/getAssignmentSubmission';
import ScoreAssignment from '../components/assignment/scoreAssignment';
import Logout from '../components/login/logout';

const AppNavigator = createStackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        headerBackground: 'red',
      },
    },
    Dashboard,
    Eassignment,
    AllocatedCourses,
    AddTopic,
    Login,
    GivenAssignments,
    EContent,
    AllocatedCourseContent,
    AddContent,
    CreateAssignment,
    EditAssignment,
    GetContent,
    EditContent,
    GetTopics,
    EditTopic,
    GetClassAttendanceList,
    GetAssignmentSubmission,
    ScoreAssignment,
    Logout,
  },

  {
    initialRouteName: 'Splash',
    headerMode: 'none',
  },
);

const appContainer = createAppContainer(AppNavigator);

export default appContainer;
