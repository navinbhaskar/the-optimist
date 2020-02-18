import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
  Alert,
  TouchableHighlight,
  ToastAndroid,
  Animated,
  ScrollView,
  Platform,
  Button,
  BackHandler,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import CourseListPlaceholder from "./courseListPlaceholder";
import firebase from 'react-native-firebase';
import Modal from 'react-native-modal';
//import RNAppShortcuts from 'react-native-app-shortcuts';
//import AddShortcut from 'react-native-add-shortcut';
//import QuickActions from "react-native-quick-actions";
const db = firebase.firestore();

const Header_Maximum_Height = 25 * vh;
 
const Header_Minimum_Height = 0 * vh;

const SCREEN_WIDTH = Dimensions.get('window').width;

class chapterList extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      courses: [
        {
         
        }
      ],
      test_series: [
        
      ],
      isReady: false,
      modalVisible: false,
      isEnrolled: true,
      enrollCode: '',
      username: '',
      redirectCourse: '',
      accessCodeModal: false,
      accessCodeProcess: false,
      videoTab: true
    }
    this.switchModal = this.switchModal.bind(this);
    this.tryenroll = this.tryenroll.bind(this);
  }

  switchModal(){
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }
    else {
      this.setState({modalVisible: true});
    }
  }

  tryenroll(){

    var data= {
      "access_code" : this.state.enrollCode
    }

    axios.post('https://classcast-198812.appspot.com/accesstoken/enroll/', data)
              .then((response) => 
              {
                  if(response.code == 201) {
                  Alert.alert('');
                 }
                 this.props.navigation.navigate("Home");
              })
              .catch((error) => {
                  Alert.alert('Wrong passcode, please try again or contact ClassCast team');
              })
  }

  handleBackButton = () => {
    this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

   async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
     console.log('znjdnd: '+JSON.stringify(this.props.navigation.state.params));
      axios.get('https://classcast-198812.appspot.com/white_label/get_cahpter_list_shyam/'+this.props.navigation.state.params.data.course_id)
                .then(function (response){
                  console.log("danslkadsdas: "+JSON.stringify(response.data));
                  this.setState({courses: response.data});
                  this.setState({isReady: true});
                }.bind(this))
                .catch(function (error) {
                  console.log('danslkadsdaserror');
                });

      axios.get('https://classcast-198812.appspot.com/white_label/get_course_test_series_list/'+this.props.navigation.state.params.data.course_id)
                .then(function (response){
                  console.log("danslkadsdasss: "+JSON.stringify(response.data));
                  this.setState({test_series: response.data});
                }.bind(this))
                .catch(function (error) {
                  console.log('danslkadsdaserror');
                });

    var currentUser = await firebase.auth().currentUser;                 
     await currentUser.getIdToken()
            .then(idToken => {
                  this.setState({ username: currentUser['phoneNumber'].slice(3, 13) })
                });
  }

  _renderTestSeries ({item, index}) {
    console.log("dssdnlas: "+JSON.stringify(item))

    return (
      <TouchableNativeFeedback
        onPress = {()=> {
            if(this.state.isReady){
                const navigateAction = NavigationActions.navigate({
                routeName: 'testList',
                params: {
                  data: item,
                  free: this.props.navigation.state.params.data.enrolled,
                  path: 'course',
                  blocks: this.props.navigation.state.params.data
                },
              });
              this.props.navigation.dispatch(navigateAction);
            }
          }
          } 
      >
            <View style={styles.courseCardContainer}>
              <Text style={styles.h2}>{item.course_name} (Test Series) </Text>
             
              
            </View>
      </TouchableNativeFeedback>
         );
    }

  _renderItem ({item, index}) {
    
    return (
      <TouchableNativeFeedback
        onPress = {()=> {
            if(this.state.isReady){
                const navigateAction = NavigationActions.navigate({
                routeName: 'Course',
                params: {
                  course_id: this.props.navigation.state.params.data.course_id,
                  amount: this.props.navigation.state.params.data.amount,
                  details: this.props.navigation.state.params.data.course_details,
                  chapter_id: item.course_id,
                  details: item.details,
                  display_name: item.chapter_name,
                  enrolled: this.props.navigation.state.params.data.enrolled
                },
              });
              this.props.navigation.dispatch(navigateAction);
            }
          }}
      >
            <View style={styles.courseCardContainer}>
              <Text style={styles.h2}>{item.chapter_name} </Text>
              <Text style= {{fontFamily:'ProximaNova-Regular', fontSize: 1.8 * vh}} >  </Text>
                            
            </View>
      </TouchableNativeFeedback>
         );
      
    }

  render () {
    console.log("meslfkmssadasfmle: "+JSON.stringify(this.state.test_series))  
        
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#3493e0" barStyle="light-content" />
        <Icon
          raised
          name='chevron-left'
          type='font-awesome'
          color='#5298d1'
          onPress={() => this.props.navigation.goBack()} />
        <Text style={{fontFamily: 'Montserrat-Regular', marginLeft: 2*vh, color: '#3493e0', fontSize: 2.5 * vh, marginBottom: 1 * vh}}> {this.props.navigation.state.params.data.course_name} </Text>

        <View style={{flexDirection:'row', padding: 2*vh}}>
          <TouchableNativeFeedback
            onPress = {()=> {
              this.setState({ videoTab: true })
            }}
          >
            <View style={this.state.videoTab ? styles.selected: styles.notSelected}>
              <Text style={{fontFamily:'Montserrat-Regular', color: 'black'}}>Videos & Support Material </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress = {()=> {
              this.setState({ videoTab: false })
            }}
          >
            <View style={this.state.videoTab ? styles.notSelected: styles.selected}>
              <Text style={{fontFamily:'Montserrat-Regular'}}> Tests & Assignments </Text>
            </View>
          </TouchableNativeFeedback>

        </View>
      
      <ScrollView>
             
      <CourseListPlaceholder onReady={this.state.isReady} animate="fade">
        { this.state.videoTab &&
          <FlatList
            data={this.state.courses}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderItem.bind(this) }
            keyExtractor={(item, index) => index.toString()}
          />
        }
        </CourseListPlaceholder>
        { !this.state.videoTab &&
          <FlatList
            data={this.state.test_series}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderTestSeries.bind(this) }
            keyExtractor={(item, index) => index.toString()}
          />
        }
        {(!this.state.isEnrolled && !this.state.modalVisible) &&
         <Button
                containerStyle={{ marginVertical: 20, marginLeft: 20 }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                
                buttonStyle={{
                  height: 55,
                  width: SCREEN_WIDTH - 40,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                title="Enrol Now"
                titleStyle={{
                  fontFamily: 'regular',
                  fontSize: 20,
                  color: 'white',
                  textAlign: 'center',
                }}
                onPress={() => {
                  const navigateAction = NavigationActions.navigate({
                          routeName: 'accessCode'
                        });
                        this.props.navigation.dispatch(navigateAction);
                }}
                activeOpacity={0.5}
              />
            }
         
        <Modal
          backdropOpacity={0.9}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.accessCodeModal}
          onRequestClose={() => {
            this.setState({accessCodeModal: false})
          }}>
          <View style={[styles.tncModal]}>
            <Text style={styles.tncHeadingBig}>Have an Access code?</Text>
            <View style={{flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 2 * vh, alignItems: 'center', justifyContent: 'center'}}>
              { !this.state.accessCodeProcess &&
              <TextInput
                  style={{ height: 15 * vw, width: '70%', borderColor: '#035493', borderWidth: 0.5 * vw, borderTopLeftRadius: 2 * vw, borderBottomLeftRadius: 2 * vw, fontFamily: 'Montserrat-Bold', fontSize: 3.5 * vw, letterSpacing: 2, padding: 2 * vw }}
                  onChangeText={(text) => {
                    this.setState({promocode: text});
                  }}
                  value = {this.state.message}
                  placeholder='Enter your code here'
                  placeholderTextColor= 'grey'
                />
              }
             { this.state.accessCodeProcess &&
              <ActivityIndicator size="large" color="#0000ff" />
             }
                <TouchableNativeFeedback
                  onPress={() => {
                    this.setState({ accessCodeProcess: true });

                    var data = {
                      "access_code": this.state.promocode,
                      "course_id": this.props.navigation.state.params.data.course_id,
                      "teacher_id": 52,
                      "package_index": 0
                    }
                    axios.post('https://classcast-198812.appspot.com/white_label/enrollment_from_token_new/', data)
                      .then((response) => 
                      {
                        this.setState({ accessCodeProcess: false });

                        if(response.data == 'Updated') {
                          this.setState({ accessCodeModal: false });
                          this.props.navigation.navigate('Home');
                        }
                        else{
                          ToastAndroid.show('Invalid Access Code', ToastAndroid.SHORT);
                        }
                      })
                      .catch(err=>{
                        this.setState({ accessCodeProcess: false });
                        ToastAndroid.show('Invalid Access Code', ToastAndroid.SHORT);
                      })

                  }}
                >
                <View style={{ height: 15 * vw, width: '25%', borderColor: '#035493', borderWidth: 0.5 * vw, borderTopRightRadius: 2 * vw, borderBottomRightRadius: 2 * vw, backgroundColor: '#035493', justifyContent: 'center' }}>
                  <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 4 * vw, color: 'white', alignSelf: 'center'}}>Apply</Text>
                </View>
                </TouchableNativeFeedback>
            </View>
          </View>

        </Modal>

        </ScrollView>
        
        { !this.props.navigation.state.params.data.enrolled && this.props.navigation.state.params.data.access_token_only &&
            <TouchableNativeFeedback
            onPress={() => {
              this.setState({accessCodeModal: true});
            }}
            >
              <View style={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white', fontSize: 5 * vw, textAlign: 'center'}}>Have an Access Code</Text>
              </View>
            </TouchableNativeFeedback>
        }
        { !this.props.navigation.state.params.data.enrolled && this.props.navigation.state.params.data.amount != 0 && !this.props.navigation.state.params.data.access_token_only &&
            <TouchableNativeFeedback
            onPress={() => {
              const navigateAction = NavigationActions.navigate({
                routeName: 'buynow',
                params: {
                  data: this.props.navigation.state.params.data,
                  teacher_id: 52
                },
              });
              this.props.navigation.dispatch(navigateAction);
            }}
            >
              <View style={{backgroundColor: '#3493e0', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%', borderRadius: 1*vh, elevation: 3}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: '#ffffff', fontSize: 5 * vw, textAlign: 'center'}}>Buy Now</Text>
              </View>
            </TouchableNativeFeedback>
        }
        { !this.props.navigation.state.params.data.enrolled && this.props.navigation.state.params.data.amount == 0 && !this.props.navigation.state.params.data.access_token_only &&
            <TouchableNativeFeedback
            onPress={() => {
              json_data = {
                "course_id": this.props.navigation.state.params.data.course_id,
                "teacher_id": 52,
                "enrollment_method": 'Token',
                "payement_mode": "None",
                "payment_id": "None",
                "package_index": 0
              }
          axios.post(`https://classcast-198812.appspot.com/white_label/add_course_enrollment_new/`, json_data)
                  .then(function (response){
                      this.props.navigation.navigate('Home')
                  }.bind(this))
                  .catch(function (error) {
                    console.log('error');
                  });
            }}
            >
              <View style={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: '#ffffff', fontSize: 5 * vw, textAlign: 'center'}}>Join for Free</Text>
              </View>
            </TouchableNativeFeedback>
        }
      </View>
      )
  }
}

export default chapterList;

const styles = StyleSheet.create({
  
  container:{
     flex: 1,
     padding: 2*vh,
     backgroundColor: 'white'
   },
   h2:{
    fontFamily: 'Montserrat-Semibold',
    padding: 1 * vw,
     fontSize: 2.2 * vh,
     color: '#4d4848',
     textAlignVertical: 'top'
   },
   h3:{
    fontFamily: 'ProximaNova-Regular',
    paddingLeft: 1 * vw,
     fontSize: 2 * vw,
     color: 'black'
   },
   videoCount: {
    fontFamily: 'ProximaNova-Regular',
     color: 'black'
   },
   h2Blue:{
     fontSize: 3.0 *vh,
     fontWeight: 'bold',
     color: 'blue'
   },
   courseCardContainer:{
     width: 85*vw,
     borderRadius: 1.4 * vw,
     marginTop: 1 * vh,
     elevation: 2,
     padding: 2.5* vh,
     marginBottom: 1 * vh,
     alignSelf: 'center',
     backgroundColor: '#e6ecf5'
   },
   coursePreview:{
     flex:1,
     flexDirection:'row',
   },
   coursePreviewLeft:{
     width:'70%',
     margin: 0.5 * vh,
   },
   courseAbout:{
     padding: 1 * vw,
     width: '100%'
   },
   courseImageContainer:{
     width:'28%',
     margin: 0.4 * vh,
     alignSelf: 'center',
   },
   courseImage:{
     resizeMode:'contain',
     alignItems: 'flex-end',
     height: 10 * vh,
     width: 10 * vh,
     marginBottom: 0.5 * vh,
     alignSelf: 'center',
   },
   selected: {
    borderBottomColor: 'red', 
    borderBottomWidth: 2,
    flex: 1, 
    padding:1 * vh, 
    elevation: 1
  },
  notSelected: { 
    flex: 1, 
    padding:1 * vh, 
    elevation: 0.2
  },
    headerText: {
    fontSize: 20,
    color: 'white',
    zIndex: 100,
    paddingTop: 2 * vh,
    paddingLeft: 3 * vw,
    fontFamily: 'ProximaNova-Regular',
  },
    videoTestCount:{
      flex:1,
      alignItems:'center',
      flexDirection:'row',
    },
    inputContainer: {
      paddingLeft: 8,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: 'red',
      height: 45,
      width: 150,
      marginVertical: 10,
    },
    inputStyle: {
      flex: 1,
      marginLeft: 10,
      color: 'white',
      fontFamily: 'light',
      fontSize: 16,
    },
    errorInputStyle: {
      marginTop: 0,
      textAlign: 'center',
      color: '#F44336',
    },
    HeaderStyle:
    {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      left: 0,
      right: 0,
      top: (Platform.OS == 'ios') ? 20 : 0,
    },
    tncModal: {
     height: 30 * vh,
     width: 90 * vw,
     backgroundColor: 'white',
     borderRadius: 1.5 * vw,
     paddingTop: 5 * vh,
     paddingLeft: 7.5 * vw,
     paddingRight: 7.5 * vw,
     paddingBottom: 3 * vh,
   },
   tncHeadingBig: {
     fontSize: 5.5 * vw,
     color: 'black',
     fontFamily: 'Montserrat-Bold',
     marginBottom: 2 * vh,
   },
  });
