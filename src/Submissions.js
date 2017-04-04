import React, { Component } from 'react';

import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  ListView,
  Linking,
  State,
  TouchableHighlight
} from 'react-native';

var venue = require("venue-api-react");

import { Button, Toolbar, Card } from 'react-native-material-design';

import SubmissionCard from "./SubmissionCard";
import CourseCard from "./CourseCard";

export default class Submissions extends Component{

  state: {
    submissions: [any],
    dataSource: [any]
  };

  constructor(){
    super();
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.title !== r2.title
    });
    this.state = {submissions: [], dataSource: ds.cloneWithRows([],[])};
  }

  componentDidMount(){
    venue.getMySubmissions().then((subs) => {
        this.setState((state) => {
        state.submissions = subs.map((s) => {
          return {
            image: s.images[0],
            event: s.sectionEvent["info"]["title"],
            author: s.submitter["firstName"],
            date: s.updatedAt,
            submissionId: s._id,
            infoObject: s
          };
        });
        state.dataSource = state.dataSource.cloneWithRows(
          state.submissions
        );
        return state;
      });
    });
  }

  renderSubmissionCard(submissionInfo: {submissionId:string, image:string, event:string, author:string, date:string, infoObject: any}){

    return (
      <SubmissionCard
        navigator={this.props.navigator}
        image={submissionInfo.image}
        event={submissionInfo.event || ""}
        author={submissionInfo.author}
        date={submissionInfo.date}
        submissionId={submissionInfo.submissionId}
        submissionInfo={submissionInfo.infoObject}
        />
    );

  }

  render(){
    let displayCourses;
    let routes = this.props.navigator.getCurrentRoutes();
    if (this.state.submissions.length > 0){
        displayCourses = <ListView
          style={styles.cards}
          dataSource={this.state.dataSource}
          renderRow={(info) => this.renderSubmissionCard(info)}
          renderFooter={()=>{
            return (
              <Text style={styles.feedbackForm} onPress={()=> Linking.openURL("http://goo.gl/forms/EmZAB93IcEDAwWkn1")}>
                Report Issues/Give Feedback
              </Text>
            );
          }}
        />;
    }
    else {
      displayCourses = <View style={styles.coursesHelp}>
        <Text style={styles.coursesHelpMessage}>
          You have no submissions
        </Text>
        <Text style={styles.feedbackForm} onPress={()=> Linking.openURL("http://goo.gl/forms/EmZAB93IcEDAwWkn1")}>
          Report Issues/Give Feedback
        </Text>
      </View>;
    }

    return (
      <View style={styles.container}>
          <View style={styles.navbar}>
              <View style={styles.navViewSelected}>
                <Text style={styles.buttonSelected}>SUBMISSIONS</Text>
              </View>

              <View style={styles.navView}>
                  <TouchableHighlight onPress={()=> {
                      let index = containsRoute("dashboard", routes);
                      if (index>=0){
                          this.props.navigator.jumpTo(routes[index]);
                      }
                      else{
                          this.props.navigator.push({title:"dashboard"});
                      }
                  }}>
                      <Text style={styles.button}>EVENTS</Text>
                  </TouchableHighlight>
              </View>

              <View style={styles.navView}>
                  <TouchableHighlight onPress={()=> {
                      let index = containsRoute("courses", routes);
                      if (index>=0){
                          this.props.navigator.jumpTo(routes[index]);
                      }
                      else{
                          this.props.navigator.push({title:"courses"});
                      }
                  }}>
                      <Text style={styles.button}>COURSES</Text>
                  </TouchableHighlight>
              </View>
          </View>

          {displayCourses}
      </View>
    );
  }
}

function containsRoute(string, routes){
    let found = -1;
    for (var i=0; i<routes.length; i++){
        if(routes[i]['title'] == string){
            found = i;
            break;
        }
    }
    return found;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  cards: {
    flex:1,
    marginTop: 12,
    flexDirection: 'column'
  },
  cardTitle: {
    color: "#fff",
    fontSize:24
  },
  navView: {
      flex: 1,
      opacity: 0.6,
      alignItems: 'center',
      justifyContent: 'center'
  },
  navViewSelected: {
      flex: 1,
      opacity: 1,
      borderBottomColor: '#fff',
      borderBottomWidth: 2,
      alignItems: 'center',
      justifyContent: 'center'
  },
  button: {
      flex: 1,
      textAlignVertical: 'center',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontSize: 14,
      color: '#fff'
  },
  buttonSelected: {
      flex: 1,
      textAlignVertical: 'center',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontSize: 14,
      color: '#fff'
  },
  navbar:{
    height: 48,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: "#2196F3"
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 48,
    textAlign: 'center',
    margin: 10,
    marginTop: 100,
    marginBottom:50
  },
  textInput: {
    fontSize:18,
    width:200,
    alignSelf: 'center',
    textAlign: 'center'
  },
  feedbackForm:{
    fontSize:14,
    marginTop:20,
    height:50,
    color: '#2196F3',
    alignSelf: 'center',
    textAlign: 'center'
  },
  coursesHelp:{
    flex:1,
    marginTop: 60,
    flexDirection: 'column'
  },
  coursesHelpMessage:{
    fontSize:18,
    width:400,
    marginTop:100,
    marginBottom:50,
    alignSelf: 'center',
    textAlign: 'center'
  },
});
