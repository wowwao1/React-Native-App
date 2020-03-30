import React from 'react';
import { View, Text } from 'react-native';
import { Card, Thumbnail } from 'native-base';
import { Button } from 'react-native-paper';
import styles from './styles';

const FriendRequestItem = ({ item, rejectUserRequest, addUserRequest }) => {
    return (
        <Card>
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.userWrapper}>
                        <Thumbnail
                            source={{ uri: item.profile_img }} />
                        <View style={styles.details}>
                            <Text>{item.first_name}</Text>
                            <Text note style={styles.userEmail}>
                                {item.email != 'undefined' ? item.email : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.actionWrapper}>
                        <Button style={styles.button} onPress={() => addUserRequest(item)}>
                            <Text style={styles.confirmText}>Confirm</Text>
                        </Button>
                        <Button style={[styles.button, styles.reject]} onPress={() => rejectUserRequest(item)}>
                            <Text>Reject</Text>
                        </Button>
                    </View>
                </View>

            </View>
        </Card>
    )
}



export default FriendRequestItem;

