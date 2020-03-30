import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Dashboard from './screens/Dashboard';
import Phonenumber from './screens/Phonenumber';
import Verificationcode from './screens/Verificationcode';
import SignUp from './screens/SignUp';
import FollowingPostTab from './screens/FollowingPostTab';
import FriendsPostTab from './screens/FriendsPostTab';
import MyProfileTab from './screens/MyProfileTab';
import EditProfile from './screens/EditProfile';
import Search from './screens/Search';
import UserProfile from './screens/UserProfile';
import Comments from './screens/Comments';
import Chat from './components/Chat';
import SinglePostView from './screens/SinglePostView';
import AuthLoading from './components/AuthLoading';
import Intro from './components/Intro';
const AuthStack = createStackNavigator({
    Login: Login,
    ForgotPassword: ForgotPassword,
    SignUp: SignUp,
    Phonenumber: Phonenumber,
    Verificationcode: Verificationcode,
}, {
    defaultNavigationOptions: {
        header: null
    }
})
const AppStack = createStackNavigator({
    Dashboard: Dashboard,
    FollowingPostTab: FollowingPostTab,
    FriendsPostTab: FriendsPostTab,
    MyProfileTab: MyProfileTab,
    EditProfile: EditProfile,
    Search: Search,
    UserProfile: UserProfile,
    Comments: Comments,
    Chat: Chat,
    SinglePostView: SinglePostView
}, {
    defaultNavigationOptions: {
        header: null
    }
});
const Wow = createSwitchNavigator({
    Intro : Intro,
    AuthLoading: AuthLoading,
    Auth: AuthStack,
    App: AppStack,
},
    {
        initialRouteName: 'Intro',
})

const AppNavigator = createAppContainer(Wow);

export default AppNavigator;