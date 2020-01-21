import { ScrollView, StyleSheet, Text, View ,Image} from 'react-native';
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Autolink from 'react-native-autolink';


export default class CommentList extends React.Component {
  
    constructor(props) {
        super(props);
    }
    convertUnicode = (input) => {
        return input.replace(/\\u(\w{4,4})/g,function(a,b) {
          var charcode = parseInt(b,16);
          return String.fromCharCode(charcode);
        });
      }
    _renderItem = (item) => {
        const { userData, comment,cmnt_time,total_reply } = item.item;
        console.log("ITEM ", item.item)
        return(
                <View >
                    <View style={{flexDirection:'row',marginTop:5}}>
                        <Image  style={styles.pic}
                        source={{ uri: userData.profile_img }} 
                        />
                        <Text style={styles.userName}>
                        {userData.first_name}
                        </Text>
                    </View>   
                    <View >
                        <Autolink style={styles.commenttxt}
                        numberOfLines={0} 
                        multiline={true}
                        ellipsizeMode={'tail'} 
                        text={this.convertUnicode(comment).replace(/(\r\n|\n|\r|\\n)/gm, '')}>
                        </Autolink>
                    </View>
                        {/* <View style={styles.commentStyle} > 
                        <Text style={styles.commentTimeStyle} >
                        {cmnt_time}
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.commentReplyStyle}>
                            Reply({total_reply})
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                </View> 
        )
    }

    render() {
        const { comments } = this.props;
        console.log("INSIDE LIST");
        console.log(this.props.comments);
        return(
            <FlatList 
                 data={comments}
                renderItem={this._renderItem}
                
            />
        )
    }
}

const styles = StyleSheet.create({
    commentViewHeight:{
        flex: 1, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        height: 'auto', 
        width: 'auto'
    },
    commenttxt: {
        marginLeft: 50,
        fontSize:12,
        fontWeight:'normal',
        marginTop:-10,
        height: 'auto', 
        width: '100%'
    },
    pic: {
        flexDirection: 'row',
        borderRadius: 30,
        width: 30,
        height: 30,
        marginLeft:10
    },
    userName:{
        fontWeight:'200',
        paddingLeft:5,
        fontSize:12
    },
    commentTimeStyle:{
        fontSize:8,
        marginHorizontal:50,
        marginTop:5  

    },
    commentStyle:{
        flexDirection: 'row',
    },
    commentReplyStyle:{
        fontSize:8,
        marginTop:5,
        marginHorizontal:10,
    }
});
