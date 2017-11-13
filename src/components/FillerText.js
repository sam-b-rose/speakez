import React from 'react';
import { Text } from 'react-native';

import Colors from '../constants/Colors';

export default class FillerText extends React.Component {
  state = {
    reg: null,
  }

  componentDidMount() {
    const fillers = this.props.fillers;
    const reg = new RegExp(`\\b${fillers.join('\\b|\\b')}\\b`, 'ig');
    this.setState({ reg });
    console.log(fillers, reg);
  }

  render() {
    return (
        <Text style={this.props.style}>
          {this.props.children && this.wrapFillerWords(this.props.children)}
        </Text>
      )
  }

  wrapFillerWords(text) {
    // console.log(text);
    // const parsed = text[0].split(' ').map((w) => this.wrap(w));
    return text;
  }

  wrap(word) {
    return this.state.reg.test(word) ? (
      <Text style={{color: Colors.tintColor}}>{word}</Text>
    ) : word;
  }
}