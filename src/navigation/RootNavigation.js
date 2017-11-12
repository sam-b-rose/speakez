import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import SettingsScreen from '../screens/SettingsScreen';
import FillerWordsScreen from '../screens/FillerWordsScreen';
import ResultsScreen from '../screens/ResultsScreen';
import MetricScreen from '../screens/MetricScreen';

import initialState from '../store';
import storage from '../services/storage';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    },
    Settings: {
      screen: SettingsScreen
    },
    FillerWords: {
      screen: FillerWordsScreen
    },
    Results: {
      screen: ResultsScreen
    },
    Metric: {
      screen: MetricScreen
    }
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    })
  }
);

export default class RootNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.mock = true;
  }

  componentDidMount() {
    this._loadData();
  }

  render() {
    return (
      <RootStackNavigator
        screenProps={{
          appState: this.state,
          setAppState: this.setAppState.bind(this)
        }}
      />
    );
  }

  setAppState(appState) {
    this.setState({ ...this.state, ...appState });
  }

  async _loadData() {
    const action = this.mock ? 'mock' : 'setup';
    const data = await storage[action]();
    this.setAppState({
      recordings: data
    });
  }
}
