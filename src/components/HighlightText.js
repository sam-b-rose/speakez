import React from 'react';
import { Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

export default class HighlightText extends React.Component {
  render() {
    return (
        <Text style={this.props.style}>
          {this.props.children && this.props.children.map((text, idx) => (
            <Text key={idx} style={(idx%2) ? styles.highlight : ''}>{text} </Text>
          ))}
        </Text>
      )
  }
}

const styles = StyleSheet.create({
  highlight: {
    color: Colors.tintColor,
  }
});
