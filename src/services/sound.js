import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const ping = new Sound('ping.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) console.error('failed to load the sound', error);
});

function playSound() {
    ping.stop(() => {
      ping.play((success) => { if (!success) ping.reset(); });
    })
}

export default { playSound };
