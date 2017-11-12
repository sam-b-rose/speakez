import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Colors from '../constants/Colors';
import storage from '../services/storage';
import mock from '../data/recording';
import sound from '../services/sound';

import Voice from 'react-native-voice';

export default class RecordScreen extends React.Component {
  constructor(props) {
    super(props);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }
  static navigationOptions = {
    header: null
  };

  state = {
    timer: null,
    startTime: null,
    currentTime: 0,
    isRecording: false,
    transcript: ''
  };

  render() {
    const { settings } = this.props.screenProps;
    const minutes = Math.floor(this.state.currentTime / 60);
    const seconds = this.state.currentTime % 60;
    const minStr = minutes.toFixed(0).toString();
    const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return (
      <View style={styles.container}>
        <Touchable
          style={styles.settingsContainer}
          onPress={() => {
            this.handlePressSettings();
          }}>
          <FontAwesome name={'gear'} size={24} style={styles.settingsIcon} />
        </Touchable>
        <Text style={styles.timerText}>{`${minStr}:${secStr}`}</Text>
        <Touchable
          onPress={() => {
            this.handleRecordPress(!this.state.isRecording);
          }}>
          <View style={styles.recordContainer}>
            <Ionicons
              name={this.state.isRecording ? 'ios-pause' : 'ios-mic'}
              size={64}
              style={styles.recordText}
            />
          </View>
        </Touchable>

        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>Tap the mic to start recording.</Text>
        </View>
        <Button onPress={this.onSoundButton} title="Let there be sound!" />
        <ScrollView>
          <Text>{this.state.transcript}</Text>
        </ScrollView>
      </View>
    );
  }

  onSoundButton() {
    sound.playSound();
  }

  onSpeechResults(event) {
    this.setState({
      transcript: event.value
    });
  }

  toggleSpeech() {
    if (this.state.isRecording) {
      Voice.stop();
    } else {
      this.setState({ transcript: '' });
      Voice.start('en');
    }
  }

  handleRecordPress(recording) {
    this.setState({ isRecording: recording });
    this.setState({ startTime: new Date() });
    this.toggleTimer();
    this.toggleSpeech();
    if (!recording) this._addRecording();
  }

  handlePressSettings() {
    this.props.navigation.navigate('Settings');
  }

  toggleTimer() {
    if (this.state.isRecording) {
      clearInterval(this.state.timer);
    } else {
      this.setState({ currentTime: 0 });
      this.state.timer = setInterval(() => {
        current = new Date() - this.state.startTime;
        this.setState({ currentTime: Math.floor(current / 1000) });
      }, 1000);
    }
  }

  _addRecording = async () => {
    const rec = mock.generateRecording();
    const newRecs = await storage.add(rec);
    const { recordings } = this.props.screenProps.appState;
    this.props.screenProps.setAppState({
      recordings: newRecs
    });
  };
}

const lightTextColor = 'rgba(96,100,109, 1)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  settingsContainer: {
    position: 'absolute',
    top: 35,
    right: 15
  },
  settingsIcon: {
    color: lightTextColor,
    backgroundColor: 'transparent'
  },
  timerText: {
    fontSize: 42,
    fontWeight: '100'
  },
  recordContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
    width: 100,
    height: 100,
    backgroundColor: Colors.tintColor,
    borderRadius: 100
  },
  recordText: {
    color: '#fff',
    lineHeight: 100,
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  promptContainer: {
    alignItems: 'center',
    margin: 50
  },
  promptText: {
    fontSize: 17,
    color: lightTextColor,
    lineHeight: 24,
    textAlign: 'center'
  }
});
