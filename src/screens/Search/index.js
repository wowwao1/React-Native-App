import React, { Component } from 'react';
import { View, Text ,Image,Keyboard,StyleSheet,ScrollView,FlatList,ActivityIndicator} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Searchbar,Appbar,Card,Button,FAB} from 'react-native-paper';
import { ListItem, SearchBar } from 'react-native-elements';
import theme from './../../theme';
import styles from './styles';
import {search} from './../../api';
import{getData} from './../../helper';
import Loader from './../../Loader';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons'
 class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      error: null,
      keyword : "",
      user: {},
      searchuser:''
    };
    this.arrayholder = [];
  }
  navigateToHome = () =>{
      this.props.navigation.navigate('Home')
  }
  navigateToUserProfile = async(user) =>{
    let authUser = await getData("user");
    if(JSON.parse(authUser).id == user.id){
       this.props.navigation.navigate('MyProfileTab', { user });
    }else{
      this.props.navigation.navigate('UserProfile', { user });
    }
  }
  getSearchUser = () => {
    let data = new FormData();
    data.append("action", "search");
    data.append("user_id", this.state.user.id);
    data.append("keyword", this.state.keyword);
    // data.append("lat", "16.696716308593");
    // data.append("long", "74.238323866589");
    data.append("search_type", "both");
    data.append("timezone", "Asia/Calcutta");
    data.append("page", "1");
   
    console.log(data);
    search("POST", data).then(data=>{
    this.setState({ isLoading: false })
    console.log("Posts", data);
    this.setState({ searchuser: data.data.user, isLoading:false })

})
}

componentDidMount = async () =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.setState({user})
}

renderSeparator = () => {
  return (
    <View
        style={{
                  height: 1,
                  width: '86%',
                  backgroundColor: '#CED0CE',
                  marginLeft: '14%',
      }}
    />
  );
};

searchFilterFunction = (text) => {
  this.setState({
    value: text,
  });

    const newData = this.searchuser.filter(item => {
    const itemData = `${item.name.title.toUpperCase()} ${item.name.first_name.toUpperCase()} ${item.name.last_name.toUpperCase()}`;
    const textData = text.toUpperCase();
    return itemData.indexOf(textData) > -1;
  });
  this.setState({
    data: newData,
  });
};

_handleKeyword = (keyword) => {
  this.setState({ keyword },()=>{
    this.getSearchUser()
  })
}

renderHeader = () => {
  return (
    <SearchBar
      placeholder="Search Here..."
      lightTheme
      round
      onChangeText={keyword => this._handleKeyword(keyword)}
      autoCorrect={false}
      value={this.state.keyword}
    />
  );
};

render() {
  if (this.state.loading) {
    this.getSearchUser()
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  const { searchuser} = this.state;
  return (
    <View style={{ flex: 1 }}>
          <Appbar.Header >
                <Appbar.BackAction icon="back" onPress={this.navigateToHome} />
                <Appbar.Action icon='filter' style={{left:'480%',marginTop: 10,}}/>
                <Appbar.Content titleStyle={styles.headerTitle} title="Home"/>
          </Appbar.Header>
         
                    <FlatList
                        data={searchuser}
                        renderItem={({ item }) => (
                        <ListItem
                          onPress={()=>this.navigateToUserProfile(item)}
                          leftAvatar={{ source: { uri: item.profile_img } }}
                          title={`${item.first_name} ${item.last_name}`} 
                        />)}
                          keyExtractor={item => item.id}
                          ItemSeparatorComponent={this.renderSeparator}
                          ListHeaderComponent={this.renderHeader}
                    />
      
      </View>
  );
}
}
export default Search;
