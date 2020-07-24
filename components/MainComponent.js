import React,{Component} from 'react';
import { View, Platform } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import DishDetail from './DishdetailComponent';
import Menu from './MenuComponent';
import Home from './HomeComponent';

const MenuNavigator = createStackNavigator(
    {
        Menu: { screen: Menu },
        Dishdetail: { screen: DishDetail }
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: "#fff"            
            }
        }
    }
);
const HomeNavigator = createStackNavigator(
    {
        Home: { screen: Home }
    },
    {
        // navigationOptions: {
        //     headerStyle: {
        //         backgroundColor: "#512DA8"
        //     },
        //     headerTintColor: '#fff',
        //     headerTitleStyle: {
        //         color: "#fff"            
        //     }
        // }
        navigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTitleStyle: {
                color: "#fff"            
            },
            headerTintColor: "#fff"  
        })
    }
);

const MainNavigator = createDrawerNavigator(
    {
        Home: 
        { 
            screen: HomeNavigator,
            navigationOptions: {
                title: 'Home',
                drawerLabel: 'Home'
            }
        },
        Menu: 
        { screen: MenuNavigator,
          navigationOptions: {
            title: 'Menu',
            drawerLabel: 'Menu'
          }
        }
    },
    {
        drawerBackgroundColor: '#D1C4E9'
    }
    
);

class Main extends Component{
    constructor(props){
        super(props);
    }

    render(){

        return(
            <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
                <MainNavigator />
            </View>
        );

    }
}

export default Main;