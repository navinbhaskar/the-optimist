import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableNativeFeedback,
  Platform,
  Alert,
  FlatList,
  BackHandler,
  TextInput
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import {NavigationActions} from 'react-navigation';
import {MaterialIndicator} from 'react-native-indicators';
import * as Progress from 'react-native-progress';
import RenderQuestions from './renderQuestions';


const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;

class ongoingTest extends Component {


  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this.state = {
      timer: 600,
      ActiveSlide: 0,
      startTime: new Date(),
      blocks: [],
      questionContainerHeight: 0,
      questionIndex: 0,
      n_questions: 0,
      attempted: false,
      num_attempted: 0,
      modalTimeup: false,
      modalPerformance: false,
      totalScore: 0,
      currentIndex: -1,
      correctAnswer: -1,
      loadingCompleted: false,
      testCardShow: false,
      goal: [],
      subjects: [],
      activeGoal: 0,
      activeSubject: 0,
      isReady: false,
      sections: [],
      selectedSection: 0,
      timer: 0,
      loading: false,
      language: 'en',
      showReviewModal: false,
      showSubmitModal: false,
      optionLetter: ['A','B','C','D','E','F'],
    }
    this.handleBackButton = this.handleBackButton.bind(this);
    this.submitTest = this.submitTest.bind(this);
    this.isEqual = this.isEqual.bind(this);
  }

  handleBackButton() {
    this.setState({showSubmitModal: true});
    return true;
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  async componentDidMount() {
    console.log("sasdldsla : "+JSON.stringify(this.props.navigation.state.params.data));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({ sections: this.props.navigation.state.params.data.sections.map(data => ({name: data.title, active_question_number: 0})),
                    blocks: this.props.navigation.state.params.data,
                    loading: true
     });
    
    setInterval(() => {
      if(this.props.navigation.state.params.test_data.duration > this.state.timer) {
          this.setState({
            timer: this.state.timer+1
          })
      }
      else {
        this.submitTest()
      }

    }, 1000);
  }

  isEqual(a,b) { 
      console.log("nasknsakasn: "+JSON.stringify(a));
      console.log("nasknsakasnaa: "+JSON.stringify(b));
      if(a.length!=b.length) 
       return false; 
      else
      { 
      // comapring each element of array 
       for(var i=0;i<a.length;i++) 
       if(a[i]!=b[i]) 
        return false; 
        return true; 
      } 
    } 

  submitTest() {
    correct1 = this.state.blocks.sections.map(section=> ({ section_name: section.title ,data: section.blocks.filter(question=> { return ( (question.correctOption+1 == question.selectedOption) && question.attempted && (question.type == 'SMCQ') ) }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    correct2 = this.state.blocks.sections.map(section=> ({ section_name: section.title ,data: section.blocks.filter(question=> { return ( question.attempted && (question.type == 'MMCQ') ) }).filter(question1=> {return (this.isEqual(question1.correctOption, question1.selectedOption)) }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    correct3 = this.state.blocks.sections.map(section=> ({ section_name: section.title ,data: section.blocks.filter(question=> { return ( ( Math.abs(question.answer - question.answerGiven)/(question.answer) < 0.1 ) && question.attempted && (question.type == 'Numerical') ) }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    console.log("sadsoaisadoin : "+correct1+"||"+correct2+"||"+correct3);
    let correct = correct1+ correct2+ correct3;
    let attempted = this.state.blocks.sections.map(section=> ({ data: section.blocks.filter(question=> { return question.attempted }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);

    var temp = this.state.blocks;
    temp['correct'] = correct;
    temp['attempted'] = attempted;
    temp['marks'] = correct - (0.25 * (attempted - correct))

    axios.post(`https://classcast-198812.appspot.com/white_label/store_test_performance/`, temp)
      .then((response) => {
        console.log("API_response: "+ JSON.stringify(response.data));
        const navigateAction = NavigationActions.navigate({
          routeName: this.props.navigation.state.params.path == 'paid' ?  'testPerformance': 'testPerformance1',
          params: {
            blocks: this.state.blocks,
            timer: this.state.timer,
            test_data: this.props.navigation.state.params.test_data,
            test_series_name: this.props.navigation.state.params.test_series_name,
            test_series_data: this.props.navigation.state.params.test_series_data,
            path: this.props.navigation.state.params.path
          }
        });
        this.props.navigation.dispatch(navigateAction);
      })
      .catch((error) => {console.log("API_error")})

    console.log("fdsjkdsknds : "+JSON.stringify(this.state.blocks));
    this.setState({
      showReviewModal: false,
      showSubmitModal: false
    });
  }

  _renderItem = ({item, index}) => (
      <TouchableNativeFeedback
         onPress={() => {
          this.setState({ 
            selectedSection: index,
            questionIndex: this.state.sections[index].active_question_number
           })
         }}
      >
        <View style={{height: 6 * vh, marginLeft: 5 *vw, marginRight: 5 * vw, alignItems: 'center', justifyContent: 'center'}}>
           <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, color: this.state.selectedSection==index ? 'white': 'grey'}}>{item.name}</Text>
        </View>
      </TouchableNativeFeedback>
  );

  _renderQuestionIndex =  ({item, index}) => (
      <TouchableNativeFeedback
         onPress={() => {
          this.setState({questionIndex: index});
          temp = this.state.sections;
          temp[this.state.selectedSection].active_question_number = index;
          this.setState({sections: temp});
         }}
      >
        <View style={{height: 6 * vw, width: 6 * vw, marginLeft: 5 *vw, marginTop: 2 * vh, marginRight: 4 * vw, alignItems: 'center', justifyContent: 'center', backgroundColor: '#323131', borderRadius: 3 * vw}}>
           <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, color: this.state.sections[this.state.selectedSection].active_question_number==index ? 'white': 'grey'}}>{index+1}</Text>
        </View>
      </TouchableNativeFeedback>
  );


  render () {
      console.log("sasdldsla : "+JSON.stringify(this.props.navigation.state.params.data.sections.map(data => ({blocks: data.blocks, title: data.title})) ));
      return(
        <View style={styles.container}>
          <View style={styles.testHeader}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 2 * vw}}>
              <Progress.Pie progress={(this.props.navigation.state.params.test_data.duration - this.state.timer)/(this.props.navigation.state.params.test_data.duration)} size={6 * vw} color={'white'} />
            </View>
            <View style={{flexDirection: 'column', alignSelf: 'center'}}>
              <Text style={styles.headerText}>Timer: {Math.floor((this.props.navigation.state.params.test_data.duration - this.state.timer)/60)}:{((this.props.navigation.state.params.test_data.duration - this.state.timer) % 60) > 9 ? (this.props.navigation.state.params.test_data.duration - this.state.timer) % 60 : '0'+ (this.props.navigation.state.params.test_data.duration - this.state.timer) % 60}</Text>
              <Text style={styles.headerText}>{(this.props.navigation.state.params.test_series_name.length+this.props.navigation.state.params.test_data.test_name.length < 30) ? this.props.navigation.state.params.test_series_name+' - '+this.props.navigation.state.params.test_data.test_name: (this.props.navigation.state.params.test_series_name+ ' - '+this.props.navigation.state.params.test_data.test_name).substring(0,30)+' ...'}</Text>
            </View>
            <TouchableNativeFeedback
              onPress={() => {
                this.setState({ showReviewModal: true })
              }}
            >
              <Image
                style={{height: 7 * vw, width: 7 * vw, marginRight: 2 * vw, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}
                source={{uri: 'data:image/png;base64,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'}}
              />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.sectionHeader}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.sections}
              renderItem={this._renderItem}
              extraData={this.state}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.questionIndex}>
              { this.state.loading &&
                <FlatList
                  horizontal={true}
                  ref={(ref) => { this.flatListRef = ref; }}
                  showsHorizontalScrollIndicator={false}
                  data={this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks}
                  renderItem={this._renderQuestionIndex}
                  extraData={this.state}
                />
              }
            </View>
            <TouchableNativeFeedback onPress={()=> this.setState({showSubmitModal: true})}>              
              <View style={{height: 5 * vh, width: '19%', backgroundColor: '#323131', alignSelf: 'center', justifyContent: 'center', borderRadius: 4 * vw, alignItems: 'center'}}>
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, color: 'white'}}>Submit</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          { this.state.loading &&
            <Modal 
              isVisible={this.state.showSubmitModal}
              onRequestClose={() => {this.setState({showSubmitModal: false})}}>
              <View style={{height: 18 * vh, width: '70%', position: 'absolute', alignSelf: 'center', borderRadius: 2*vw, backgroundColor: 'white'}}>
                <View style={{height: 10 * vh, width: '100%', justifyContent: 'center'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, marginLeft: 2 * vw, marginRight: 2 * vw, color: 'black'}}> Are you sure you want to submit this test? </Text>
                </View>
                <View style={{flexDirection: 'row', height: 8 * vh}}>
                  <TouchableNativeFeedback onPress={()=>this.submitTest()}>
                    <View style={{height: 8 * vh, width: '50%', backgroundColor: '#323131', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 2 * vw}}>
                      <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: '#ffffff'}}> Yes </Text>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback onPress={()=> this.setState({showSubmitModal: false})}>
                    <View style={{height: 8 * vh, width: '50%', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 2 * vw}}>
                      <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw}}> No </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </Modal>
          }
          { this.state.loading &&
            <Modal 
            isVisible={this.state.showReviewModal}
            onRequestClose={() => {
              this.setState({showReviewModal: false})
            }}
            >
              <View style={{ height: 60 * vh, width: 70 * vw, backgroundColor: 'white', position: 'absolute', alignSelf: 'center', borderRadius: 2*vw }}>
                
                <View style={{backgroundColor: '#323131', borderTopLeftRadius: 2 * vw, borderTopRightRadius: 2 * vw}}>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.sections}
                    renderItem={this._renderItem}
                    extraData={this.state}
                  />
                </View>
                <ScrollView style={{width: '100%'}}>
                  <View style={{flexWrap: 'wrap', flexDirection: 'row', marginLeft: 5 * vw, marginRight: 5 * vw}}>
                    {
                    this.state.blocks.sections[this.state.selectedSection].blocks && this.state.blocks.sections[this.state.selectedSection].blocks.map((question, index)=>{
                      return(
                          <View style={{height: 10 * vw, width: 10 * vw, borderRadius: 5 * vw, margin: 5 * vw, alignItems: 'center', justifyContent: 'center', backgroundColor: question.attempted ? '#d267db': 'white', elevation: 5}}>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw}}>{index+1}</Text>
                          </View>
                        )
                    })
                    }
                  </View>
                </ScrollView>
                <TouchableNativeFeedback
                  onPress={()=>{
                     this.setState({
                      showReviewModal: false,
                      showSubmitModal: true})
                  }}
                >
                  <View style={{height: 8 * vh, width: '100%', backgroundColor: '#323131', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 2 * vw, borderBottomRightRadius: 2 * vw}}>
                    <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 5 * vw, color: 'white'}}>Submit</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <TouchableNativeFeedback onPress={() => this.setState({showReviewModal: false})}>  
                <Image
                  style={{height: 10 * vw, width: 10 * vw, position: 'absolute', bottom: 5 * vh, alignSelf: 'center'}}
                  source={{uri: 'data:image/png;base64,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'}}
                />
              </TouchableNativeFeedback>
            </Modal>
          }
          <ScrollView style={{width: '100%'}}>

            <View style={[styles.textContainer, {width: '96%'}]}>
              <RenderQuestions
                data={{text: "<strong>Question</strong>"+"<p>"+this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].question+"</p>", color: 'white'}}
                />
            </View>
            { this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].type == 'Numerical' &&
              <View style={{flex: 15, alignSelf: 'center'}}>
                <TextInput
                 style={{ height: 10 * vw, borderColor: 'gray', borderWidth: 2, borderRadius: 2 * vw, paddingLeft: 5 * vw, paddingRight: 5 * vw }}
                 keyboardType = 'numeric'
                 onChangeText={text => {
                    tempAttempt =this.state.blocks;
                    tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].attempted = true;
                    tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].answerGiven = text;
                    this.setState({blocks: tempAttempt});
                }}
                 value = {this.state.blocks['sections'][this.state.selectedSection].blocks[this.state.questionIndex].answerGiven}
               />
              </View>
            }
            { 
              this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].type == 'SMCQ' && this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].options && this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].options.map((options, index)=>{
                return(
                  <TouchableNativeFeedback
                    onPress={() => {
                      tempAttempt =this.state.blocks;
                      tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].attempted = true;
                      tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption = index+1;
                      this.setState({blocks: tempAttempt});
                    }}
                  >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.optionLabelExtension}>
                      <View style={styles.labelWrapper}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.state.optionLetter[index]}</Text>
                      </View>
                    </View>
                    <View style={[styles.textContainer, {marginTop: 1 * vh}]}>
                      { this.state.loading &&
                      <RenderQuestions
                        data={{text: "<p>"+options.value+"</p>", color: this.state.blocks['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption == (index+1).toString() ? '#d267db': 'white' }}
                        />
                      }
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                )
              })
            }
            { 
              this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].type == 'MMCQ' && this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].options && this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks[this.state.questionIndex].options.map((options, index)=>{
                return(
                  <TouchableNativeFeedback
                    onPress={() => {
                      tempAttempt =this.state.blocks;
                      if(tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption.filter(function (optionvalue) { return (optionvalue == index+1) }).length > 0 ){
                        //console.log("dnkasbksj: "+JSON.stringify(tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption));
                        tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption = tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption.filter(function (optionvalue) {return (optionvalue != index+1) });
                        console.log("abskjadsbjas: "+JSON.stringify(tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption))

                      }
                      else{
                       console.log("dnkasbksjno: "+JSON.stringify(tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption));
                       tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption.push(index+1)
                      }
                      console.log("abskjadsbjasggg: "+JSON.stringify(tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption))                      
                      tempAttempt['sections'][this.state.selectedSection].blocks[this.state.questionIndex].attempted = true;
                      
                      this.setState({blocks: tempAttempt});
                    }}
                  >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.optionLabelExtension}>
                      <View style={styles.labelWrapper}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.state.optionLetter[index]}</Text>
                      </View>
                    </View>
                    <View style={[styles.textContainer, {marginTop: 1 * vh}]}>
                      { this.state.loading &&
                      <RenderQuestions
                        data={{text: "<p>"+options.value+"</p>", color: (this.state.blocks['sections'][this.state.selectedSection].blocks[this.state.questionIndex].selectedOption.filter(function (optionvalue) { return (optionvalue == index+1) }).length > 0) ? '#d267db': 'white' }}
                        />
                      }
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                )
              })
            }
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 3 * vh}}>
              <TouchableNativeFeedback
                onPress={() => {
                  if(this.state.questionIndex != 0) {
                    temp = this.state.sections;
                    temp[this.state.selectedSection].active_question_number = this.state.questionIndex-1;
                    this.setState({sections: temp});
                    this.flatListRef.scrollToIndex({animated: true, index: this.state.questionIndex-1});
                    this.setState({questionIndex: this.state.questionIndex-1});
                  }
                 }}
              >
                <Image
                  style={{height: 10 * vw, width: 10 * vw}}
                  source={{uri: 'data:image/png;base64,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'}}
                />
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                onPress={() => {
                  if(this.state.questionIndex != this.props.navigation.state.params.data.sections[this.state.selectedSection].blocks.length-1) {
                    temp = this.state.sections;
                    temp[this.state.selectedSection].active_question_number = this.state.questionIndex+1;
                    this.setState({sections: temp});
                    this.flatListRef.scrollToIndex({animated: true, index: this.state.questionIndex+1});
                    this.setState({questionIndex: this.state.questionIndex+1});
                  }
                  else {
                    if(this.state.sections.length > this.state.selectedSection+1) {
                      this.setState({ 
                        questionIndex: 0,
                        selectedSection: this.state.selectedSection+1
                       });
                    }
                    else {
                      this.setState({showSubmitModal: true});
                    }
                  }
                 }}
              >
                <Image
                  style={{height: 10 * vw, width: 10 * vw}}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAIM8AACDPAGwo/07AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAJNQTFRFaHSSaXWSaXWTanaTbHeVbHiVbXmWb3qXdH+bfYihfoiigIqkh5CojZatj5iukJmvkZqvkZqwkpuwm6O3pKu9q7LCr7XFtbvKuL7MusDNvcLPvcLQvsPQvsTQv8TRwMXRwMXSwcbSzNDa3N/m3+Lo4eTq6evv6uzw7e7y+Pn6+fr7+vr7+vv8+/v8+/z8/v7/////xbzuLgAABBxJREFUeNrt3dkyA2EUhVExxZAg5jkh5iDn/Z/ODYUq7lzof6/1CGd/V91d1QsLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdE9vfe94sj9YcYlMw/uqqqrZwaJj5OmP5/VhuuEeaZZu6ovHLRcJc1jfPCkgy+ZLKSDZdZUCkj2UApKtVSkg2agUEG1QCoi2/KqAbLelgGhHvwRQMwVEWL1TQLbhXAHZTkoB0XpXClCAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFVNVs23kUgAJQAApAASiAVguYKEABClCAAhSgAAUoQAEKUIACFKCAOApQgAIUoAAFKEABClCAAhSgAAUoQAEKUIACFKAABShAAQpIMVaAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFKEABClCAAhSgABSAAlAACkABKIBGXSpAAQpQgAIUoAAFKEABClCAAhSgAAUoQAEfBey4jgJQAAogtYBnBSgABaAAFIACUAAKoFEXClCAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFKEABClCAAhSAAlAAuQWMXEcBKAAF0LZzBShAAQpQgAIUoAAFKEABClCAAhSgAAUoQAEKUIACFKAABShAAQpAASgABaAAFIACaNSZAhSgAAUoQAE/FbDrOgpAASgABaAAFIACUAAKQAEoAAWgABSAAlAACqD7ThWgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFCEAA9re//bE/9sf+2B/7Y3/sTwt8FGp/+9vf/va3v/3tb3/729/+9ncd+2N/7I/9sT/2x/7YH/tjf5rc348j7Y/9aZjfx9vf/va3v/3tb3/729/+9re//V3H/tgf+2N/7I/9sT/2x/7YH/tjf+xPt1zY3/72t7/97W9/+3/uv+M69sf+2B/7Y3/sj/2xP/bH/tgf+2N/7I/9sT//36X97W9/+9vf/va3v/3tb3/729/+BO8/s7/9sT/2J2//bdexP/bH/tgf+2N/7I/96b6x/e1vf/vb3/72t7/97W9/+9vf/tgf+2N/7I/9sT/2x/7YH/tjf+yP/emUif3tb3/729/+9re//e1vf/vb3/7YH/tjf+yP/WlJz/72t7/97W9/+9vf/va3v/3tb3/naX//K/vb3/72t7/97W9/+9vf/va3f/r+W85jf+yP/bE/9sf+2B/7Y3/sT3ed2D/acG7/ZKt39o92ZP9st7/s/2T/CMuv9o82sH+2kf2zrdk/3IP9s13bP9vmi/2zHdo/29LN1/0f7R+nP/58HTTdcI9Aw/v3x/8Hi44Rqbe+dzzZH6y4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/mDdi8i1suoDkNAAAAAElFTkSuQmCC'}}
                />
              </TouchableNativeFeedback>
            </View>
          </ScrollView>
        </View>
      )
  }

}
export default ongoingTest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEAEA',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 8 * vh,
    width: 100 * vw,
    backgroundColor: '#323131',
    elevation: 5,
  },
  headerText: {
    fontFamily: 'Montserrat-SemiBold', 
    fontSize: 3.5 * vw, 
    color: 'white', 
    marginLeft: 5 * vw
  },
  textContainer:{
    "width": '88%',
    marginTop: 2 * vh,
    marginBottom: 1 * vh,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  questionIndex: {
    height: 6 * vh,
    width: '80%',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  sectionHeader: {
    height: 6 * vh,
    width: '100%',
    backgroundColor: '#323131',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tncHeader: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionLabelExtension: {
    height: 5 * vh,
    width: '10%',
    backgroundColor: '#323131',
    borderTopLeftRadius: 3 * vh,
    borderBottomLeftRadius: 3 * vh,
    elevation: 5,
    paddingLeft: 0.5 * vh,
    justifyContent: 'center',
  },
  labelWrapper: {
    backgroundColor: '#eee',
    borderRadius: 2 * vh,
    height: 4 * vh,
    width: 4 * vh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  questionHeader: {
    width: vw * 94,
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    marginBottom: 0.1 * vh,
    marginTop: 1 * vh,
    borderTopRightRadius: 2 * vw,
    borderTopLeftRadius: 2 * vw,
    elevation: 6,
    flexDirection: 'row',
    padding: 1 * vw,
  },
  questionContainer: {
    width: vw * 94,
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    elevation: 6,
    padding: 3 * vw,
    borderBottomRightRadius: 2 * vw,
    borderBottomLeftRadius: 2 * vw,
  },
  optionContainer: {
    width: vw * 80,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    elevation: 6,
    marginTop: 1 * vh,
    padding: 3 * vw,
    borderTopRightRadius: 2 * vw,
    borderTopLeftRadius: 2 * vw,
    borderBottomRightRadius: 2 * vw,
    borderBottomLeftRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:  2 * vw,
    borderWidth: 1,
  },
  questionHeaderPositive: {
    marginLeft: 55 * vw, 
    backgroundColor: 'green', 
    height: 3 * vh, 
    width: 5 * vh,
    borderRadius: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PreviousButton: {
    marginTop: 4 * vh,
    marginLeft: 3 * vw,
    height: 6 * vh,
    width: 20 * vw,
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    height: 7 * vh,
    width: '100%',
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7741cd'
  },
  submitButton: {
    height: 4 * vh,
    width: 30 * vw,
    elevation: 6,
    backgroundColor: '#7900EA',
    borderRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeQuestion: {
    height: 4 * vh,
    width: 4 * vh,
    backgroundColor: '#7900EA',
    borderRadius: 2 * vh,
    marginLeft: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inActiveQuestion: {
    height: 4 * vh,
    width: 4 * vh,
    backgroundColor: 'white',
    borderRadius: 2 * vh,
    marginLeft: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeQuestion1: {
    height: 7 * vh,
    width: 7 * vh,
    marginTop: 2 * vh,
    marginLeft: 2 * vw,
    backgroundColor: '#7900EA',
    borderRadius: 3.5 * vh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionHeaderNegative: {
    marginLeft: 2 * vw, 
    backgroundColor: 'white', 
    height: 3 * vh, 
    width: 5 * vh,
    borderRadius: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: vw * 100,
    height: vh * 8,
    backgroundColor: '#EBEAEA',
  },
  header1: {
    width: vw * 39.6,
    height: vh * 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header2: {
    width: vw * 60,
    height: vh * 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeSnapText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inactiveSnapText: {
    color: '#C385FC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 20,
  },
  imageModal: {
    height: 30 * vh,
    width: 70 * vw,
    display: 'flex',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#73009e',
    marginLeft: 10 * vw,
    marginTop: 10 * vh,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    height: 5 * vh,
    width: 20 * vw,
    display: 'flex',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#73009e',
    marginTop: 10 * vh,
  },
  goalContainer: {
    height: 30 * vh,
    width: 100 * vw,
    marginTop: 2.5 * vh,
    paddingLeft: 7.5 * vw,
  },
  goalWrapper: {
    position: 'absolute',
    top: 20,
  },
  goalCardWrapper: {
    marginTop: 15 * vh,
    marginLeft: 10 * vw,
    //height: 24 * vh,
    width: 35 * vw,

    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCard: {
    height: 22 * vh,
    width: 22 * vh,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 2 * vw,
  },
  currentConfigContainer: {
    flexDirection: 'row',
    width: 100 * vw,
    justifyContent: 'space-around',
  },
  goalImage: {
    height: 10 * vh,
    width: 10 * vh,
    // borderRadius: 5 * vh,
    marginBottom: 1 * vh,
  },
  loadingTimeIndicatorBackground: {
    height: 7 * vh,
    width: 100 * vw,
  },
  loadingTopicsHeader: {
    fontSize: 6 * vw,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    marginTop: vh,
    marginLeft: 5 * vw,
    marginBottom: vh,
  },
  topicListItem: {
    backgroundColor: 'white',
    height: 7.5 * vh,
    width: '100%',
    flexDirection: 'row',
    marginLeft: 5 * vw,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingLeft: 4 * vw,
    elevation: 10,
  },
  bullet: {
    width: 2.5 * vw,
    height: 2.5 * vw,
    borderRadius: 1.25 * vw,
    borderWidth: 0.5 * vw,
    borderColor: '#C596EC',
    marginRight: 4 * vw,
  },

})