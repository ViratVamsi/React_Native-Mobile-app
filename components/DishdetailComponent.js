import React,{Component} from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import {Card,Icon,Input, Rating, AirbnbRating } from 'react-native-elements';
import {baseUrl} from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';
import Favorites from './FavoriteComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    addComment: (dishId, rating, comment, author) => dispatch(addComment(dishId, rating, comment, author)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment,))
});



function RenderDish(props){
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if ( dx > 200 )
            return true;
        else
            return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            else if(recognizeComment(gestureState)){
                props.click();
            }
            return true;
        }
    })
    const dish=props.dish;
    if(dish!=null){
        const shareDish = (title, message, url) => {
            Share.share({
                title: title,
                message: title + ': ' + message + ' ' + url,
                url: url
            },{
                dialogTitle: 'Share ' + title
            })
        }
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
            ref={ref => this.view = ref}
            {...panResponder.panHandlers} >
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text>
                        {dish.description}
                    </Text>
                    <View style={styles.row}>
                        <Icon
                            style={{flex:1}}
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress() }
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#521DA8'
                            onPress={()=>props.click()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} 
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else
        return(<View></View>);
}
function RenderComments(props){
    comments=props.comments;
    const renderCommentItem=({item,index})=>{
        return(
            <View
                key={index}
                style={{margin:10}}
            >
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item=>item.id.toString()}
                />

            </Card>
        </Animatable.View>
    );
    
}
class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state={
            showModal:false,
            rating:0,
            comment:'',
            author:''
        };
        this.markFavorite = this.markFavorite.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    toggleModal(){
        this.setState({showModal:!this.state.showModal});
    }
    handleComment(dishId,rating,author,comment){
        console.log(dishId,rating,author,comment);
        this.props.postComment(dishId,rating,author,comment);
    }
    resetForm(){
        this.setState({
            showModal: false,
            rating:0,
            author:'',
            comment:''
        });
    }
    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some((el) => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    click={()=>this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment)=>comment.dishId===dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Rating
                            type='star'
                            showRating
                            ratingCount={5}
                            startingValue={0}
                            //onChange={(rating)=>{this.setState({rating:rating});   }}
                            onFinishRating={rating=>this.setState({rating:rating})}
                            style={{ paddingVertical: 10 }}
                            imageSize={40}
                        />
                        <Input
                            onChangeText={(text)=>this.setState({author:text})} value={this.state.author}
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                name='user'
                                type='font-awesome'
                                size={24}
                                color='grey'
                                />
                            }
                        />
                        <Input
                            onChangeText={(text)=>this.setState({comment:text})} value={this.state.comment}
                            placeholder='Comment'
                            leftIcon={
                                <Icon
                                name='comment'
                                type='font-awesome'
                                size={24}
                                color='grey'
                                />
                            }
                        />
                        <View style={styles.row}>
                            <Button
                                onPress = {() =>{this.handleComment(+dishId,this.state.rating,this.state.author,this.state.comment);
                                     this.toggleModal(); this.resetForm();}}
                                color="#512DA8"
                                title="Submit" 
                            />
                        </View>
                        <View style={styles.row}>
                            <Button
                                onPress = {() =>{this.toggleModal(); this.resetForm();}}
                                color="grey"
                                title="Cancel" 
                            />
                        
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

export const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
      },
      modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalItem: {
         fontSize: 18,
         margin: 10
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);