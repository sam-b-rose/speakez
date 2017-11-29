import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import HighlightedText from '../components/HighlightText';
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
    bufferPos: 0,
    displayText: [],
    transcript: [],
    fillers: {},
  };

  render() {
    const minutes = Math.floor(this.state.currentTime / 60);
    const seconds = this.state.currentTime % 60;
    const minStr = minutes.toFixed(0).toString();
    const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const fillerCount = Object.keys(this.state.fillers).reduce((count, word) => {
      return count + this.state.fillers[word];
    }, 0);
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
        <Text style={styles.fillerCount}>TOTAL {fillerCount}</Text>
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
          <HighlightedText style={styles.promptText}>
            {this.state.isRecording ? (
              this.state.displayText
            ) : (
              ['Tap the mic to start recording.']
            )}
          </HighlightedText>
        </View>
      </View>
    );
  }

  handlePressSettings() {
    this.props.navigation.navigate('Settings');
  }

  handleRecordPress(isRecording) {
    this.setState({
      isRecording
    }, () => this._startOrStop());
  }

  _startOrStop() {
    this._toggleTimer();
    this._toggleSpeech();
    this._addRecording();
  }

  _toggleTimer() {
    if (!this.state.isRecording) {
      clearInterval(this.state.timer);
      return;
    }

    this._buildRegEx();
    this.setState({ currentTime: 0 });
    this.state.timer = setInterval(() => {
      current = new Date() - this.state.startTime;
      this.setState({ currentTime: Math.floor(current / 1000) });
    }, 1000);
  }

  _toggleSpeech() {
    if (this.state.isRecording) {
      this.setState({
        fillers: {},
        bufferPos: 0,
        transcript: [],
        displayText: [],
        startTime: new Date(),
      }, () => Voice.start('en'));
    } else {
      Voice.stop();
    }
  }

  _addRecording = async () => {
    if (this.state.isRecording) return;
    const { startTime, transcript, lastBuffer, fillers } = this.state;
    const fullTrans = transcript.concat([lastBuffer.trim()]);
    const rec = mock.createRecording({
      fillers,
      created: startTime,
      transcript: fullTrans,
    });
    const updatedRecs = await storage.add(rec);
    this.props.screenProps.setAppState({
      recordings: updatedRecs
    });
  };

  _buildRegEx() {
    const { fillerWords } = this.props.screenProps.appState.settings;
    const fillerRegEx = new RegExp(
      `\\b${fillerWords.join('\\b|\\b')}\\b`, 'i'
    );
    this.setState({ fillerRegEx });
  }

  _incFillerCount(filler) {
    if (!this.state.fillers[filler]) this.state.fillers[filler] = 0;
    this.state.fillers[filler] += 1;
  }

  _onSpeechResults({ value }) {
    const text = value.shift();
    const isPlaySound = this.props.screenProps.appState.settings.playSound;

    if (!text || !this.state.isRecording) return;
    const clip = text.substring(this.state.bufferPos)
    const phraseBuffer = clip.substring(clip.indexOf(' '));
    const matches =  phraseBuffer.match(this.state.fillerRegEx);

    this.setState({
      lastBuffer: phraseBuffer,
      displayText: [clip.substring(text.length - 30)],
    });

    if (!matches) return;
    const filler = matches[0];
    const prevText = phraseBuffer.substring(0, matches.index);
    const transcript = this.state.transcript.concat([prevText.trim(), filler]);

    this._incFillerCount(filler)
    this.setState({
      transcript,
      bufferPos: this.state.bufferPos + matches.index + filler.length,
    });
    if (isPlaySound) sound.playSound();
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
  fillerCount: {
    position: 'absolute',
    top: 90,
    fontSize: 16,
    fontWeight: '300'
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
