import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'native-base';
import styles from './styles';
export default class ProfileBanner extends React.Component {
    render() {
        const { user, profile, navigateToEditProfile, requestUser, blockAlert, followRequestUser, navigateToMessages, follow, friend } = this.props;
        return (
            <View>
                <View style={styles.profileWrapper}>
                    <View style={styles.profileImgWrapper}>
                        <Image source={{ uri: user.profile_img }}
                            style={styles.profileImg} />
                    </View>
                    <View style={styles.profilePostMainWrapper}>
                        <View style={styles.profilePostWrapper}>
                            <View style={styles.post}>
                                <Text>{user.total_posts}</Text>
                                <Text style={styles.txtPost}>Posts</Text>
                            </View>
                            <View style={styles.post}>
                                <Text>{user.total_friends}</Text>
                                <Text style={styles.txtPost}>Friends</Text>
                            </View>
                            <View style={styles.post}>
                                <Text>{user.total_follower}</Text>
                                <Text style={styles.txtPost}>Following</Text>
                            </View>
                        </View>

                    </View>
                </View>

                <View style={styles.about}>
                    <Text style={styles.firstname}>{user.first_name}</Text>
                    <Text>{user.about}</Text>
                    {/* <Text>{user.phone_no}</Text> */}
                </View>

                {
                    profile == "1" ?
                        <View style={styles.container}>
                            <View style={styles.imageWrapper}>
                                <TouchableOpacity style={styles.btn} onPress={() => requestUser(user)}>
                                    <Text>{friend}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => followRequestUser(user)}>
                                    <Text>{follow}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => navigateToMessages(user)}>
                                    <Text>Message</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => blockAlert()}>
                                    <MaterialIcons name="block" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={styles.editProfileBtnView}>
                            <Button bordered dark onPress={() => navigateToEditProfile(user)}
                                style={styles.editBtn}>
                                <Text>Edit Profile</Text>
                            </Button>
                        </View>
                }

            </View>
        )
    }
}
