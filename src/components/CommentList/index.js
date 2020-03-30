import { Text, View, Image } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Autolink from 'react-native-autolink';
import styles from './styles';

export default class CommentList extends React.Component {

    constructor(props) {
        super(props);
    }
    convertUnicode = (input) => {
        return input.replace(/\\u(\w{4,4})/g, function (a, b) {
            var charcode = parseInt(b, 16);
            return String.fromCharCode(charcode);
        });
    }
    _renderItem = (item) => {
        const { userData, comment, cmnt_time, total_reply, cmnt_date } = item.item;

        return (
            <View style={styles.container}>
                <Image style={styles.avatar} source={{ uri: userData.profile_img }} />
                <View style={styles.userDetails}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.name}>{userData.first_name}</Text>
                        <Text style={styles.commnet_date}>{cmnt_date}</Text>
                    </View>

                    <Autolink style={styles.comment}
                        numberOfLines={0}
                        multiline={true}
                        ellipsizeMode={'tail'}
                        text={this.convertUnicode(comment).replace(/(\r\n|\n|\r|\\n)/gm, '')}>
                    </Autolink>
                </View>
            </View>
        )
    }

    render() {
        const { comments } = this.props;
        return (
            <FlatList
                data={comments}
                renderItem={this._renderItem}

            />
        )
    }
}
