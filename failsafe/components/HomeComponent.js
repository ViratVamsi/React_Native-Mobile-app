import React,{Component} from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';

function RenderItem(props){
    return(
        <Card
            featuredTitle={props.item.name}
            featuredSubtitle={props.item.designation}
            image={require('../images/uthappizza.png')}
            >
                <Text
                    style={{margin:10}}
                    >
                    {props.item.description}
                </Text>
        </Card>
    );
}

class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
          dishes: DISHES,
          promotions: PROMOTIONS,
          leaders: LEADERS
        };
    }

    static navigationOptions = {
        title: 'Home'
    };

    render() {
        return(
            <ScrollView>
                <RenderItem item={this.state.dishes.filter((dish)=>dish.featured)[0]} />
                <RenderItem item={this.state.promotions.filter((promo)=>promo.featured)[0]} />
                <RenderItem item={this.state.leaders.filter((leader)=>leader.featured)[0]} />
            </ScrollView>
        );
    }
}

export default Home;