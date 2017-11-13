import Sound from 'react-native-sound';

Sound.setCategory('Playback');

var ping = new Sound('ping.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  console.log('duration in seconds: ' + ping.getDuration());
});

function playSound() {
  ping.play(success => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
      ping.reset();
    }
  });
}

export default { playSound };
