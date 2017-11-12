import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Icon, Row, Text, View } from '@shoutem/ui';
import Touchable from 'react-native-platform-touchable';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  render() {
    const { settings } = this.props.screenProps.appState;
    return (
      <View>
        <Row styleName="small">
          <Text>Play Sound on Filler Word</Text>
          <Switch
            onValueChange={value => this._updatePlaySound(value)}
            value={settings.playSound}
          />
        </Row>
        <Touchable
          style={styles.option}
          background={Touchable.Ripple('#ccc', false)}
          onPress={() => {
            this._handlePressCustomize();
          }}>
          <Row styleName="small">
            <Text>Customize Filler Words</Text>
            <Icon styleName="disclosure" name="right-arrow" />
          </Row>
        </Touchable>
      </View>
    );
  }

  _updatePlaySound(value) {
    console.log('Toggle value: ', value);
    const { settings } = this.props.screenProps.appState;
    this.props.screenProps.setAppState({
      settings: {
        ...settings,
        playSound: value
      }
    });
  }

  _handlePressCustomize() {
    this.props.navigation.navigate('FillerWords');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED'
  }
});
