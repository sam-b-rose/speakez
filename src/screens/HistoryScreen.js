import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Icon, Row, Text } from '@shoutem/ui';
import Touchable from 'react-native-platform-touchable';
import format from 'date-fns/format';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'History'
  };

  render() {
    const { recordings } = this.props.screenProps.appState;
    return (
      <ScrollView style={styles.container}>
        {recordings &&
          recordings.map((item, i) => {
            const label = format(new Date(item.created), 'M/D/YYYY, h:mm a');
            return (
              <Touchable
                key={i}
                style={styles.option}
                background={Touchable.Ripple('#ccc', false)}
                onPress={() => {
                  this.handlePressHistory(item.results, item.transcript, i);
                }}>
                <Row styleName="small">
                  {<Text>{label}</Text>}
                  <Icon styleName="disclosure" name="right-arrow" />
                </Row>
              </Touchable>
            );
          })}
      </ScrollView>
    );
  }

  handlePressHistory(results, transcript, index) {
    this.props.navigation.navigate('Results', { results, transcript, index });
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
