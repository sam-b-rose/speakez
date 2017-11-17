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
import Voice from 'react-native-voice';

import Colors from '../constants/Colors';
import mock from '../data/recording';
import sound from '../services/sound';
import storage from '../services/storage';

export default class RecordScreen extends React.Component {
  constructor(props) {
    super(props);
    Voice.onSpeechResults = this._onSpeechResults.bind(this);
  }
  static navigationOptions = {
    header: null
  };

  state = {
    timer: null,
    startTime: null,
    currentTime: 0,
    isRecording: false,
    fillerRegEx: null,
    transcript: '',
    fillers: {},
    displayText: ''
  };

  render() {
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
          <Text style={styles.promptText}>
            {this.state.isRecording ? (
              this.state.displayText
            ) : (
              'Tap the mic to start recording.'
            )}
          </Text>
        </View>
      </View>
    );
  }

  handlePressSettings() {
    this.props.navigation.navigate('Settings');
  }

  handleRecordPress(isRecording) {
    this.setState({
      isRecording,
      startTime: new Date()
    });

    this._toggleTimer();
    this._toggleSpeech();

    if (!isRecording) this._addRecording();
  }

  _toggleTimer() {
    if (this.state.isRecording) {
      clearInterval(this.state.timer);
    } else {
      this._buildRegEx();
      this.setState({ currentTime: 0 });
      this.state.timer = setInterval(() => {
        current = new Date() - this.state.startTime;
        this.setState({ currentTime: Math.floor(current / 1000) });
      }, 1000);
    }
  }

  _toggleSpeech() {
    if (this.state.isRecording) {
      Voice.stop();
    } else {
      this.setState({ transcript: '', fillers: {} });
      Voice.start('en');
    }
  }

  _addRecording = async () => {
    const rec = mock.createRecording({
      created: this.state.startTime,
      transcript: this.state.transcript,
      fillers: this.state.fillers
    });
    console.log('New Rec: ', rec);
    const newRecs = await storage.add(rec);
    const { recordings } = this.props.screenProps.appState;
    this.props.screenProps.setAppState({
      recordings: newRecs
    });
    this.setState({ transcript: '', fillers: {} });
  };

  _buildRegEx() {
    const { fillerWords } = this.props.screenProps.appState.settings;
    const fillerRegEx = new RegExp(
      `\\b${fillerWords.join('\\b|\\b')}\\b`,
      'ig'
    );
    this.setState({ fillerRegEx });
  }

  _onSpeechResults({ value }) {
    const text = value.shift();
    const isPlaySound = this.props.screenProps.appState.settings.playSound;

    if (!text) return;
    if (isPlaySound) {
      const endIdx = this.state.transcript.length;
      const diff = text.substring(endIdx);
      if (diff.search(this.state.fillerRegEx) != -1) {
        sound.playSound();
        const matches =  diff.match(this.state.fillerRegEx);
        if (matches) {
          matches.forEach((filler) => {
            if (!this.state.fillers[filler]) this.state.fillers[filler] = 0;
            this.state.fillers[filler] += 1;
          });
        }
      }
    }

    this.setState({
      transcript: text,
      displayText: text.substring(text.length - 30),
    });
  }
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
    position: 'absolute',
    top: 35,
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
    position: 'absolute',
    bottom: 50,
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
