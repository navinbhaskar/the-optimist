import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TouchableNativeFeedback,
  BackHandler,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { ListItem, Icon } from 'react-native-elements';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';

const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;


const items = [
  { name: 'one'},
  { name: 'two'},
  //{ name: 'three'}
]

class ItemList extends Component {

  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      streak: 0,
      test_series_list: []
    }
  }

  handleBackButton() {
    this.props.navigation.navigate('Home');
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    axios.get('https://classcast-198812.appspot.com/white_label/get_test_series_list/51')
        .then((response) => 
        {
           console.log("sdnjsnjnaskj : "+JSON.stringify(response.data));
           this.setState({ test_series_list: response.data });
        })
        .catch((error) => {
            ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
        })

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      axios.get('https://classcast-198812.appspot.com/white_label/get_test_series_list/51')
        .then((response) => 
        {
           console.log("sdnjsnjnaskj : "+JSON.stringify(response.data));
           this.setState({ test_series_list: response.data });
        })
        .catch((error) => {
            ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
        })      
    })
  }

  render () {
    console.log("skjsbsjdka: "+JSON.stringify(this.state.test_series_list.filter(function (pilot) {return pilot.enrolled})))
    return (
      <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 8 * vh, backgroundColor: '#ffffff'}}>
        <View style={{justifyContent:'flex-start', marginLeft:10}}>
        <Icon           
          name='menu'
          color='#7741cd'
          type='material'
          size= {35} 
          onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        </View>
        <View style={{marginLeft:0}}>
          <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: '#7741cd'}}> Test </Text>
        </View>
        <View style={{justifyContent:'flex-end', marginRight: 10}}>
        <Icon
          name='notifications'
          color='#7741cd'
          type='material'
          size= {35} 
          onPress={() => this.props.navigation.navigate('notification', { title: "Notification" })}
          />
        </View>

      </View>

      <ScrollView style={{width: '100%', marginTop: '7%', marginBottom: 7 * vh}}>
      <View>
      { this.state.test_series_list.filter(function (pilot) {return pilot.enrolled}).length > 0 &&
        <Text style={[styles.h3, {alignSelf:'flex-start'}]}> My Test Series</Text>
      }
        {
          this.state.test_series_list.filter(function (pilot) {return pilot.enrolled}).map((data, index) => (
            <TouchableNativeFeedback
                    onPress={() => {
                      const navigateAction = NavigationActions.navigate({
                              routeName: 'testList',
                              params: {
                                data: data,
                                free: false,
                                path: 'paid'
                              },
                            });
                            this.props.navigation.dispatch(navigateAction);
                    }
                }

               >
              <View style={{height: 35 * vw, width: 95 * vw ,flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', elevation: 2, marginBottom: 4 * vh, borderRadius: 2 * vw, backgroundColor: 'white',}}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      borderRadius: 2 * vw,
                    }}
                    resizeMode={'cover'}
                    source={{uri: data['thumbnail']}}
                  />
              </View>
          </TouchableNativeFeedback>
          ))
        }
        { this.state.test_series_list.filter(function (pilot) {return !pilot.enrolled}).length > 0 &&
          <Text style={[styles.h3, {alignSelf:'flex-start'}]}> Recommended Test Series</Text>
        }
        {
          this.state.test_series_list.filter(function (pilot) {return !pilot.enrolled}).map((data, index) => (
            <TouchableNativeFeedback
                    onPress={() => {
                      const navigateAction = NavigationActions.navigate({
                              routeName: 'testList',
                              params: {
                                data: data,
                                free: false,
                                path: 'paid'
                              },
                            });
                            this.props.navigation.dispatch(navigateAction);
                    }
                }

               >
              <View style={{height: 35 * vw, width: 95 * vw ,flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', elevation: 2, marginBottom: 4 * vh, borderRadius: 2 * vw, backgroundColor: 'white',}}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      borderRadius: 2 * vw,
                    }}
                    resizeMode={'cover'}
                    source={{uri: data['thumbnail']}}
                  />
              </View>
          </TouchableNativeFeedback>
          ))
        }
        </View>
        </ScrollView>
      </View>
    )
  }
}

export default ItemList

const styles = StyleSheet.create({
  container: {
    height: 100 * vh,
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'column',
    backgroundColor: '#e2e2e2',
    alignItems: 'center',
  },
  header: {
    height: 20 * vh,
    width: 100 * vw,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    height: 70 * vh,
    width: '100%',
    marginTop: 8 * vh,
  },
  headerText: {
    fontFamily: 'Proxima Nova Extrabold',
    color: 'black',
    fontSize: 20,
    paddingTop: 1 * vh,
    zIndex: 100,
    paddingLeft: 3 * vw
  },
  h3: {
    fontFamily: 'ProximaNova-Bold',
    paddingBottom: 2 * vh,
    paddingTop: 2 * vh,
    fontSize: 2.7 * vh,
    paddingLeft: 3 * vw,
    color: '#5e5e5e',
  },
  buttonText: {
    fontFamily: 'Proxima Nova Extrabold',
    color: 'white',
    fontSize: 20,
    textAlign: 'justify'
  },
  largeButtonText: {
    fontFamily: 'Proxima Nova Extrabold',
    zIndex: 100,
  },

  aboutTextContainer: {
    padding: 2 * vw,
    backgroundColor: 'rgba(0, 0, 0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 2 * vw
  },
  aboutText: {
    fontSize: 15,
    color: 'black',
    zIndex: 100,
    paddingTop: 1 * vh,
    paddingLeft: 3 * vw,
    fontFamily: 'ProximaNova-Regular',
  },
  headerText: {
    fontSize: 12 * vw,
    color: 'black'
  },
  largeButton: {
    width: 17 * vh,
    height: 17 * vh,
    borderRadius: 2.5 * vw,
    overflow: 'hidden',
    padding: 3 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
  },
  itemText: {
    color: 'black',
    fontSize: 20,
  }
})
