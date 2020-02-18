
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import {NavigationActions} from 'react-navigation';
// Navigators
import {createDrawerNavigator, createStackNavigator, createBottomTabNavigator, createAppContainer, createMaterialTopTabNavigator, createSwitchNavigator } from 'react-navigation';
import SideMenu from './SideMenu';

// StackNavigator screens
import ItemList from './ItemList'
import practice from './practice'
import Item from './Item'
import notifications from './notifications'
import selectExam from './selectExam'
// TabNavigator screens
import TabA from './TabA'
import TabB from './TabB'

// Plain old component
import Plain from './Plain'
import CustomTabBar from './customBarBottom'
import { Icon } from 'react-native-elements'
import TeacherHome from './TeacherHome'
import teacherAbout from './teacherAbout'
import CourseHome from './CourseHome'
import video from './video'
import videoBlock from './videoBlock'
import pdfViewer from './pdfViewer'
import assignmentQuestions from './assignmentQuestions'
import Signup from './signup'
import UserDetails from './userdetails'
import addTeachers from './addTeachers'
import { fromRight} from 'react-navigation-transitions'
import AuthCheck from './AuthCheck'
import accessCode from './accessCode'
import Courses from './Courses'
import ClassUpdates from './ClassUpdates'
import addParent from './addParent'
import addDetails from './addDetails'
import profileProgress from './profileProgress'
import webViewer from './webView'
import test_list from './teacher_home/test_list'
import viewTest from './teacher_home/viewTest'
import imageList from './imageList'
import youtubeVideo from './youtubePlayer'
import crashCourse from './crash_course/crashCourse'
import studyMaterial from './crash_course/studyMaterial'
import discussion from './crash_course/discussion'
import selectPackage from './crash_course/selectPackage'
import youTubeWebView from './youTubeWebView'
import Course from './CourseList'
import chapterList from './chapterList'
import buynow from './selectPackage'
import buynowtest from './selectTestPackage'
import testList from './testList'
import testInstructions from './test/loadingTest'
import ongoingTest from './test/ongoingTest'
import testPerformance from './test/testPerformance'
import review from './test/review'
import performance from './performance'
import previousTestPerformance from './previousTestPerformance'

export const Playground = createStackNavigator({
  ItemList: { screen: ItemList },
  testList: { screen: testList },
  Item: { screen: Item },
  buynowtest: { screen: buynowtest },
  testInstructions: { screen: testInstructions },
  ongoingTest: { screen: ongoingTest },
  testPerformance: { screen: testPerformance },
  review : { screen: review },
  video: { screen: video },
  pdfViewer: { screen: pdfViewer },
}, {
  initialRouteName: 'ItemList'
})

export const PracticePlayground = createStackNavigator({
  practice: { screen: practice },
  testList1: { screen: testList },
  Item1: { screen: Item },
  buynowtest1: { screen: buynowtest },
  testInstructions1: { screen: testInstructions },
  ongoingTest1: { screen: ongoingTest },
  testPerformance1: { screen: testPerformance },
  review1 : { screen: review },
  video1: { screen: video },
  pdfViewer1: { screen: pdfViewer },
}, {
  initialRouteName: 'practice'
})

export const Tabs = createBottomTabNavigator({
  
  Home: { screen: TabB, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh, justifyContent: 'center', alignItems: 'center'}}>
        <Icon
          name='home'
          type='foundation'
          size={ tintColor == '#6044f0' ? 8 * vw: 6 * vw}
          color= {tintColor}
        />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Course</Text>
      </View>
      )
  } },
  Tabs: { screen: ItemList, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center'}}>
        <Icon
          name='gamepad'
          type='font-awesome'
          size={ tintColor == '#6044f0' ? 8 * vw: 6 * vw}
          color= {tintColor}
        />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Test</Text>
      </View>
      )
  } },
  TabTest: { screen: practice, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center'}}>
        <Icon
          name='copy'
          type='font-awesome'
          size={ tintColor == '#6044f0' ? 8 * vw: 6 * vw}
          color= {tintColor}
        />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Practice</Text>
      </View>
      )
  } }
}, {
  tabBarComponent: props => (
  <CustomTabBar
      {...props}/> ),
  tabBarOptions: {
    activeTintColor: "#6044f0",
    inactiveTintColor: "#c1c8db"
  },
  initialRouteName: 'Home',
  navigationOptions: {
        header: null,
    }
})

export const TeacherHomeNavigator = createBottomTabNavigator({
  Courses: { screen: Courses, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh, justifyContent: 'center', alignItems: 'center', elevation: 3}}>
        
        <Icon
          name='book'
          type='font-awesome'
          size={ tintColor == '#6044f0' ? 8 * vw: 6 * vw}
          color= {tintColor}
        />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Courses</Text>
      </View>
      )
  } },
  Updates: { screen: ClassUpdates, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center',}}>
        <Icon
          name='comment'
          type='font-awesome'
          size={ tintColor == '#6044f0' ? 8 * vw: 6 * vw}
          color= {tintColor}
        />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Updates</Text>
      </View>
      )
  } },
  Tests: { screen: test_list, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center',}}>
        <Icon
          name='archive'
          type='font-awesome'
          size={ tintColor == '#6044f0' ? 8 * vw: 6 * vw}
          color= {tintColor}
        />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Tests</Text>
      </View>
      )
  } },
  
}, {
  tabBarComponent: props => (
  <CustomTabBar
      {...props}/> ),
  tabBarOptions: {
    activeTintColor: "#6044f0",
    inactiveTintColor: "#c1c8db",
    inactiveTintColor: "#aeadb2",
    style: {
    backgroundColor: '#222126',
  },
  },
  lazy: true,
  initialRouteName: 'Courses',
})


export const crashCourseNavigator = createMaterialTopTabNavigator({
  Courses: { screen: crashCourse, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh, justifyContent: 'center', alignItems: 'center', elevation: 3}}>
        <Text style={{fontSize: 3 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Videos</Text>
      </View>
      )
  } },
  discussion: { screen: discussion, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center',}}>
        <Text style={{fontSize: 3 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Discussions</Text>
      </View>
      )
  } },
  studyMaterial: { screen: studyMaterial, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 3 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Materials</Text>
      </View>
      )
  } },
  
}, {
  tabBarComponent: props => (
  <CustomTabBar
      {...props}/> ),
  tabBarOptions: {
    activeTintColor: "#6044f0",
    inactiveTintColor: "#c1c8db",
    inactiveTintColor: "#aeadb2",
    style: {
    backgroundColor: '#222126',
  },
  },
  lazy: true,
  initialRouteName: 'Courses',
})

export const HomeStack = createStackNavigator({
  Home: { screen: Tabs },
  TeacherArea: { screen: TeacherHomeNavigator,
                  navigationOptions: ({ navigation }) => ({
                    headerTitle: <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: 'white'}}>{navigation.state.params.data.firstname+ ' '+navigation.state.params.data.lastname+ ' Sir'}</Text> ,
                    headerStyle: {
                      backgroundColor: '#874acf',
                    },
                    headerTitleStyle: { color: 'white' },
                    headerTintColor: 'white',
                }), },
  CourseHome: {screen: CourseHome,
                  navigationOptions: ({ navigation }) => ({
                  title: `${navigation.state.params.display_name}`,
                  headerStyle: {
                    backgroundColor: '#874acf',
                  },
                  headerTitleStyle: { color: 'white' },
                  headerTintColor: 'white',
                  style: {
                    backgroundColor: '#874acf',
                    height: 8 * vh
                  },
                }), },
  accessCode: { screen: accessCode,
    navigationOptions: { 
      headerTitle: <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: 'white'}}>Add Classrooms</Text>  
      } 
            },
  video: {screen: video},
  videoBlock: { screen: videoBlock },
  profileProgress: { screen: profileProgress },
  addParent: { screen: addParent },
  addDetails: { screen: addDetails },
  pdfViewer: { screen: pdfViewer },
  assignmentQuestions: { screen: assignmentQuestions },
  addTeachers: { screen: addTeachers},
  webViewer: { screen: webViewer },
  viewTest: { screen: viewTest },
  imageList: { screen: imageList },
  discussion: { screen: discussion },
  selectPackage: { screen: selectPackage },
  Course: { screen: Course },
  chapterList: { screen: chapterList,
                  navigationOptions: {
                    header: null
                  } },
  buynow: { screen: buynow },
  performance: { screen: performance },
  previousTestPerformance: { screen: previousTestPerformance },
  
  crashCourseNavigator: { screen: crashCourseNavigator,
    navigationOptions: ({ navigation }) => ({
                    headerTitle: <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: 'white'}}>{navigation.state.params.display_name}</Text> ,
                    headerStyle: {
                      backgroundColor: '#874acf',
                    },
                    headerTitleStyle: { color: 'white' },
                    headerTintColor: 'white',
                }),
   },
  notification: { screen: notifications,
    navigationOptions: { 
      headerTitle: <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: 'white'}}>Notification</Text>  
      }
   }
}, {
  initialRouteName: 'Home',
  transitionConfig: () => fromRight(),
})

export const Drawer =createDrawerNavigator({
  Playground: { screen: Playground },
  PracticePlayground: { screen: PracticePlayground },
  HomeStack: { screen: HomeStack },
  Plain: { screen: Plain },
},{
  lazy: true,
  initialRouteName: 'HomeStack',
  contentComponent: SideMenu,
  drawerWidth: 300
})


export const Login1 = createStackNavigator({
  Login: { screen: Signup },
  UserDetails: { screen: UserDetails },
  selectExam: { screen: selectExam },
  accessCode: { screen: accessCode },
  Drawer: { screen: Drawer}
}, {
  lazy: true,
  initialRouteName: 'Login',
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
})

export const Authstack = createSwitchNavigator({
  Login2: {screen: Login1},
  AuthCheck: {screen: AuthCheck},
  youtubeVideo: { screen: youtubeVideo },
  Drawer: {screen: Drawer}
}, {
  lazy: true,
  initialRouteName: 'AuthCheck',
})

const AuthFlowContainer = createAppContainer(Authstack);

export default AuthFlowContainer;