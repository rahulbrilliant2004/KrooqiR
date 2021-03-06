import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, AsyncStorage, View, FlatList, Text, TouchableHighlight, TouchableOpacity, Platform } from 'react-native';
import SavedSearchCard from '../../components/SavedSearchCard';
import * as PropertiesActions from './../../Actions/PropertiesAction';
import * as commonActions from './../../Actions/commonActions';
import { backgroundColor, PUBLIC_URL } from "../../constants/config";
import I18n from '../../i18n';
import axios from "axios";

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toProperCase = function() {
  return this.toLowerCase().replace(/^(.)|\s(.)/g, 
    function($1) { return $1.toUpperCase(); });
}

class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      isRefeshing: false,
      dummyDataArr: [],
      langValue: 'en',
      apiRegion: [],
      apiCity: [],
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.pushDetail = this.pushDetail.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.openLogin = this.openLogin.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  authsuccessFunction = (auth) => {    
    if (auth.success) {
    AsyncStorage.getItem('lang').then((value) => {
      let lang = 'en';
      if(value == null){
        lang = 'en';
      }else{
        this.setState({langValue: value});
        lang = value;
      }
      axios
        .get(`${PUBLIC_URL}getRegions/${lang}`)
        .then((response) => {
          this.setState({ apiRegion: response.data })
          // alert(JSON.stringify(response));
        })
        .catch((error) => {
          // do nothing
        });
  
      axios
        .get(`${PUBLIC_URL}getCities/${lang}`)
        .then((response) => {
          this.setState({ apiCity: response.data })
        })
        .catch((error) => {
          // do nothing
        });
        axios
          .post(`${PUBLIC_URL}getSearch`, { "user_id": auth.success.id })
          .then((response) => {
            this.setState({ urlData: response.data });        
            this.creatingObjFromUrl(response.data);
          })
          .catch((error) => {
            console.log(error)
          });
        }).done();
    }
  }

  creatingObjFromUrl = (urlArr) => {

    let tempStoreUrlArr = [];  
    
    urlArr.map((dataUrl, index) => {
      
      let data = dataUrl.url;
      
      let propertyStatus = `${I18n.t('proStatusValueRent')}`,
        priceRangeStart = "",
        priceRangeEnd = "", 
        rooms = "", 
        baths = "", 
        squareMeterRangeStart = "", 
        squareMeterRangeEnd = "", 
        yearBuiltStart = "", 
        yearBuilttEnd = "", 
        district = "", 
        region = "", 
        propertyTypeKey = "", 
        propertyTypeValue = "",
        id= "";
      let propertyTypeArr = [];
      
      priceRangeStart = this.getQueryString('min-price', data);
      priceRangeEnd = this.getQueryString('max-price', data);
      rooms = this.getQueryString('bedrooms', data);
      baths = this.getQueryString('bathrooms', data);
      squareMeterRangeStart = this.getQueryString('min-area', data);
      squareMeterRangeEnd = this.getQueryString('max-area', data);
      yearBuiltStart = this.getQueryString('min-yrbuilt', data);
      yearBuilttEnd = this.getQueryString('max-yrbuilt', data);
      district = this._getRegion(this.getQueryString('state', data));
      region = this._getDistrict(this.getQueryString('location', data));

      let statusForPro = this.getQueryString('status', data);
      let typeProLocal = this.getQueryString('type', data);     

      propertyTypeValue = typeProLocal.toProperCase();      

      if(statusForPro === `${I18n.t('proStatusNameRent')}`) {
          propertyStatus = `${I18n.t('proStatusValueRent')}`;
      }
      if(statusForPro === `${I18n.t('proStatusNameSale')}`) {
          propertyStatus = `${I18n.t('proStatusValueSale')}`;
      }
      if(statusForPro === `${I18n.t('proStatusNameFutureDev')}`) {
          propertyStatus = `${I18n.t('proStatusValueFutureDev')}`;
      }
      if(statusForPro === `${I18n.t('proStatusNameNewConst')}`) {
          propertyStatus = `${I18n.t('proStatusValueNewConst')}`;
      }
      if(statusForPro === `${I18n.t('proStatusNameSold')}`) {
          propertyStatus = `${I18n.t('proStatusValueSold')}`;
      }
      if(statusForPro === `${I18n.t('proStatusNameRented')}`) {
          propertyStatus = `${I18n.t('proStatusValueRented')}`;
      }

      if(typeProLocal === `${I18n.t('proTypeNameApartment')}`) {
          propertyTypeKey = `${I18n.t('proTypeValueApartment')}`;
      }
      if(typeProLocal === `${I18n.t('proTypeNameBuilding')}`) {
          propertyTypeKey = `${I18n.t('proTypeValueBuilding')}`;
      }
      if(typeProLocal === `${I18n.t('proTypeNameOffice')}`) {
          propertyTypeKey = `${I18n.t('proTypeValueOffice')}`;
      }
      if(typeProLocal === `${I18n.t('proTypeNameShowroom')}`) {
          propertyTypeKey = `${I18n.t('proTypeValueShowroom')}`;
      }
      if(typeProLocal === `${I18n.t('proTypeNameVilla')}`) {
          propertyTypeKey = `${I18n.t('proTypeValueVilla')}`;
      }

      if (propertyTypeKey !== "" && propertyTypeValue !== "") {
        propertyTypeArr = [{"key": propertyTypeKey, "value": propertyTypeValue}];        
      }

      let objectPush = {
        "propertyStatus": propertyStatus,
        "priceRange": {
          "start": priceRangeStart,
          "end": priceRangeEnd
        },
        "propertyType": propertyTypeArr,
        "rooms": rooms,
        "baths": baths,
        "squareMeterRange": {
          "start": squareMeterRangeStart.replace('+Sq+m',''),
          "end": squareMeterRangeEnd.replace('+Sq+m','')
        },
        "yearBuilt": {
          "start": yearBuiltStart,
          "end": yearBuilttEnd
        },
        "district": district.replace(/-/g,' ').toProperCase(),
        "region": region.replace(/-/g,' ').toProperCase(),
        "id": dataUrl.id 
      };

      tempStoreUrlArr.push(objectPush);

    })

    this.props.actionsUpdated.updateSaveSearch(tempStoreUrlArr);
    this.setState({isRefeshing: false });
    // this.setState({ dummyDataArr: tempStoreUrlArr, isRefeshing: false });
    // console.log("JSON.stringify(tempStoreUrlArr)");
    // console.log(JSON.stringify(tempStoreUrlArr));
  }

  getQueryString = ( field, url ) => {
    let href = url;
    let reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    let string = reg.exec(href);
    // return string ? string[1] : null;
    return string ? (string[1]  === undefined || string[1]  === null || string[1]  === "" ? "" : string[1] ) : "";
  };

  _getDistrict = (slug) => {
    const { apiCity } = this.state;
    for (let index = 0; index < apiCity.length; index++) {
      if (slug === apiCity[index].slug) {
        return apiCity[index].name;
      }
    }
      return slug;
  }

  _getRegion = (slug) => {
    const { apiRegion } = this.state;
    for (let index = 0; index < apiRegion.length; index++) {
      if (slug === apiRegion[index].slug) {
        return apiRegion[index].name;
      }
    }
      return slug;
  }

  componentWillMount() {
    this.props.actions.savedSearchLoad();
    AsyncStorage.getItem('lang').then((value) => {
      if(value == null){
        
      }else{
        this.setState({langValue: value});
      }
    }).done();
    const { auth } = this.props;
    if (auth.success) {
      this.authsuccessFunction(auth);
    }
  }

  componentDidMount() {
    this.props.actions.savedSearchLoad();
    // AsyncStorage.getItem('lang').then((value) => {
    //   let lang = 'en';
    //   if(value == null){
    //     lang = 'en';
    //   }else{
    //     this.setState({langValue: value});
    //     lang = value;
    //   }
    //   axios
    //     .get(`${PUBLIC_URL}getRegions/${lang}`)
    //     .then((response) => {
    //       this.setState({ apiRegion: response.data })
    //       // alert(JSON.stringify(response));
    //     })
    //     .catch((error) => {
    //       // do nothing
    //     });
  
    //   axios
    //     .get(`${PUBLIC_URL}getCities/${lang}`)
    //     .then((response) => {
    //       this.setState({ apiCity: response.data })
    //     })
    //     .catch((error) => {
    //       // do nothing
    //     });
    // }).done();

      
    const { auth } = this.props;
    if (auth.success) {
      this.authsuccessFunction(auth);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && JSON.stringify(this.state.auth) !== JSON.stringify(nextProps.auth)) {
      this.setState({ auth: nextProps.auth });
      nextProps.auth.success && this.authsuccessFunction(nextProps.auth); 
      console.log("nextProps.auth")     
      console.log(nextProps.auth)     
    }
    AsyncStorage.getItem('lang').then((value) => {
      if(value == null){
        
      }else{
        this.setState({langValue: value});
      }
    }).done();
    // const { auth } = this.props;
    // if (auth.success) {
    //   this.authsuccessFunction(auth);
    // }
  }

  onRefresh() {
    // this.props.actions.savedSearchLoad();
    this.setState({ isRefeshing: true });
    const { auth } = this.state;
    this.authsuccessFunction(auth);
  }

  onNavigatorEvent(event) {
    if (event.id === 'bottomTabSelected' && event.selectedTabIndex === 3) {
      if (!this.state.auth.success) {
        this.openLogin();
      }
    }
  }

  openLogin() {
    this.props.navigator.showModal({
      screen: 'krooqi.Login',
      passProps: {
        label: `${I18n.t('to_save_a_home').capitalize()}`,
      },
      navigatorStyle: {
        navBarHidden: true,
        screenBackgroundColor: 'white',
      },
      animationType: 'slide-up',
    });
  }

  closeModel() {
    this.props.navigator.dismissModal({
      animationType: 'slide-down',
    });
  }

  pushDetail(item) {
    this.props.actions.filteredPropertiesLoad(item);
    this.props.navigator.switchToTab({
      tabIndex: 0,
    });
  }

  _showUrlPara = ({item, index }) => {

    let value = "";
    if (item.propertyStatus !== "") {
      if(item.propertyStatus === `${I18n.t('proStatusValueRent')}`) {
          value = `${I18n.t('pp_for_rent').toProperCase()}`;
      }
      if(item.propertyStatus === `${I18n.t('proStatusValueSale')}`) {
          value = `${I18n.t('pp_for_sale').toProperCase()}`;
      }
      if(item.propertyStatus === `${I18n.t('proStatusValueFutureDev')}`) {
          value = `${I18n.t('pp_for_development').toProperCase()}`;
      }
      if(item.propertyStatus === `${I18n.t('proStatusValueNewConst')}`) {
          value = `${I18n.t('pp_for_construction').toProperCase()}`;
      }
      if(item.propertyStatus === `${I18n.t('proStatusValueSold')}`) {
          value = `${I18n.t('pp_for_sold').toProperCase()}`;
      }
      if(item.propertyStatus === `${I18n.t('proStatusValueRented')}`) {
          value = `${I18n.t('pp_for_rented').toProperCase()}`;
      }
    }
    return <View style={{ padding: 10, }}>
      <View>
        <Text style={{ fontWeight: '600', fontSize: 18, paddingBottom: 10,  }}>{index+1}) {I18n.t('insavedSearchParameter').toProperCase()} :</Text>
        <View style={[{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }, Platform.OS === "android" && this.state.langValue !== "en" ? {justifyContent: "flex-end"} : {}]}>
          {
            item.propertyStatus !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchStatus').capitalize()} : </Text> {value}</Text>
          }
          {
            item.priceRange.start !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchMinPrice').capitalize()} : </Text> {item.priceRange.start}</Text>
          }
          {
            item.priceRange.end !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchMaxPrice').capitalize()} : </Text> {item.priceRange.end}</Text>
          }
          {
            item.propertyType.length > 0 && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchPropertyType').capitalize()} : </Text> {item.propertyType[0].value}</Text>
          }
          {
            item.rooms !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchNoOfBedrooms').capitalize()} : </Text> {item.rooms}</Text>
          }
          {
            item.baths !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchNoOfBathrooms').capitalize()} : </Text> {item.baths}</Text>
          }
          {
            item.squareMeterRange.start !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchMinArea').capitalize()} : </Text> {item.squareMeterRange.start}</Text>
          }
          {
            item.squareMeterRange.end !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchMaxArea').capitalize()} : </Text> {item.squareMeterRange.end}</Text>
          }
          {
            item.yearBuilt.start !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchMinYearBuilt').capitalize()} : </Text> {item.yearBuilt.start}</Text>
          }
          {
            item.yearBuilt.end !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchMaxYearBuilt').capitalize()} : </Text> {item.yearBuilt.end}</Text>
          }
          {
            item.region !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchRegion').capitalize()} : </Text> {item.region}</Text>
          }
          {
            item.district !== "" && <Text style={{ paddingRight: 10, }}><Text style={{ fontWeight: '600' }}>{I18n.t('inSavedSearchCity').capitalize()} : </Text> {item.district}</Text>
          }
        </View>
      </View>
      <View style={{ marginTop: 10, justifyContent: "space-between", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => this.searcheAgain(item)}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: backgroundColor, paddingLeft: 15, paddingRight: 15}}>
              <Text style={{ fontSize: 15, padding: 5, color: "#fff", textAlign: 'center' }}>
                {I18n.t('inSavedSearchSearch').capitalize()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.deleteFunc(item)}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: "red", paddingLeft: 15, paddingRight: 15}}>
              <Text style={{ fontSize: 15, padding: 5, color: "#fff", textAlign: 'center' }}>
                {I18n.t('inSavedSearchDelete').capitalize()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  }

  searcheAgain = (search) => {
    // this.props.navigator.push({
    //   screen: 'krooqi.FilterResultPage',
    //   title: `${I18n.t('result_filters').toProperCase()}`,
    // });
    this.props.navigator.switchToTab({
      tabIndex: 0 // (optional) if missing, this screen's tab will become selected
    });

    let { mapSearch } = this.props;

    this.props.actionsUpdated.updateSearch({
      ...mapSearch,
      searchText: 'notFound',
      latitude: 23.8859,
      longitude: 45.0792,
      latitudeDelta: 25,
      longitudeDelta: 25,
    });
    this.props.actions.filteredPropertiesLoadOnSearch(search);
  }

  deleteFunc = (item) => {
    const { auth } = this.state;
    if (auth.success) {
      Alert.alert(
        `${I18n.t('ft_saved_search').capitalize()}`,
        `${I18n.t('savedSearchDeleteMsg').capitalize()}`,  
        [
          {text: `${I18n.t('savedSearchDeleteCancle').capitalize()}`, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: `${I18n.t('savedSearchDeleteOk').capitalize()}`, onPress: () => {
            axios
            .post(`${PUBLIC_URL}deleteSearch`, { "user_id": auth.success.id, "id": item.id })
            .then((response) => {
              if (response.data.success) {
                this.onRefresh();
              }
            })
            .catch((error) => {
              console.log(error)
            });
          }},
        ],
        { cancelable: false }
      )
    }
  }

  render() {
    const { savedSearch, auth, updatedSavedSearch } = this.props;
    const { urlData, dummyDataArr, isRefeshing } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* {loading && Platform.OS === 'ios' && <Loading />} */}
        {auth.success ? (
          <View style={{ flex: 1 }}>
            {
              updatedSavedSearch.length > 0 ? (
              <FlatList
                data={updatedSavedSearch}
                renderItem={this._showUrlPara}
                ItemSeparatorComponent={() => (
                  <View style={{ borderBottomWidth: 1, borderColor: 'gray' }} />
                )}
                keyExtractor={(item, index) => index}
                refreshing={isRefeshing}
                onRefresh={this.onRefresh}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 40,
                }}
              >
                <Text style={{ lineHeight: 30, fontSize: 20 }}>{I18n.t('ft_saved_search').capitalize()}</Text>
                <Text
                  style={{
                    lineHeight: 25,
                    fontSize: 16,
                    color: 'gray',
                    textAlign: 'center',
                  }}
                >
                  {I18n.t('sav_not_msg').capitalize()}
                </Text>
                <Text
                  style={{
                    lineHeight: 25,
                    fontSize: 16,
                    color: 'gray',
                    textAlign: 'center',
                  }}
                >
                  {I18n.t('sav_search_msg').capitalize()}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{I18n.t('sav_lg_msg').capitalize()}</Text>
            <TouchableHighlight onPress={this.openLogin} underlayColor="#f1f1f1">
              <View
                style={{
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 4,
                  margin: 10,
                  borderColor: 'gray',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '400' }}>{I18n.t('m_login').toProperCase()}</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

Favorites.propTypes = {
  navigator: PropTypes.object.isRequired,
  savedSearch: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  savedSearch: state.savedSearch,
  updatedSavedSearch: state.updatedSavedSearch,
  auth: state.auth,
  mapSearch: state.mapSearch,
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(PropertiesActions, dispatch),
    actionsUpdated: bindActionCreators(commonActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
