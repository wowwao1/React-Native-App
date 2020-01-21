import React from 'react';
import { View, Text } from 'react-native';

function UserList({ userId }) {
  return (
    <View className="UserList">
      <View className="UserList__titlebar">
        <Text className="UserList__titlebar__logged-in-as">{userId}</Text>
      </View>
      <View className="UserList__container">
        <View className="UserList__container__list">
          <View className="UserList__container__list__item">
            <View className="UserList__container__list__item__content">
              <Text className="UserList__container__list__item__content__name">
                Alice Andrews
              </Text>
              <Text className="UserList__container__list__item__content__text">
                You: That would be great!
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default UserList;