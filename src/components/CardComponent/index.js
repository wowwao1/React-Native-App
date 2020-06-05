import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base';
import Autolink from 'react-native-autolink';
import { withNavigation } from 'react-navigation';
import { convertUnicode, getData } from './../../utils/helper';
import { InstagramProvider, ElementContainer }from '@postillon/react-native-instagram-zoomable';
import NewAudioPlayer from './../NewAudioPlayer';
import styles from './styles';

class CardCompnent extends Component {

    state = {
        tapped: false,
    }

    navigateToUserprofile = async (user) => {
        let authUser = await getData("user");
        if (JSON.parse(authUser).id == user.id) {
            this.props.navigation.navigate('MyProfileTab', { user });
        } else {
            this.props.navigation.navigate('UserProfile', { user });
        }
    }
    onTap = async (item) => {
        this.setState({
            tapped: true,
        });
        setTimeout(() => {
            this.setState({ tapped: false })
        }, 1000);

        if (this.state.tapped) {
            this.props.onLikePost(item);
        }
    }
    renderActions = (item) => {
        return (
            <CardItem style={{ height: 40 }}>
                <Left>
                    <Button transparent onPress={() => this.props.onLikePost(item)}>
                        <Icon name={(item.is_liked === 'y') ?
                            "ios-heart" :
                            "ios-heart-empty"} style={styles.heart} />
                        <Text style={styles.likeCmnt}>{item.total_like}</Text>
                    </Button>
                    <Button transparent onPress={() => this.props.navigateComment(item)}>
                        <EvilIcons name="comment" size={30} style={styles.comment} />
                        <Text style={styles.likeCmnt}>{item.total_comment}</Text>
                    </Button>
                </Left>
            </CardItem>
        )
    }
    render() {
        let audio = null;
        const { item, showActionSheet, nearBy } = this.props;
        let url = item.image.length > 0 ? item.image[0].path : null;
        if(item.audio) audio = <NewAudioPlayer src={item.audio}/>
        return (
            <Card>
                <CardItem>
                    <Left>
                        <TouchableOpacity onPress={() => this.navigateToUserprofile(item.userData)}>
                            <Thumbnail
                                style={styles.thumbnail}
                                source={{ uri: item.userData.profile_img }} />
                        </TouchableOpacity>
                        <Body>
                            <View style={styles.userDetails}>
                                <Text>{item.userData.first_name}</Text>
                                {(item.userData.isOnline == "1" && nearBy) && (<Image style={styles.online} source={require('../../assets/images/icons/BlueDot.png')} />)}

                            </View>
                            <View style={styles.timeDate}>
                                <Text note style={styles.date}>
                                    {new Date(item.post_date).toDateString()}
                                </Text>
                                <Text style={styles.diff}>&nbsp;.&nbsp;{item.diff == " Just now" ? item.diff : `${item.diff} ago`}</Text>
                            </View>
                        </Body>
                    </Left>
                    <Right style={styles.post_type}>
                        <Button transparent>
                            {
                                item.post_type == "Public" ?
                                    <MaterialIcons name="public" size={15} style={styles.public_type} />
                                    :
                                    <EvilIcons name="lock" size={24} style={styles.private_type} />
                            }
                        </Button>
                        <Button transparent onPress={() => showActionSheet(item)}>
                            <Icon name="ios-more" style={styles.more} />
                        </Button>
                    </Right>
                </CardItem>
                {item.post_text ? <View style={{ flexDirection: 'column' }}>
                    <View style={{ paddingVertical: 10, paddingLeft: 10 }}>
                        <Autolink
                            numberOfLines={0}
                            ellipsizeMode={'tail'}
                            text={convertUnicode(item.post_text).replace(/(\r\n|\r|\\n)/gm, '')}
                            hashtag="instagram"
                            mention="twitter"
                            phone={true}>
                        </Autolink>
                    </View>
                    <View>
                    { audio }
                    </View>
                </View> : null
                }
                {
                    item.image.length > 0 && item.image[0].path ?

                        <View >
                            <InstagramProvider>
                                <ElementContainer>
                                    <TouchableOpacity style={styles.imageWrapper} activeOpacity={0.75} onPress={() => this.onTap(item)}>
                                        <Image
                                            source={{ uri: url }}
                                            style={styles.postImage} />
                                    </TouchableOpacity>
                                    {this.renderActions(item)}
                                </ElementContainer>
                            </InstagramProvider>

                        </View>
                        : this.renderActions(item)
                }
            </Card>
        );
    }
}



export default withNavigation(CardCompnent)