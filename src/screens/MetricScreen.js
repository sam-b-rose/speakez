import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Row, Text } from '@shoutem/ui';
import Touchable from 'react-native-platform-touchable';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel } from 'victory-native';

import Colors from '../constants/Colors';

export default class MetricScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.label
    };
  };

  render() {
    const { label, details, transcript } = this.props.navigation.state.params;
    const data = Object.keys(details)
      .map(key => {
        return { [label.toLowerCase()]: key, count: details[key] };
      })
      .sort((a, b) => {
        return a.count > b.count;
      });
    return (
      <View style={styles.container}>
        <VictoryChart domainPadding={15}>
          <VictoryAxis dependentAxis
            style={{
              axis: {stroke: Colors.tabIconDefault},
              tickLabels: {color: Colors.lightTextColor}
            }}
            tickLabelComponent={<VictoryLabel dx={20} dy={-20} textAnchor="start"/>}
          />
          <VictoryAxis
            style={{
              axis: {stroke: Colors.tabIconDefault},
              tickLabels: {color: Colors.lightTextColor}
            }}
            tickFormat={(t) => Math.round(t)}
          />
          <VictoryBar
            horizontal
            style={{ data: { fill: Colors.tintColor } }}
            data={data}
            x={label.toLowerCase()}
            y="count"
          />
        </VictoryChart>
        <Text style={StyleSheet.flatten(styles.transcript)}>
          {transcript.join(' ')}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  transcript: {
    margin: 20
  }
});
