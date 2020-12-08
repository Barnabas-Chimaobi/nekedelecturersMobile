/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Login from './src/components/login/login';
import AppContainer from './src/appContainer/appContainer';
import Dashboard from './src/components/dashboard/dashboard';
import AddTopic from './src/components/addtopic/addTopic';

AppRegistry.registerComponent(appName, () => AppContainer);