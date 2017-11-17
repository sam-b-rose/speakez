import moment from 'moment';
import dateFns from 'date-fns';
import format from 'format-duration';

function randInt(max = 1, min = 0) {
  return Math.round(Math.random() * max) + min;
}

function generateRecording() {
  const created = moment()
    .hours(randInt(23, 0))
    .minutes(randInt(59, 0))
    .subtract(randInt(20, 1), 'days');
  const time = randInt(10, 7);
  const pace = randInt(100, 10);
  const totalWords = randInt(200, 20);
  const fillers = [...Array(5)].map(() => randInt(10, 1));
  const fillerCount = fillers.reduce((a, b) => a + b, 0);
  return {
    created,
    transcript:
      'A few weeks ago, um I met a CMO named Tammy in the office kitchen at OpenView Venture Partners. Like, she was chewing on a bagel during a lunch break from the VC firm’s all-day speaker event, and like she was clearly upset.',
    results: {
      time: {
        value: time * 60 * 60,
        display: moment()
          .seconds(time)
          .format('mm:ss'),
        label: 'Time'
      },
      totalWords: {
        value: totalWords,
        display: `${totalWords} words`,
        label: 'All Words'
      },
      pace: {
        value: pace,
        display: `${pace} words/min`,
        label: 'Pace'
      },
      fillers: {
        value: fillerCount,
        display: fillerCount,
        label: 'Fillers',
        details: {
          um: fillers[0],
          like: fillers[1],
          yeah: fillers[2],
          ah: fillers[3],
          but: fillers[4]
        }
      }
    }
  };
}

function mockRecording() {
  const created = new Date();
  const duration = randInt(10, 7) * 60 * 60;
  const pace = randInt(100, 10);
  const totalWords = randInt(200, 20);
  const fillers = ['um', 'like', 'yeah', 'ah', 'but'];
  const counts = [...Array(5)].map(() => randInt(10, 1));
  const fillerCount = fillers.reduce((a, b) => a + b, 0);
  return {
    created,
    transcript:
      'A few weeks ago, um I met a CMO named Tammy in the office kitchen at OpenView Venture Partners. Like, she was chewing on a bagel during a lunch break from the VC firm’s all-day speaker event, and like she was clearly upset.',
    duration,
    totalWords,
    pace,
    fillers,
    counts
  };
}

function createRecording({ created, transcript, fillers }) {
  const now = new Date();
  const duration = dateFns.differenceInMilliseconds(now, created);
  const totalWords = transcript.split(' ').length;
  const pace = Math.round(totalWords / ((duration / 1000) / 60));
  const fillerCount = Object.keys(fillers).reduce((count, word) => {
    return count + fillers[word];
  }, 0);

  return {
    created,
    transcript,
    results: {
      time: {
        value: duration,
        display: format(duration),
        label: 'Time'
      },
      totalWords: {
        value: totalWords,
        display: `${totalWords} words`,
        label: 'All Words'
      },
      pace: {
        value: pace,
        display: `${pace} words/min`,
        label: 'Pace'
      },
      fillers: {
        value: fillerCount,
        display: fillerCount,
        label: 'Fillers',
        details: fillers
      }
    }
  };
}

export default {
  createRecording,
  generateRecording,
  data: Array.from({ length: 6 }, generateRecording)
};
