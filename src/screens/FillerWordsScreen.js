import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, Row, Text, TextInput } from '@shoutem/ui';
import Colors from '../constants/Colors';
import Touchable from 'react-native-platform-touchable';

export default class FillerWordsScreen extends React.Component {
  static navigationOptions = {
    title: 'Filler Words'
  };

  state = {
    newFillerWord: null
  };

  render() {
    const { fillerWords } = this.props.screenProps.appState.settings;
    return (
      <ScrollView style={styles.container}>
        <Row styleName="small">
          <TextInput
            style={StyleSheet.flatten(styles.addNewTextInput)}
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={40}
            placeholder={'New filler word'}
            value={this.state.newFillerWord}
            onChangeText={text => this.setState({ newFillerWord: text })}
          />
          <Touchable
            onPress={() => this._addFillerWord(this.state.newFillerWord)}>
            <Icon
              styleName="disclosure"
              style={StyleSheet.flatten(styles.addNewBtn)}
              name="plus-button"
            />
          </Touchable>
        </Row>
        {fillerWords.map(this._renderWord.bind(this))}
      </ScrollView>
    );
  }

  _renderWord(fillerWord, index) {
    return (
      <View key={index} style={styles.fillerWord}>
        <Text style={StyleSheet.flatten(styles.fillerWordText)}>
          {fillerWord}
        </Text>
        <Button
          style={StyleSheet.flatten(styles.removeFillerWord)}
          onPress={() => this._removeFillerWord(index)}>
          <Icon
            style={StyleSheet.flatten(styles.removeFillerWordIcon)}
            name="close"
          />
        </Button>
      </View>
    );
  }

  _addFillerWord(value) {
    if (!value) return;
    const { fillerWords } = this.props.screenProps.appState.settings;
    const newfillerWords =
      fillerWords.indexOf(value) != -1
        ? fillerWords
        : [value.toLowerCase()].concat(fillerWords);
    this._updateFillerWords(newfillerWords);
    this.setState({ newFillerWord: null });
  }

  _removeFillerWord(index) {
    const { fillerWords } = this.props.screenProps.appState.settings;
    fillerWords.splice(index, 1);
    this._updateFillerWords(fillerWords);
  }

  _updateFillerWords(value) {
    const { settings } = this.props.screenProps.appState;
    this.props.screenProps.setAppState({
      settings: {
        ...settings,
        fillerWords: value
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  addNewTextInput: {
    flex: 1
  },
  addNewBtn: {
    width: 50,
    flex: 0,
    margin: 10,
    padding: 20,
    fontSize: 28
  },
  fillerWord: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    paddingLeft: 30,
    paddingRight: 0,
    height: 70,
    backgroundColor: '#60A9D7',
    borderRadius: 100
  },
  fillerWordText: {
    color: '#fff'
  },
  removeFillerWord: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.tintColor,
    borderWidth: 1,
    borderRadius: 100,
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeFillerWordIcon: {
    lineHeight: 50,
    width: 50,
    color: '#fff',
    textAlign: 'center'
  }
});
