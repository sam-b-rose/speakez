import { AsyncStorage } from 'react-native';

import mockRecordings from '../data/recording';

const DATA_KEY = '@SpeakEz';
let recordings = [];

const setup = async (initial = recordings) => {
  const data = await get();

  if (data !== null) {
    console.log('We have data!!', data);
    initial = data;
  } else {
    console.log('No data... default to nothing.');
    recordings = initial;
    await set();
  }

  return initial;
};

const get = async () => {
  console.log('Getting....');
  try {
    const data = await AsyncStorage.getItem(DATA_KEY);
    return JSON.parse(data);
  } catch (error) {
    storageError(error);
  }
};

const set = async () => {
  try {
    await AsyncStorage.setItem(DATA_KEY, JSON.stringify(recordings));
    return recordings;
  } catch (error) {
    storageError(error);
  }
};

const add = async newRec => {
  recordings = [newRec, ...recordings];
  return await set();
};

const remove = async recIndex => {
  recordings = [
    ...recordings.slice(0, recIndex),
    ...recordings.slice(recIndex + 1)
  ];
  return await set();
};

const mock = async () => {
  recordings = mockRecordings.data;
  return await set();
};

const storageError = error => {
  console.error('Storage Error: ', error);
};

export default {
  setup,
  get,
  set,
  add,
  remove,
  mock
};
