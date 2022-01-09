/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([ 'VirtualizedLists should never be nested']);
AppRegistry.registerComponent(appName, () => App);
