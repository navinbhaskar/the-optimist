import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View, Image, TouchableOpacity, Linking, TouchableNativeFeedback} from 'react-native';
import { Badge, Divider } from 'react-native-elements';
import CustomHeader from "./CustomHeader";
import firebase from 'react-native-firebase';
import { DrawerActions } from 'react-navigation-drawer';
import axios from "axios/index";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';

const USER_DP_MALE = require('./images/user-hp.png');
const USER_DP_FEMALE = require('./images/user-student.png');

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  constructor(props) {
    super(props);
    this.signOutUser = this.signOutUser.bind(this);
    this.state = {
      image: '',
      name: '',
      standard: '',
      gender: 'M',
      tncModalVisible: false,
      modalVisible: false,
      flag: false,
      data: [],
      completeprofile: false,
      completion: 0,
      rank: '',
      score: '',
      video_count: '',
    }
  }

  uploadFile(uri, name, type){
    let path= 'something/' + name;
    let uploaded = false;
    console.log('dsdasi :'+uri);
    firebase.storage()
        .ref(path)
        .putFile(uri).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            let state = {};
            console.log("progress1:" + JSON.stringify(snapshot));
            this.setState({
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
            });
            console.log("progress:" + this.state.progress);


            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              if(!uploaded){
                console.log("sakasbkL: "+snapshot.downloadURL);
                this.setState({image: snapshot.downloadURL});
                axios.post('https://classcast-198812.appspot.com/users/completeprofile', {'photo': snapshot.downloadURL})
              }
            }
          },
            (error) => {
            console.error(error);
            },
      
    );

  }


  selectimage = () => {
    ImagePicker.openPicker({
      width: 600,
      height: 600,
      cropping: true,
      includeBase64: true
    }).then(image => {
      this.setState({flag: true});
      //let photo = 'data:' + image.mime + ';base64,' + image.data;
      this.uploadFile(image.path, image.modificationDate, "image")
      })
   
  };
  captureimage = () => {
    ImagePicker.openCamera({
      width: 600,
      height: 600,
      cropping: true,
      includeBase64: true
    }).then(image => {
      this.uploadFile(image.path, image.modificationDate, "image")
      //let photo = 'data:' + image.mime + ';base64,' + image.data;
  });
}

  componentDidMount() {
    axios.get('https://classcast-198812.appspot.com/users/user_data_updated')
            .then(res => {
              console.log("hsjsa: "+JSON.stringify(res.data));
              this.setState({name: res.data.name});
              this.setState({standard: res.data.standard})
              if(res.data.gender == '2') {
                this.setState({gender: 'F'})
              }
              else {
                this.setState({gender: 'M'})
              }
              if(res.data.photo != '') {
                this.setState({image: res.data.photo})
              }
            })
            .catch((error) => {
                console.log("hsjsaerror"+JSON.stringify(error))
            })

    axios.get('https://classcast-198812.appspot.com/users/profile_progress')
        .then((response) => {
          console.log("dasmlaskmdsa: "+JSON.stringify(response.data.profile_progress));
          this.setState({
            data: response.data.profile_progress,
            completion: response.data.progress
          });
        })

    axios.get('https://classcast-198812.appspot.com/performance/getkarampoints')
        .then(function (response){
          console.log("kbsaasjds: "+JSON.stringify(response.data));
          this.setState({rank: response.data.Rank});
          this.setState({score: response.data.Score});
          this.setState({video_count: response.data.Video_count});
        }.bind(this))
        .catch(function(error){
          console.log('error');
        });

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      axios.get('https://classcast-198812.appspot.com/users/profile_progress')
        .then((response) => {
          console.log("dasmlaskmdsa: "+JSON.stringify(response.data.profile_progress));
          this.setState({
            data: response.data.profile_progress,
            completion: response.data.progress
          });
        })
      })
      axios.get('https://classcast-198812.appspot.com/performance/getkarampoints')
        .then(function (response){
          console.log("kbsaasjds111: "+JSON.stringify(response.data));
          this.setState({rank: response.data.Rank});
          this.setState({score: response.data.Score});
          this.setState({video_count: response.data.Video_count});
        }.bind(this))
        .catch(function(error){
          console.log('error');
        });
  }


  signOutUser = async () => {
    console.log("logout");
    try {
      this.props.navigation.dispatch(DrawerActions.toggleDrawer());
        this.props.navigation.dispatch(StackActions.popToTop());
        this.props.navigation.navigate('Login1', {}, NavigationActions.navigate({ routeName: 'Login' }));
        await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
}

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.aboutUserSection}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.userImageContainer}>
                <Image 
                  source={{uri: this.state.image != '' ? this.state.image : this.state.gender == 'M' ? 'https://firebasestorage.googleapis.com/v0/b/classcast-198812.appspot.com/o/something%2Fuser-hp.png?alt=media&token=46fd302d-a917-412b-b3ff-7a07c07b4a76': 'https://firebasestorage.googleapis.com/v0/b/classcast-198812.appspot.com/o/something%2Fuser-student.png?alt=media&token=3b4078b6-df46-4539-b969-77723fdd791e'}}
                  style={styles.userImage}/>
              </View>
              <View style={{marginLeft: 5 * vw, marginTop: 1 * vh,}}>
                <Text style={styles.userName}>
                  {this.state.name.split(' ')[0]}
                </Text>
                <Text style={styles.class}>{this.state.standard}</Text>
                <Text 
                  onPress={() => {this.setState({completeprofile: true})}}
                  style={styles.editProfile}>Edit profile</Text>
              </View>
            </View>
            <View>
            { this.state.completion != 1 &&
              <View style={{marginTop: 2 * vh}}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Progress.Bar progress={this.state.completion} width={200} />
                  </View>
                  <Text style={{color: '#211482', fontSize: 3.5 * vw, fontFamily: 'Montserrat-SemiBold', marginLeft: 3 * vw, paddingHorizontal: 0, padding: 0}}>{this.state.completion*100}%</Text>
                </View>
                <Text 
                  onPress={() => {this.setState({completeprofile: true})}}
                  style={{color: '#211482', fontSize: 3.5 * vw, fontFamily: 'Montserrat-SemiBold', textDecorationLine: 'underline'}}>Complete profile</Text>
              </View>
            }
              
            </View>
          </View>
          
        
          <View style={{marginTop: 10 * vh}}>

              <Text style={styles.navItemStyle} onPress={()=> {
                this.props.navigation.navigate('performance');
              }}>
                Performance
              </Text>
            
              <Text style={styles.navItemStyle} onPress={()=> {
                Linking.openURL('whatsapp://send?text=Hello%20Sir%2C%20I%27m%20'+ this.state.name+ '&phone=+917048972696')
              }}>
                Talk to Us
              </Text>
              
              <Text style={styles.navItemStyle} onPress={()=> {
                this.setState({tncModalVisible: true})
              }}>
                Terms of Use
              </Text>
              
            </View>

        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={{color: 'white', fontSize: 1 * vh, textAlign: 'right'}}>Built with love by team ClassCast  </Text>
        </View>
        {
          <Modal backdropOpacity={0.6}
            backdropColor="black"
            transparent={true}
            isVisible={this.state.tncModalVisible}
            onRequestClose={() => {
              this.setState({tncModal: false})
          }}>
          <View style={styles.tncModal}>
        <ScrollView>
          <Text style={styles.tncHeadingBig}>Terms of Use</Text>
          <Text style={styles.tncHeadingSmall}>Agreement to terms:</Text>
          <Text style={styles.tncText}>These terms and conditions outline the rules and regulations for the use of
            ClassCast's Website and mobile-based application. By accessing this website we assume you accept these terms
            and conditions in full. Do not continue to use ClassCast's application if you do not accept all of the terms
            and conditions stated on this page.</Text>
          <Text style={styles.tncText}>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and
            any or all Agreements:
          </Text>
          <Text style={styles.tncText}>
            “Client”, “You” and “Your” refers to you, the person accessing this website and accepting the Company’s
            terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”,
            “Parties”, or “Us”, refers to both the Client and ourselves, or either the Client or ourselves.
          </Text>
          <Text style={styles.tncText}>
            All terms refer to the offer, acceptance and consideration of payment necessary to undertake
            the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a
            fixed duration, or any other means, for the express purpose of meeting the Client’s needs in respect of
            provision of the Company’s stated services/products, in accordance with and subject to, prevailing law of
            India. Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she
            or they, are taken as interchangeable and therefore as referring to same.
          </Text>

          <Text style={styles.tncHeadingSmall}>Cookies</Text>
          <Text style={styles.tncText}>
            We employ the use of cookies. By using ClassCast's application you consent to the use of cookies in
            accordance with ClassCast’s privacy policy.Most of the modern day interactive application use cookies to
            enable us to retrieve user details for each visit. Cookies are used in some areas of our app to enable the
            functionality of this area and ease of use for those people visiting. Some of our affiliate / advertising
            partners may also use cookies.License
            Unless otherwise stated, ClassCast and/or it’s licensors own the intellectual property rights for
            all material on ClassCast. All intellectual property rights are reserved. You may view pages from
            http://www.classcast.in for your own personal use subject to restrictions set in these terms and conditions.
          </Text>
          <Text style={styles.tncText}>As a user, you agree not to:</Text>
          <Text style={styles.tncTextListItem}>
            1. Republish material from http://www.classcast.in
          </Text>
          <Text style={styles.tncTextListItem}>
            2. Sell, rent or sub-license material from http://www.classcast.in
          </Text>
          <Text style={styles.tncTextListItem}>
            3. Reproduce, duplicate or copy material from http://www.classcast.in. Redistribute content from ClassCast
            (unless content is specifically made for redistribution)
          </Text>
          <Text style={styles.tncTextListItem}>
            4. Hyperlinking to our Content
          </Text>
          <Text style={styles.tncText}>
            The following organizations may link to our Web site without prior written approval:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. Search engines
          </Text>
          <Text style={styles.tncTextListItem}>
            2. News organizations
          </Text>
          <Text style={styles.tncTextListItem}>
            3. Online directory distributors when they list us in the directory may link to our Web site in the same
            manner as they hyperlink to the Web sites of other listed businesses
          </Text>
          <Text style={styles.tncTextListItem}>
            4. Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and
            charity fundraising groups which may not hyperlink to our Web site.
          </Text>
          <Text style={styles.tncText}>
            These organizations may link to our home page, to publications or to other Web site information so long as
            the link:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. is not in any way misleading
          </Text>
          <Text style={styles.tncTextListItem}>
            2. does not falsely imply sponsorship, endorsement or approval of the linking party and its products or
            services
          </Text>
          <Text style={styles.tncTextListItem}>
            3. fits within the context of the linking party's site
          </Text>
          <Text style={styles.tncText}>
            We may consider and approve in our sole discretion other link requests from the following types of
            organizations:
          </Text>
          <Text style={styles.tncText}>
            commonly-known consumer and/or business information sources such as Chambers of Commerce, Indian Automobile
            Association, AARP and Consumers Union; dot.com community sites; associations or other groups representing
            charities, including charity giving sites,
            online directory distributors; internet portals; accounting, law and consulting firms whose primary clients
            are businesses; and educational institutions and trade associations.
          </Text>
          <Text style={styles.tncText}>
            We will approve link requests from these organizations if we determine that:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. the link would not reflect unfavorably on us or our accredited businesses (for example, trade
            associations or other organizations representing inherently suspect types of business, such as work-at-home
            opportunities, shall not be allowed to link)
          </Text>
          <Text style={styles.tncTextListItem}>
            2. the organization does not have an unsatisfactory record with us
          </Text>
          <Text style={styles.tncTextListItem}>
            3. the benefit to us from the visibility associated with the hyperlink outweighs the absence of; and
          </Text>
          <Text style={styles.tncTextListItem}>
            4. where the link is in the context of general resource information or is otherwise consistent with
            editorial content in a newsletter or similar product furthering the mission of the organization.
          </Text>
          <Text style={styles.tncText}>
            These organizations may link to our home page, to publications or to other Web site information so long as
            the link:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. is not in any way misleading
          </Text>
          <Text style={styles.tncTextListItem}>
            2. does not falsely imply sponsorship, endorsement or approval of the linking party and it products or
            services
          </Text>
          <Text style={styles.tncTextListItem}>
            3. fits within the context of the linking party's site.
          </Text>
          <Text style={styles.tncText}>
            If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,
            you must notify us by sending an e-mail to prashant@classcast.in.
          </Text>
          <Text style={styles.tncText}>
            Please include your name, your organization name, contact information (such as a phone number and/or e-mail
            address) as well as the URL of your site, a list of any URLs from which you intend to link to our
            app/Website, and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a
            response.
          </Text>
          <Text style={styles.tncText}>
            Approved organizations may hyperlink to our Web site as follows:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. By use of our corporate name; or
          </Text>
          <Text style={styles.tncTextListItem}>
            2. By use of the uniform resource locator (Web address) being linked to; or
          </Text>
          <Text style={styles.tncTextListItem}>
            3. By use of any other description of our Web site or material being linked to that makes sense within the
            context and format of content on the linking party's site.
          </Text>
          <Text style={styles.tncText}>
            No use of ClassCast’s logo or other artwork will be allowed for linking absent a trademark license
            agreement.
          </Text>

          <Text style={styles.tncHeadingSmall}>Iframes</Text>

          <Text style={styles.tncText}>
            Without prior approval and express written permission, you may not create frames around our Web pages or use
            other techniques that alter in any way the visual presentation or appearance of our Web site.
          </Text>
          <Text style={styles.tncHeadingSmall}>Reservation of Rights</Text>

          <Text style={styles.tncText}>
            We reserve the right at any time and in its sole discretion to request that you remove all links or any
            particular link to our Web site. You agree to immediately remove all links to our Web site upon such
            request. We also reserve the right to amend these terms and conditions and its linking policy at any time.
            By continuing to link to our Web site, you agree to be bound to and abide by these linking terms and
            conditions.
          </Text>
          <Text style={styles.tncText}>
            Removal of links from our website If you find any link on our Web site or any linked web site objectionable
            for any reason, you may contact us about this. We will consider requests to remove links but will have no
            obligation to do so or to respond directly to you. Whilst we endeavour to ensure that the information on
            this website is correct, we do not warrant its completeness or accuracy; nor do we commit to ensuring that
            the website remains available or that the material on the website is kept up to date.
          </Text>
          <Text style={styles.tncHeadingSmall}>Content Liability</Text>

          <Text style={styles.tncText}>
            We shall have no responsibility or liability for any content appearing on your Web site. You agree to
            indemnify and defend us against all claims arising out of or based upon your Website. No link(s) may appear
            on any page on your Web site or within any context containing content or materials that may be interpreted
            as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or
            other violation of, any third party rights.
          </Text>
          <Text style={styles.tncTextListItem}>
            1. limit or exclude our or your liability for death or personal injury resulting from negligence;
          </Text>
          <Text style={styles.tncTextListItem}>
            2. limit or exclude our or your liability for fraud or fraudulent misrepresentation;
          </Text>
          <Text style={styles.tncTextListItem}>
            3. limit any of our or your liabilities in any way that is not permitted under applicable law; or
          </Text>
          <Text style={styles.tncTextListItem}>
            4. exclude any of our or your liabilities that may not be excluded under applicable law.
          </Text>
          <Text style={styles.tncText}>
            The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. are subject to the preceding paragraph; and
          </Text>
          <Text style={styles.tncTextListItem}>
            2. govern all liabilities arising under the disclaimer or in relation to the subject matter of this
            disclaimer, including liabilities arising in contract, in tort (including negligence) and for breach of
            statutory duty.
          </Text>
          <Text style={styles.tncText}>
            To the extent that the website and the information and services on the website are provided free of charge,
            we will not be liable for any loss or damage of any nature.
          </Text>

          <Text style={styles.tncHeadingSmall}>Credit & Contact Information</Text>

          <Text style={styles.tncText}>
            In order to resolve any complaint regarding the Site or to receive further information regarding the use of
            site, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            Manjushri Educational Service Pvt. Ltd.
          </Text>
          <Text style={styles.contactInfo}>
            UU-195, Pitampura,
          </Text>
          <Text style={styles.contactInfo}>
            Delhi - 110034.
          </Text>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            this.setState({tncModalVisible: false})
          }}
        >
          <View style={styles.tncButtonContainer}>
            <Text style={styles.tncButton}>Close</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
            Linking.openURL('http://www.spsharmag.com');
          }}
        >
          <View style={styles.tncButtonContainer}>
            <Text style={styles.tncButton}>Visit Website</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
        }

        <Modal
          backdropOpacity={0.6}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.completeprofile}
          onRequestClose={() => {
            this.setState({completeprofile: false})
          }}>
          <View style={[styles.tncModal, {height: 50 * vh}]}>
          <Text style={styles.tncHeadingBig}>Complete Profile</Text>
            {
              this.state.data && this.state.data.map((section, index)=>{
                return(
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>

                    <TouchableNativeFeedback onPress={()=> {
                        if(section.type == "screen") {
                          this.setState({completeprofile: false});
                          this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: section.screen }));
                        }
                        else if(section.type == "state") {
                          this.setState({completeprofile: false});
                          this.setState({modalVisible: true})
                        }
                    }}>

                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{height: 10 * vw, width: 10 * vw, borderRadius: 5 * vw, margin: 5 * vw, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', elevation: 5}}>
                          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw}}>{index+1}</Text>
                        </View>
                        <View>
                          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, textDecorationLine: 'none'}}>{section.text}</Text>
                        </View>
                        <View style={{height: 10 * vw, width: 10 * vw, borderRadius: 5 * vw, margin: 5 * vw, alignItems: 'center', justifyContent: 'center'}}>
                          <Image
                            style={{height: 10 * vw, width: 10 * vw}}
                            resizeMode={'contain'}
                            source={{uri: section.status? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABDlBMVEUAAAAf8F0i81ki81kh8lkh81ki9Fkj81cg8Vgg81kh81ki9VoA/wAg8loh81kg/2AA/4Ah8lki81kX6F0h81kr6lUh8lkh81ka/00g81gh81kh81kk7Vsg81kh9Fkh8lkh81kh81kh81kh8lkj8lsh81kh81kh8lwh81ki8Vgh81ki9Foz/2Yi8lkh9Fki9Fkf9Vgg81gj9lgh81gh81kh81kh81gg72Ah81oh81kg9Fkg8loh81gh81kg9Fog81gg81gi8lsA/1Uh81kh81kg81og81kh9Fkh81kh81ki81og81kh9Fkg8lkh81ki9Fkh9Fkh81kh81kg81gm8lkh9Fkh81kk/0kh81kAAACV40ciAAAAWHRSTlMAIWqPo5JyLDe9z0oBd/0IAqC+C8MMob8KrW3rDmey4Pfs0I07uPAn+0v8WwU8XFkxVx2Z7+eFEGbtSI5r/m9/bkwD11al3PTy2lLURXaEicn68UAUtJsHFlw9zQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCAEOLTdGwT3CAAACPElEQVR42u2Y11LDQAxFlxB66L2G3ntvoffe0f9/CQnMAAn2WmtLqxlG99necyTXlTEajUaj0Wi8pixVnq6orJLCV9fAV2rrJPCZ+gb4TrrRO7+pGX6npVWWD9DWLsv3bBDA92rQ1AFB6eySrL+Q7oxk/YX0iNafT2+faP359AvzYYCd32zlQ1a2foBB2foBhmTrBxiWrR9gRLZ+gFHZ+mFMuP7xCVn+5BQfH9P/6RnlK1/5yle+8pWv/JLMzs2nFhbj7Jhx/z9L9kWWV1Y/j1tb3xDhbw5+H7q17Z+f2Sm6WLve+RXFh+f2HPgE918p38WAh4834OJjDUie//3g03IHCD7F83eYg7gGJPyj49BTo64Czfv3xHKyvQck9Rtzajvd1gOq79+ZdYHwHhDVb8y5fYmwHtB9/y8gjgHh/8dl1DJBV4Gs//lEl/K3B6T/X1fRS5X2gLL+/IvoGmFQ1APq/8+babce0NZfyC1iwR8Der4xdxiDPZ7+uxpw7T+wBnz7H5wB5/7rHmPwgDjI8f5z6wFf/WQGifa/BAYJ99+JDRLv/xMaEMwfEhmQzD8SGBDNX2IbkM1/YhoQzp9iGZDOv2IYEM/fnA3I53+OBgzzx3VhvpMB0/wVbcA2/0UaMM6fUQaMfJQBKx9hwMyPNGDnRxh44FsNvPAtBp74oQbe+CEGHvmBBl75AQae+X8MvPNLDAT4RQYi/F/zg8e4+/+k6X/65GefhfjGvKTSr28L72J8jUaj0Wj+bT4Aji2oqqiUTYMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMDFUMTI6NDU6NTUrMDI6MDBoqZSoAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTAxVDEyOjQ1OjU1KzAyOjAwGfQsFAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='
                                                        : ''
                            }}
                          />
                        </View>

                      </View>
                    </TouchableNativeFeedback>

                  </View>
                  )
              })
            }
          </View>

        </Modal>

        <Modal
          backdropOpacity={0.6}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false})
          }}>

          <View style={[styles.tncModal, {height: 40 * vh}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.tncHeadingBig}>Choose action</Text>
          <TouchableNativeFeedback
            onPress={()=> {
              this.setState({modalVisible: false});
            }}>
            <Image
              style={{height: 5 * vw, width: 5 * vw}}
              resizeMode={'contain'}
              source={{uri: 'data:image/png;base64,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'}}
            />
          </TouchableNativeFeedback>
          </View>

            <TouchableNativeFeedback
              onPress={() => {
                this.setState({modalVisible: !this.state.modalVisible});
                this.selectimage();
              }}>
              <View style={[styles.button, {width: '70%', alignSelf: 'center'}]}>
                <Text style={styles.buttonText}>
                  Select From Gallery
                </Text>
              </View>
            </TouchableNativeFeedback>

             <Text style={[styles.tncHeadingBig,{textAlign: 'center', marginBottom: 0}]}>or</Text>

            <TouchableNativeFeedback
              onPress={() => {
                this.setState({modalVisible: !this.state.modalVisible});
                this.captureimage();
              }}>
              <View style={[styles.button, {width: '70%', alignSelf: 'center'}]}>
                <Text style={styles.buttonText}>
                  Take A Photo
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </Modal>

      </View>
    );
  }
}



export default SideMenu;