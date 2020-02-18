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
  ActivityIndicator
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import CourseListPlaceholder from "./courseListPlaceholder";
import firebase from 'react-native-firebase';
import Modal from 'react-native-modal';

const db = firebase.firestore();

const Header_Maximum_Height = 25 * vh;
 
const Header_Minimum_Height = 0 * vh;

const SCREEN_WIDTH = Dimensions.get('window').width;

class testList extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      courses: [
        {
         
        }
      ],
      blocks: [],
      isReady: false,
      modalVisible: false,
      isEnrolled: true,
      enrollCode: '',
      username: '',
      redirectCourse: '',
      accessCodeModal: false,
      accessCodeProcess: false,
      loading: false
    }
    this.switchModal = this.switchModal.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  switchModal(){
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }
    else {
      this.setState({modalVisible: true});
    }
  }

  handleBackButton = () => {
    if(this.props.navigation.state.params.path == 'paid')
      this.props.navigation.navigate('Tabs');
    else if(this.props.navigation.state.params.path == 'free')
      this.props.navigation.navigate('TabTest');
    else
      this.props.navigation.navigate('chapterList')
    return true;
  }

  navigateToScreen = (route, url, block_id, course_id, name) => {
    console.log("saklndlknA: "+route);
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: {
        url: url,
        block_id: block_id,
        course_id: course_id,
        name: name
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
     console.log('znjdnd: '+JSON.stringify(this.props.navigation.state.params));
      axios.get('https://classcast-198812.appspot.com/white_label/get_test_list/'+this.props.navigation.state.params.data.course_id)
                .then(function (response){
                  console.log("danslkadsdasdd: "+JSON.stringify(response.data));
                  var temp1 = response.data.map(obj=> ({ ...obj, 'Type': 'test' })).filter(function (value) { return ((new Date() > new Date(value.start_date) ) ) }) ;
                  //.filter(function (value) { return (new Date() < new Date(value.end_date) && (new Date() > new Date(value.start_date) ) ) }) ;
                  //this.setState({courses: temp});

                  axios.get('https://classcast-198812.appspot.com/white_label/get_test_series_courses/'+this.props.navigation.state.params.data.course_id)
                    .then((res) => {
                      //this.setState({ courses: response.data.blocks })
                      //console.log("danslkadsdsasaas: "+JSON.stringify(response.data.blocks.map(data => ( data.data ) )));
                      console.log("bigigi: "+JSON.stringify(res.data));
                     if("blocks" in res.data){
                        console.log("bigigi1: ");
                        var temp2 = res.data.blocks[0].data.map(obj=> ({ ...obj, 'Type': 'blocks' }))
                        temp1.push(...temp2)
                     }
                      this.setState({courses: temp1});
                      this.setState({isReady: true});
                    })
                    .catch(function (err) {
                      console.log('danslkadsdaserror1'+err);
                    });

                }.bind(this))
                .catch(function (error) {
                  console.log('danslkadsdaserror:  '+err);
                  this.setState({isReady: true});
                });   
  }

  _renderItem ({item, index}) {
    console.log("djdsdidssjk: "+JSON.stringify(item));
    if(item.Type == 'test' && item.assignment) {
      return (
      <View>
            <View style={styles.courseCardContainer}>
              <TouchableNativeFeedback
                onPress = {()=> {
                  if( new Date() <= new Date(item.end_date) ){
                    if(this.state.isReady && ( this.props.navigation.state.params.free || this.props.navigation.state.params.data.enrolled || item.free)){
                      const navigateAction = NavigationActions.navigate({
                        routeName: this.props.navigation.state.params.path == 'paid' ? 'testInstructions': 'testInstructions1', 
                        params: {
                          data: item,
                          test_series_name: this.props.navigation.state.params.data.course_name,
                          test_series_data: this.props.navigation.state.params.data,
                          path: this.props.navigation.state.params.path
                        },
                      });
                      this.props.navigation.dispatch(navigateAction);
                    }
                    else {
                      ToastAndroid.show('Please enrol to attempt the test', ToastAndroid.SHORT);
                    }
                  }
                else{
                  ToastAndroid.show('Test Expired', ToastAndroid.SHORT);
                }
              }}
              >
                <View style={{flexDirection: 'column', flex: 7}}>
                  <Text style={styles.test_name}>{item.test_name} (Assignment)</Text>
                  <Text style={[styles.test_name, {marginTop: 1 * vh, color: 'green', fontFamily: 'Montserrat-SemiBold'}]}>{ ( new Date() > new Date(item.end_date) ) ? 'Expired' : this.props.navigation.state.params.free? 'Start' : this.props.navigation.state.params.data.enrolled ? item.attempted ? "Attempt Again" : "Start" : item.free ? item.attempted ? "Attempt Again" : "Start": "Locked" }</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress = {()=> {
                  this.setState({ loading: true });
                  axios.get('https://classcast-198812.appspot.com/white_label/get_previous_records/'+item.test_id)
                      .then((response) => {
                        console.log("dsknlndsk: "+JSON.stringify(response.data));
                        const navigateAction = NavigationActions.navigate({
                          routeName: 'previousTestPerformance',
                          params: {
                            blocks: response.data,
                            timer: '',
                            test_data: '',
                            test_series_name: '',
                            test_series_data: '',
                            path: ''
                          }
                        });
                        this.setState({ loading: false });
                        this.props.navigation.dispatch(navigateAction);
                      })
                }}
              >
                <View style={[styles.courseImageContainer,{ flex: 4}]}>
                  <Text style={[styles.test_name, {fontSize: 2 * vh}]}>View Performance</Text>
                </View>
              </TouchableNativeFeedback>
          </View>
        </View>
      );
    }
    if(item.Type == 'test' && !item.assignment) {
      return (
      <View>
            <View style={styles.courseCardContainer}>
              <TouchableNativeFeedback
                onPress = {()=> {
                    if(this.state.isReady && ( this.props.navigation.state.params.free || this.props.navigation.state.params.data.enrolled || item.free)){
                      const navigateAction = NavigationActions.navigate({
                        routeName: this.props.navigation.state.params.path == 'paid' ? 'testInstructions': 'testInstructions1', 
                        params: {
                          data: item,
                          test_series_name: this.props.navigation.state.params.data.course_name,
                          test_series_data: this.props.navigation.state.params.data,
                          path: this.props.navigation.state.params.path
                        },
                      });
                      this.props.navigation.dispatch(navigateAction);
                    }
                    else {
                      ToastAndroid.show('Please enrol to attempt the test', ToastAndroid.SHORT);
                    }
                  }} 
              >
                <View style={{flexDirection: 'column', flex: 7}}>
                  <Text style={styles.test_name}>{item.test_name} (Test)</Text>
                  <Text style={[styles.test_name, {marginTop: 1 * vh, color: 'green', fontFamily: 'Montserrat-SemiBold'}]}>{this.props.navigation.state.params.free? 'Start' : this.props.navigation.state.params.data.enrolled ? item.attempted ? "Attempt Again" : "Start" : item.free ? item.attempted ? "Attempt Again" : "Start": "Locked" }</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress = {()=> {
                  this.setState({ loading: true });
                  axios.get('https://classcast-198812.appspot.com/white_label/get_previous_records/'+item.test_id)
                      .then((response) => {
                        console.log("dsknlndsk: "+JSON.stringify(response.data));
                        const navigateAction = NavigationActions.navigate({
                          routeName: 'previousTestPerformance',
                          params: {
                            blocks: response.data,
                            timer: '',
                            test_data: '',
                            test_series_name: '',
                            test_series_data: '',
                            path: ''
                          }
                        });
                        this.setState({ loading: false });
                        this.props.navigation.dispatch(navigateAction);
                      })
                }}
              >
                <View style={[styles.courseImageContainer,{ flex: 4}]}>
                  <Text style={[styles.test_name, {fontSize: 2 * vh}]}>View Performance</Text>
                </View>
              </TouchableNativeFeedback>
          </View>
        </View>
      );
    }
    else if(item.Type = 'video') {
      console.log("snksjads: "+JSON.stringify(item))
      return (
            <View style={styles.courseCardContainer}>
              <View style={{flexDirection: 'column', flex: 7}}>
                <Text style={styles.h2}>{item.display_name} (video)</Text>
                {
                  <View style={{ marginTop: 2 * vh, width: 40 * vw}}>
                    <Button title={this.props.navigation.state.params.data.enrolled ? "Start" : "Locked" }
                      raised={true}
                      theme='dark'
                      overrides={{backgroundColor: "#fffff"}}
                        
                      />
                    </View>
                  }
              </View>
                <View style={[styles.courseImageContainer,{flex: 2}]}>
                      <Image source={{uri: this.props.navigation.state.params.free ? item.thumbnail_free_test : item.thumbnail}} style={styles.courseImage}/>
                </View>
              </View>

           );
    }
    else if(item.Type = 'pdf') {
      console.log("snksjads: "+JSON.stringify(item))
      return (
            <View style={styles.courseCardContainer}>
              <View style={{flexDirection: 'column', flex: 7}}>
                <Text style={styles.h2}>{item.display_name} (pdf)</Text>
                {
                  <View style={{ marginTop: 2 * vh, width: 40 * vw}}>
                    <Button title={this.props.navigation.state.params.data.enrolled ? "Start" : "Locked" }
                      raised={true}
                      theme='dark'
                      overrides={{backgroundColor: "3fffff"}}
                        onPress={() => {
                          if(this.props.navigation.state.params.data.enrolled){
                            axios.post(`https://classcast-198812.appspot.com/coursedata/generateSignedUrl`, {
                                "path": item.path
                              })
                                .then( response => {
                                  this.setState({startBuffering: false});
                                  this.navigateToScreen(this.props.navigation.state.params.path == 'paid' ? 'pdfViewer': 'pdfViewer1', response.data, item.block_id, this.props.navigation.state.params.data.course_name, item.display_name);
                                  //this.navigateToScreen('pdfViewer', response.data);
                                })
                            }
                            else {
                              ToastAndroid.show('Please enrol to view the course', ToastAndroid.SHORT);
                            }
                          }
                      }
                      />
                    </View>
                  }
              </View>
                <View style={[styles.courseImageContainer,{flex: 2}]}>
                      <Image source={{uri: this.props.navigation.state.params.free ? item.thumbnail_free_test : item.thumbnail}} style={styles.courseImage}/>
                </View>
              </View>

           );
    }
    else {
      console.log("snksjads: "+JSON.stringify(item))
      return (
            <View style={styles.courseCardContainer}>
              <View style={{flexDirection: 'column', flex: 7}}>
                <Text style={styles.h2}>{item.display_name} </Text>
                {
                  <View style={{ marginTop: 2 * vh, width: 40 * vw}}>
                    <Button title={this.props.navigation.state.params.data.enrolled ? "Start" : "Locked" }
                      raised={true}
                      theme='dark'
                      overrides={{backgroundColor: "3fffff"}}
                      />
                    </View>
                  }
              </View>
                <View style={[styles.courseImageContainer, {flex: 2}]}>
                      <Image source={{uri: this.props.navigation.state.params.free ? item.thumbnail_free_test : item.thumbnail}} style={styles.courseImage}/>
                </View>
              </View>

           );
    }
  }

  render () {
    console.log("meslfkmssadasssdmklsdfmle: "+JSON.stringify(this.state.courses.filter(function (value) { return (new Date() < new Date(value.end_date) && (new Date() > new Date(value.start_date) ) ) })  ))  
        
    return (
      <View style={styles.container}>
      
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 8 * vh, backgroundColor: '#ffffff'}}>
        <View style={{justifyContent:'flex-start', marginLeft:10}}>
        <Icon           
          name='arrow-back'
          color='#7741cd'
          type='material'
          size= {35} 
          onPress={() => this.handleBackButton()  }
          />
        </View>
        <View style={{marginLeft:0}}>
          <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: '#7741cd'}}> {this.props.navigation.state.params.data.course_name} </Text>
        </View>
        <View style={{justifyContent:'flex-end', marginRight: 10}}>
        
        </View>

      </View>
      { this.state.loading &&
          <View style={{alignSelf: 'center', position: 'absolute', alignSelf: 'center', height: 100 * vh, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="black" />
          </View>
      }
      <ScrollView>
             
      <CourseListPlaceholder onReady={this.state.isReady} animate="fade">
        <FlatList
          data={ this.props.navigation.state.params.free ? this.state.courses.filter(function (test) { return test.free }) : this.state.courses.filter(function (test) { return !test.free }) }
          showsVerticalScrollIndicator={false}
          renderItem={this._renderItem.bind(this) }
          keyExtractor={(item, index) => index.toString()}
        />
        </CourseListPlaceholder>
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
                      "test_series_id": this.props.navigation.state.params.data.course_id,
                      "teacher_id": 52
                    }
                    axios.post('https://classcast-198812.appspot.com/white_label/enrollment_from_token_test_series/', data)
                      .then((response) => 
                      {
                        this.setState({ accessCodeProcess: false });

                        if(response.data == 'Updated') {
                          this.setState({ accessCodeModal: false });
                          this.props.navigation.goBack(null);
                        }
                        else{
                          ToastAndroid.show('Invalid Access Code', ToastAndroid.SHORT);
                        }
                      })
                      .catch(err=>{
                        console.log("fdsnlkdsn: "+JSON.stringify(err));
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

        { this.props.navigation.state.params.path != 'course' && !this.props.navigation.state.params.free && !this.props.navigation.state.params.data.enrolled && this.props.navigation.state.params.data.amount != 0 && !this.props.navigation.state.params.data.access_token_only &&
          <TouchableNativeFeedback
            onPress={() => {
              const navigateAction = NavigationActions.navigate({
                routeName: 'buynowtest',
                params: {
                  data: this.props.navigation.state.params.data,
                  teacher_id: 52
                },
              });
              this.props.navigation.dispatch(navigateAction);
            }}
            >
              <View style={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: '#ffffff', fontSize: 5 * vw, textAlign: 'center'}}>Buy Now</Text>
              </View>
          </TouchableNativeFeedback>
        }
        { this.props.navigation.state.params.path != 'course' && !this.props.navigation.state.params.free && !this.props.navigation.state.params.data.enrolled && this.props.navigation.state.params.data.amount == 0 && !this.props.navigation.state.params.data.access_token_only &&
            <TouchableNativeFeedback
            onPress={() => {
              json_data = {
                        "test_series_id": this.props.navigation.state.params.data.course_id,
                        "teacher_id": 52,
                        "enrollment_method": 'Token',
                        "payement_mode": "None",
                        "payment_id": "None"
                      }
                  axios.post(`https://classcast-198812.appspot.com/white_label/add_test_enrollment/`, json_data)
                          .then(function (response){
                              console.log("sdjsadjksaesfsfddsds: "+JSON.stringify(response.data));
                              this.props.navigation.goBack(null);
                          }.bind(this))
                          .catch(function (error) {
                            console.log('errorsnsak: '+error);
                            ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                          });
            }}
            >
              <View style={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: '#ffffff', fontSize: 5 * vw, textAlign: 'center'}}>Join for Free</Text>
              </View>
            </TouchableNativeFeedback>
        }
        { this.props.navigation.state.params.path != 'course' && !this.props.navigation.state.params.free && !this.props.navigation.state.params.data.enrolled && this.props.navigation.state.params.data.access_token_only &&
            <TouchableNativeFeedback
            onPress={() => {
              this.setState({accessCodeModal: true})
            }}
            >
              <View style={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: '#ffffff', fontSize: 5 * vw, textAlign: 'center'}}>Have an Access Code</Text>
              </View>
            </TouchableNativeFeedback>
        }

      </View>
      )
  }
}

export default testList;

const styles = StyleSheet.create({
  
  container:{
     flex: 1,
     alignItems: 'center',
     backgroundColor: '#ffffff'
   },
   h2:{
    fontFamily: 'ProximaNova-Bold',
    paddingLeft: 1 * vw,
     fontSize: 3.2 * vh,
     color: 'black'
   },
   test_name:{
    fontFamily: 'Montserrat-Regular',
    paddingLeft: 1 * vw,
     fontSize: 2.5 * vh,
     color: 'black'
   },
   h3:{
    fontFamily: 'ProximaNova-Regular',
    paddingLeft: 1 * vw,
     fontSize: 2 * vh,
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
     flexDirection: 'row',
     justifyContent: 'space-between',
     width: 95 * vw,
     borderRadius: 2 * vw,
     backgroundColor:'#EBEBEB',
     marginTop: 1 * vh,
     padding: 1.5* vh,
     marginBottom: 1 * vh,
     alignSelf: 'center',
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
     width:'20%',
     alignSelf: 'center'
   },
   courseImage:{
     resizeMode:'contain',
     alignItems: 'flex-end',
     height: 8 * vh,
     width: 8 * vh,
     marginBottom: 0.5 * vh,
     alignSelf: 'center',
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
