  //FireBase
exports.firebaseConfig = {
  apiKey: "AIzaSyAjSW30EXK0JeHPvPSxKTs-q4ZWcguNUQQ",
  authDomain: "makeme-cd07e.firebaseapp.com",
  databaseURL: "https://makeme-cd07e.firebaseio.com",
  projectId: "makeme-cd07e",
  storageBucket: "makeme-cd07e.appspot.com",
  messagingSenderId: "244406233242"
};



//App setup
exports.adminConfig={
  "appName": "MakeMe",
  "slogan":"made with <code/> for a better experience.",
  "design":{
    "sidebarBg":"sidebar-1.jpg", //sidebar-1, sidebar-2, sidebar-3
    "dataActiveColor":"blue", //"purple | blue | green | orange | red | rose"
    "dataBackgroundColor":"black", // "white | black"
  },
  "showItemIDs":false,
  "allowedUsers":["admin@makeme.com"], //If null, allow all users, else it should be array of allowd users
  "allowGoogleAuth":false, //Allowed users must contain list of allowed users in order to use google auth
  "fieldBoxName": "Details",
  "maxNumberOfTableHeaders":5,
  "prefixForJoin":["-event"],
  "showSearchInTables":true,
  "methodOfInsertingNewObjects":"push", //timestamp (key+time) | push - use firebase keys
  "goDirectlyInTheInsertedNode":false,
  "urlSeparator":"+",
  "urlSeparatorFirestoreSubArray":"~",
  "googleMapsAPIKey":"",

  "fieldsTypes":{
    "photo":["photo","image", "headerImage" ],
    "dateTime":["end","start"],
    "map":["map","latlng","location"],
    "textarea":["description"],
    "html":["content"],
    "radio":["radio","radiotf","featured"],
    "checkbox":["checkbox"],
    "dropdowns":["status","dropdowns", "gender", "offer"],
    "file":["video"],
    "rgbaColor":['rgba'],
    "hexColor":['color'],
    "relation":['type','creator'],
    "iconmd":['icon'],
    "iconfa":['iconfa'],
    "iconti":['iconti'],
    "iconio":['iconio'],
  },
  "optionsForDateTime":[
    {"key":"end", "dateFormat":"YYYY-MM-DD" ,"timeFormat":true, "saveAs":"x","locale":"es"},
    {"key":"start", "dateFormat":"X" ,"timeFormat":"HH:mm", "saveAs":"x"},
  ],
  "optionsForSelect":[
      {"key":"offer","options":["true", "false"]},
      {"key":"checkbox","options":["Skopje","Belgrade","New York"]},
      {"key":"status","options":["accepted","rejected","cancelled"]},
      {"key":"gender","options":["Male","Female"]},
      {"key":"radio","options":["no","maybe","yes"]},
      {"key":"radiotf","options":["true","false"]},
      {"key":"featured","options":["true","false"]}
  ],
  "optionsForRelation":[
      {
        //Firestore - Native
        "display": "name",
        "isValuePath": true,
        "key": "creator",
        "path": "/users",
        "produceRelationKey": false,
        "relationJoiner": "-",
        "relationKey": "type_eventid",
        "value": "name"
      },
      {
        //Firebase - Mimic function
        "display":"name",
        "key":"eventtype",
        "path":"",
        "isValuePath":false,
        "value":"name",
        "produceRelationKey":true,
        "relationJoiner":"-",
        "relationKey":"type_eventid"
      }
  ],
  "paging":{
    "pageSize": 20,
    "finite": true,
    "retainLastPage": false
  },
  "hiddenKeys":[
    "invoiceId",
    "ownerId",
    "pushToken",
    "favouriteVenues",
    "teamMemberId",
    "venueId",
    "userId",
    "favorite",
    "emailVerified",
    "location",
  ],
  "previewOnlyKeys": [
    "previewOnlyKey",
    "anotherPreviewOnlyKye",
    "email",
    "userType",
    "favorite",
    "favouriteVenues",
    "homeService",
    "price",
    "schedule",
    "serviceOffered",
    "teamMember",
    "name",
    "offer",
    "rating",
    "ratingCount",
    "serviceFor",
    "date",
    "emailVerified"
  ]
}

//Navigation
exports.navigation=[
    // {
    //   "link": "fireadmin",
    //   "path": "clubs",
    //   "name": "Clubs",
    //   "icon":"room",
    //   "tableFields":["name","description"],
    //   "subMenus":[
    //     {
    //       "link": "fireadmin",
    //       "path": "clubs/skopje/items",
    //       "name": "Skopje",
    //       "icon":"event",
    //       "tableFields":["name","description"]
    //     },{
    //       "link": "fireadmin",
    //       "path": "clubs/sofia/items",
    //       "name": "Sofia",
    //       "icon":"event",
    //       "tableFields":["name","description"],
    //     },{
    //       "link": "fireadmin",
    //       "path": "clubs/belgrade/items",
    //       "name": "Belgrade",
    //       "icon":"event",
    //       "tableFields":["name","description"],
    //     }
    //   ]
    // },
    // {
    //   "link": "/",
    //   "name": "Business Owner",
    //   "schema":"users",
    //   "icon":"home",
    //   "path": "users",
    //    isIndex:true,
    // },
    {
      "link": "firestoreadmin",
      "path": "users",
      "name": "Users",
      "icon": "account_circle",
      "tableFields":["email", "gender", "mobile", "userType"],
    },
    {
      "link": "firestoreadmin",
      "path": "businessowners",
      "name": "Business owners",
      "icon": "supervised_user_circle",
      "tableFields":["email", "gender", "mobile", "userType"],
    },
    {
      "link": "firestoreadmin",
      "path": "venues",
      "name": "Venues",
      "icon": "store",
      "tableFields":['name', 'status', "venueAddress"],
    },
    // {
    //   "link": "firestoreadmin",
    //   "path": "teamMembers",
    //   "name": "Team members",
    //   "icon": "face",
    //   "tableFields":['name', 'gender'],
    // },
    {
      "link": "firestoreadmin",
      "path": "bookings",
      "name": "Bookings",
      "icon": "assignment",
      "tableFields":['name', 'firstName', 'date', 'status'],
    }
  ];

  //From v 5.1.0 we suggest remoteSetup due to security
  //
exports.pushSettings={
  "remoteSetup":false,
  "remotePath":"pushSettings",
  "pushType":"expo", //firebase -  onesignal - expo
  "Firebase_AuthorizationPushKey":"AIzaSyCFUf7fspu61J9YsWE-2A-vI9of1ihtSiE", //Firebase push authorization ket
  "pushTopic":"news", //Only for firebase push
  "oneSignal_REST_API_KEY":"",
  "oneSignal_APP_KEY":"",
  "included_segments":"Active Users", //Only for onesignal push
  "firebasePathToTokens":"/expoPushTokens", //we save expo push tokens in firebase db
  "saveNotificationInFireStore":true, //Should we store the notification in firestore
}

exports.userDetails={

}

exports.remoteSetup=false;
exports.remotePath="admins/mobidonia";
exports.allowSubDomainControl=false;
exports.subDomainControlHolder="admins/";