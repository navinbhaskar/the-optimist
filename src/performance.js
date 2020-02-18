import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableNativeFeedback,
  ActivityIndicator
} from 'react-native'
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';
const moment = require('moment');

class performance extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Performance',
  })

  constructor(props) {
    super(props);
    this.groupBy = this.groupBy.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.calculateScore = this.calculateScore.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this._renderDates = this._renderDates.bind(this);
    this.isEqual = this.isEqual.bind(this);
    this.state = {
      startBuffering: true,
      blocks: [],
      standard: null,
      isReady: false,
      uniqueDates: [],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  }


  groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue.test_name] = result[currentValue.test_name] || []).push(
        currentValue
      );
      console.log(result);
      return result;
    }, {});
  };

  componentDidMount() {
    axios.get('https://classcast-198812.appspot.com/white_label/get_previous_records_all/')
      .then((response) => {
        console.log("dudskdsjL "+JSON.stringify(response.data))
        console.log("dudsknjhdsjLLLL "+JSON.stringify(response.data.sort((a,b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0)).reduce((result, currentValue) => {( result[currentValue.test_name] = result[currentValue.test_name] || []).push(currentValue); return result;}, {})   ));
        let unique = [...new Set(response.data.sort((a,b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0)).map(item => moment(item.timestamp).format('ll') ))];
        console.log("sdnnaand"+JSON.stringify(unique));
        this.setState({ 
          uniqueDates: unique,
          blocks: response.data,//.sort((a,b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0)),
          isReady: true
        });
      })
  }

  calculateScore =(item)=> {
    console.log("dsanlknads: "+JSON.stringify(item));
    let attempted = item.sections.map(section=> ({ data: section.blocks.filter(question=> { return question.attempted }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);

    correct1 = item.sections.map(section=> ({ section_name: section.title ,data: section.blocks.filter(question=> { return ( (question.correctOption+1 == question.selectedOption) && question.attempted && (question.type == 'SMCQ') ) }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    correct2 = item.sections.map(section=> ({ section_name: section.title ,data: section.blocks.filter(question=> { return ( question.attempted && (question.type == 'MMCQ') ) }).filter(question1=> {return (this.isEqual(question1.correctOption, question1.selectedOption)) }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    correct3 = item.sections.map(section=> ({ section_name: section.title ,data: section.blocks.filter(question=> { return ( ( Math.abs(question.answer - question.answerGiven)/(question.answer) < 0.1 ) && question.attempted && (question.type == 'Numerical') ) }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    correct = correct1+correct2+correct3;
    return (correct * 4 - (attempted - correct))
  }

  calculateTotal =(item)=> {
    let  total = item.sections.map(section=> ({ data: section.blocks.filter(question=> { return question }).length }) ).reduce(function (accumulator, pilot) {return accumulator + pilot.data;}, 0);
    return total*4
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

  _renderItem ({item, index}) {
    
    return (
      <TouchableNativeFeedback
        onPress = {()=> {
          const navigateAction = NavigationActions.navigate({
            routeName: 'previousTestPerformance',
            params: {
              blocks: item,
              timer: '',
              test_data: '',
              test_series_name: '',
              test_series_data: '',
              path: ''
            }
          });
          this.props.navigation.dispatch(navigateAction);
        }}
      >
            <View style={[styles.courseCardContainer, {marginBottom: 2 * vh}]}>
            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.h2, {marginLeft: 5 * vw}]}>{item.test_name == '' ? 'Test' : item.test_name} </Text>
                <Text style= {{fontFamily:'ProximaNova-Regular', fontSize: 1.8 * vh, marginLeft: 5 * vw}} >Score: {this.calculateScore(item)} / {this.calculateTotal(item)} </Text>
                <Text style={[styles.h2, {marginLeft: 5 * vw}]}>View Performance</Text>
              </View>
            </View>
              
            </View>
      </TouchableNativeFeedback>
    );
      
  }

  _renderDates ({item, index}) {
    
    return (
            <View style={[styles.courseCardContainer, {marginLeft: 5 * vw}]}>
            <View style={{height: 5 * vw, width: 5 * vw, borderRadius: 2.5 * vw, backgroundColor: 'green', position: 'absolute', left: -2 * vw}}>
            </View>
            <View style = {{flexDirection: 'column', borderLeftWidth: 1 * vw, borderColor: 'green'}}>

              <View style={{flexDirection: 'column'}}>
                <Text style= {{fontFamily:'ProximaNova-SemiBold', fontSize: 2 * vh, marginLeft: 5 * vw}} > {item} </Text>
              </View>
              <View style={{marginBottom: 5 * vh, marginLeft: 10 * vw}}>
                <FlatList
                  data={this.state.blocks.filter(question=> { return  moment(question.timestamp).format('ll') == item }) }
                  extraData={this.state}
                  initialNumToRender={5}
                  showsVerticalScrollIndicator={false}
                  renderItem={this._renderItem}
                  horizontal={false}

                />
              </View>
            </View>
              
            </View>
    );
      
  }

  render () {
    return (
      <View style={styles.container}>
        { !this.state.isReady &&
          <View style={{alignSelf: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        }
        <View style={{marginTop: 5 * vh}}>
          <FlatList
            data={this.state.uniqueDates}
            extraData={this.state}
            initialNumToRender={5}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderDates}
            horizontal={false}
          />
        </View>
      </View>
    )
}
}

export default performance

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  courseCardContainer:{
     width: 100*vw,
     borderRadius: 1.4 * vw,
     alignSelf: 'center'
   },
})
