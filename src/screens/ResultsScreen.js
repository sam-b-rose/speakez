import React from 'react';
import { Alert, Button, ScrollView, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Icon, Row, Text } from '@shoutem/ui';
import Touchable from 'react-native-platform-touchable';

import Colors from '../constants/Colors';
import storage from '../services/storage';

export default class ResultsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Results',
      headerRight: (
        <Button
          title="Delete"
          onPress={params.deleteConfirm ? params.deleteConfirm : () => null}
        />
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      deleteConfirm: this._deleteConfirm.bind(this)
    });
  }

  render() {
    const { results, transcript } = this.props.navigation.state.params;
    return (
      <ScrollView style={styles.container}>
        {Object.keys(results).map(key => {
          const { display, label, details } = results[key];
          return (
            <Touchable
              key={key}
              style={styles.option}
              background={Touchable.Ripple('#ccc', false)}
              onPress={() => {
                this._handlePressMetric(results[key], transcript);
              }}>
              <Row styleName="small">
                <Text style={StyleSheet.flatten(styles.resultLabel)}>
                  {label}
                </Text>
                <Text
                  style={StyleSheet.flatten([
                    styles.resultValue,
                    styles.accentText
                  ])}>
                  {display}
                </Text>
                {details && <Icon styleName="disclosure" name="right-arrow" />}
              </Row>
            </Touchable>
          );
        })}
      </ScrollView>
    );
  }

  _deleteConfirm() {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => this._deleteResults(),
          style: 'destructive'
        }
      ]
    );
  }

  async _deleteResults() {
    const { index } = this.props.navigation.state.params;
    const recordings = await storage.remove(index);
    this.props.screenProps.setAppState({ recordings });

    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  _handlePressMetric(metric, transcript) {
    if (!metric.details) return;
    this.props.navigation.navigate('Metric', { ...metric, transcript });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED'
  },
  resultLabel: {
    flex: 1
  },
  resultValue: {
    flex: 3
  },
  accentText: {
    color: Colors.tintColor
  }
});
