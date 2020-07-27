import React,{Component} from 'react';
import {View, FlatList } from 'react-native';
import { Card,ListItem } from 'react-native-elements';
import { Loading } from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return{
        dishes:state.dishes,
        favorites:state.favorites
    }
}

class Favorites extends Component{

    static navigationOptions = {
        title:'Favorites'
    };

    render(){

        const { navigate } = this.props.navigation;

        const renderMenuItem = ({item,index}) => {
            return(
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source:{uri:baseUrl+item.image}}}
                    onPress = {() => navigate('Dishdetail', { dishId: item.id })}
                    hideChevron={true}
                />
            );
        }
        if (this.props.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return(
                <View>            
                    <Text>{this.props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
            return (
                <Card title=" My Favorites">
                    <FlatList 
                        data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
                        renderItem={renderMenuItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </Card>
            );
        }
    }
}

export default connect(mapStateToProps)(Favorites);