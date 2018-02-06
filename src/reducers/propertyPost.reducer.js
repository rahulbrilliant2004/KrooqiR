import initialState from './initialState';

// Screen 1 Form

const UPDATE_PropertyFor 	= 'UPDATE_PropertyFor'
const UPDATE_REGION 		= 'UPDATE_REGION'
const UPDATE_BRANCH 		= 'UPDATE_BRANCH'
const UPDATE_DISTRICT 		= 'UPDATE_DISTRICT'
const UPDATE_ADDRESS 		= 'UPDATE_ADDRESS'
const UPDATE_UNITFLOOR 		= 'UPDATE_UNITFLOOR'
const UPDATE_LOCATIONONMAP 	= 'UPDATE_LOCATIONONMAP'

//  Screen 2 Form

const UPDATE_PROPERTYTITLE 			= 'UPDATE_PROPERTYTITLE'
const UPDATE_PROPERTYDESCRIPTION 	= 'UPDATE_PROPERTYDESCRIPTION'
const UPDATE_OWNERNAME 				= 'UPDATE_OWNERNAME'
const UPDATE_OWNERPHONE 			= 'UPDATE_OWNERPHONE'

//  Screen 3 Form

const UPDATE_AGENCY ='UPDATE_AGENCY'
const UPDATE_AGENT 	='UPDATE_AGENT'

// Screen 4 Form

const UPDATE_RENTPERMONTH 	= 'UPDATE_RENTPERMONTH'
const UPDATE_DATEAVAILABLE 	= 'UPDATE_DATEAVAILABLE'
const UPDATE_PROPERTYTYPE 	= 'UPDATE_PROPERTYTYPE'
const UPDATE_ROOMS 			= 'UPDATE_ROOMS'
const UPDATE_BATHROOMS 		= 'UPDATE_BATHROOMS'
const UPDATE_METERSQ 		= 'UPDATE_METERSQ'
const UPDATE_YEARBUILD 		= 'UPDATE_YEARBUILD'

//  Screen 6 Form

const UPDATE_VIEWR 					= 'UPDATE_VIEWR'
const UPDATE_FEATURESR 				= 'UPDATE_FEATURESR'
const UPDATE_COMMONFACILITIESR 		= 'UPDATE_COMMONFACILITIESR'
const UPDATE_ADDITIONALFEATURESR 	= 'UPDATE_ADDITIONALFEATURESR'

//  Unfilled fields in form screens

const SCREEN_1 = 'SCREEN_1'
const SCREEN_2 = 'SCREEN_2'
const SCREEN_3 = 'SCREEN_3'
const SCREEN_4 = 'SCREEN_4'
const SCREEN_5 = 'SCREEN_5'
const SCREEN_6 = 'SCREEN_6'
	
export default function propertyPostForm (state = initialState.PostProperty, action) {
  switch (action.type) {
    case UPDATE_PropertyFor:
      return {
        ...state,
        propertyFor: action.data
      }
    case UPDATE_REGION:
      return {
        ...state,
        region: action.data
      }
    case UPDATE_BRANCH:
      return {
        ...state,
        branch: action.data
      }
    case UPDATE_DISTRICT:
      return {
        ...state,
        district: action.data
      }
    case UPDATE_ADDRESS:
      return {
        ...state,
        address: action.data
      }
    case UPDATE_UNITFLOOR:
      return {
        ...state,
        unitFloor: action.data
      }
    case UPDATE_LOCATIONONMAP:
      return {
        ...state,
        locationOnMap: action.data
      }
    case UPDATE_PROPERTYTITLE:
      return {
        ...state,
        propertyTitle: action.data
      }
    case UPDATE_PROPERTYDESCRIPTION:
      return {
        ...state,
        propertyDescription: action.data
      }
    case UPDATE_OWNERNAME:
      return {
        ...state,
        ownerName: action.data
      }
    case UPDATE_OWNERPHONE:
      return {
        ...state,
        ownerPhone: action.data
      }
    case UPDATE_AGENCY:
      return {
        ...state,
        agency: action.data
      }
    case UPDATE_AGENT:
      return {
        ...state,
        agent: action.data
      }
    case UPDATE_RENTPERMONTH:
      return {
        ...state,
        rentPerMonth: action.data
      }
    case UPDATE_DATEAVAILABLE:
      return {
        ...state,
        dateAvailable: action.data
      }
    case UPDATE_PROPERTYTYPE:
      return {
        ...state,
        propertyType: action.data
      }
    case UPDATE_ROOMS:
      return {
        ...state,
        rooms: action.data
      }
    case UPDATE_BATHROOMS:
      return {
        ...state,
        bathrooms: action.data
      }
    case UPDATE_METERSQ:
      return {
        ...state,
        meterSq: action.data
      }
    case UPDATE_YEARBUILD:
      return {
        ...state,
        yearBuild: action.data
      }
    case UPDATE_VIEWR:
      return {
        ...state,
        viewR: action.data
      }
    case UPDATE_FEATURESR:
      return {
        ...state,
        featuresR: action.data
      }
    case UPDATE_COMMONFACILITIESR:
      return {
        ...state,
        commonFacilitiesR: action.data
      }
    case UPDATE_ADDITIONALFEATURESR:
      return {
        ...state,
        additionalFeaturesR: action.data
      }
    case SCREEN_1:
      return {
        ...state,
        screen_1: action.data
      }
    case SCREEN_2:
      return {
        ...state,
        screen_2: action.data
      }
    case SCREEN_3:
      return {
        ...state,
        screen_3: action.data
      }
    case SCREEN_4:
      return {
        ...state,
        screen_4: action.data
      }
    case SCREEN_5:
      return {
        ...state,
        screen_5: action.data
      }
    case SCREEN_6:
      return {
        ...state,
        screen_6: action.data
      }
    default:
      return state
  }
}