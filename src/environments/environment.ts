export const environment = {
  production: false,
  // baseAPI: 'http://44.250.104.186:9002',
  // baseAPI: "https://yolomama-api.gbstech.com.kh",

  baseAPI: 'https://epass-api.gbstech.com.kh',
  baseToken : 'ae5fad25af333151cf604f0ba033f3080e58cd6d',
  localEncriptKey: 'GBS@2015',
  
  //in local
  // baseAPI: "http://192.168.10.25:9002",
  // baseToken : '8f40ad6259f4dc31a5011367c9b67d870698b587',

  //base token for aba
  baseTokenABA : '5894fdeaf2613a213ca153cc5ec1bc83637a00e7',


  firebaseConfig: {
    apiKey: "AIzaSyDBHexonYSRHnaQLrnCOy50es9YCajx654",
    authDomain: "gomama-epass.firebaseapp.com",
    projectId: "gomama-epass",
    storageBucket: "gomama-epass.firebasestorage.app",
    messagingSenderId: "318336076201",
    appId: "1:318336076201:web:4c6ebd874590bcc2029cb8",
    measurementId: "G-0X0QPKW1RJ"
  },

  firebasePath: 'sta',   // path for dev
  // firebasePath: 'pro/order/',   // path for staging
  // firebasePath: 'sta/order/',   // path for production
};