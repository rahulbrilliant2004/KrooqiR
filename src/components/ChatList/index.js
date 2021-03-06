import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AsyncStorage ,View, FlatList, Text, TouchableHighlight, Platform } from 'react-native';
import { PUBLIC_URL, krooqi_URL, backgroundColor } from "../../constants/config";
import axios from "axios";
import styles from './styles';
import I18n from '../../i18n';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toProperCase = function() {
  return this.toLowerCase().replace(/^(.)|\s(.)/g, 
    function($1) { return $1.toUpperCase(); });
}

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isRefreshing: false,
      lang: 'en',
    };
  }

  componentDidMount() {
    this._getMessages();
  }

  _getMessages = () => {
    const { auth } = this.props;
    
    axios
      .post(`${PUBLIC_URL}getUserMessages`, { agent_id: auth.success.agent_id })
      .then((response) => {
        if (response.data) {
          this.setState({ isRefreshing: false, data: response.data });
        }
      })
      .catch((error) => {
        console.log(error);        
      }); 

    AsyncStorage.getItem('lang').then((value) => {
      if(value == null){
        this.setState({
          lang: 'en'
        })
      }else{
        this.setState({
          lang: value
        })
      }
    }).done();  
  }

  onRefresh() {    
    this._getMessages();
  } 

  openSingleChat = (msg) => {
    this.props.navigator.showModal({
      screen: 'krooqi.SingleChat',
      title: `${I18n.t('chatDetails').toProperCase()}`,
      passProps: {
        item: msg,
      },
      navigatorButtons: {
        leftButtons: [
          {
            title: 'Cancel',
            id: 'cancel',
            buttonColor: 'white',
            buttonFontSize: 14,
            buttonFontWeight: '600',
          },
        ],
      },
      navigatorStyle: {
        screenBackgroundColor: 'white',
      },
      animationType: 'slide-up',
    });
  }


  render() {

    const { data, isRefreshing, lang } = this.state;

    return (
      <View style={[styles.msgView, {flex: 1,}]}>
        {
          data.length > 0 &&
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => this.openSingleChat(item)} underlayColor="#f1f1f1">
              <View style={styles.mainView}>
                { 
                  item.email !== null && item.email !== "" && item.email !== undefined && 
                  <Text style={[styles.mainText, Platform.OS === "ios" && lang !== 'en' ? {textAlign: "right", justifyContent: "flex-end"} :{} ]} numberOfLines={1}> <Text style={styles.boldWords}>{I18n.t('chat_Email').toProperCase()} : </Text>{item.email}</Text>
                }
                { 
                  item.name !== null && item.name !== "" && item.name !== undefined && 
                  <Text style={[styles.mainText, Platform.OS === "ios" && lang !== 'en' ? {textAlign: "right", justifyContent: "flex-end"} :{} ]} numberOfLines={1}> <Text style={styles.boldWords}>{I18n.t('chat_Name').toProperCase()} : </Text>{item.name}</Text>
                }
                { 
                  item.phone !== null && item.phone !== "" && item.phone !== undefined && 
                  <Text style={[styles.mainText, Platform.OS === "ios" && lang !== 'en' ? {textAlign: "right", justifyContent: "flex-end"} :{} ]} numberOfLines={1}> <Text style={styles.boldWords}>{I18n.t('chat_Phone').toProperCase()} : </Text>{item.phone}</Text>
                }
                { 
                  item.message !== null && item.message !== "" && item.message !== undefined && 
                  <Text style={[styles.mainText, Platform.OS === "ios" && lang !== 'en' ? {textAlign: "right", justifyContent: "flex-end"} :{} ]} numberOfLines={1}> <Text style={styles.boldWords}>{I18n.t('chat_Message').toProperCase()} : </Text>{item.message}</Text>
                }
                { 
                  item.property_name !== null && item.property_name !== "" && item.property_name !== undefined && 
                  <Text style={[styles.mainText, Platform.OS === "ios" && lang !== 'en' ? {textAlign: "right", justifyContent: "flex-end"} :{} ]} numberOfLines={1}> <Text style={styles.boldWords}>{I18n.t('chat_Property').toProperCase()} : </Text>{item.property_name}</Text>
                }
              </View>
            </TouchableHighlight>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ borderBottomWidth: 1, borderColor: 'gray' }} />
          )}
          keyExtractor={(item, index) => index}
          refreshing={isRefreshing}
          onRefresh={() => this.onRefresh()}
        />
        }
        {
          data.length < 1 && <View>
            <Text style={styles.noMsg}>{I18n.t('noMsgs').toProperCase()}</Text>
          </View>
        }
      </View>
    );
  }
}

ChatList.propTypes = {
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(ChatList);
