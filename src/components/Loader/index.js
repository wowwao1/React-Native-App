import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';
export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="small" />
			</View>
		);
	}
}
