const APP_URL = "http://ec2-18-221-119-107.us-east-2.compute.amazonaws.com/api";

// export const loginUser = async (method = "POST", data) => {
  
//     let param = {
//         method: method,
//         headers: { 
//           Accept: 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: data
//     };
  
//     let res = await fetch(global.APPURL, param)
//     return await res.json();
// }
export const loginUser = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json'
      },
      body: data
  };
 // console.log(param)
  let res = await fetch(global.APPURL, param)
 
  return await res.json();
}

export const nearByPost = async (method = "POST", data) => {
    let param = {
        method: method,
        headers: { 
          Accept: 'application/json',
         // 'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    };
  
    let res = await fetch(global.APPURL, param)
    
    return await res.json();
}
export const sendNotification = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const updateFCM = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userFriendPost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userFollowPost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userProfile = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userPost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userFriendList = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userNotificationList = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const addPost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userContactUs = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userChangePassword = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userBlockList = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userBlock = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userReportPost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userLikePost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const addComment = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userCommentList = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const search = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userForgotPassword = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const editPost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const deletePost = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userConversation = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const getRooms = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const createAppChatKitUser = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const createRoom = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}


export const userDeletePostImage = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}


export const userEditProfile = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userEditPicture = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userFriendRequestList = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const userRequest = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}

export const userFollow = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
       // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
export const phoneVerification = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        //'Content-Type': 'application/json'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}


// export const createAccount = async (method = "POST", params) => {

//   /*alert("Here");

//   let body = Object.keys(params).map((key) => {
//     return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
//   }).join('&');

//   console.log('body', body);

//   let param = {
//       method: method,
//       headers: { 
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(params)
//   };

//   let res = await fetch(global.APPURL, param)
  
//   return await res.json();*/

//   var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "http://ec2-18-221-119-107.us-east-2.compute.amazonaws.com/api",
//     "method": "POST",
//     "headers": {
//       "content-type": "application/x-www-form-urlencoded",
//       "cache-control": "no-cache",
//       "postman-token": "831c01c2-d787-cfd4-7653-a813cf85b42a"
//     },
//     "data": {
//       "firstname": "Nikhil",
//       "lastname": "Shinde",
//       "email": "shindenikhil01@gmail.com",
//       "password": "123456789",
//       "phonecode": "+91",
//       "phonenumber": "9595965001",
//       "device": "iOS",
//       "device_token": "123",
//       "action": "signup"
//     }
//   }
  
//   $.ajax(settings).done(function (response) {
//     console.log(response);
//   });
// }


export const createAccount = async (method = "POST", data) => {
  let param = {
      method: method,
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  };

  let res = await fetch(global.APPURL, param)
  
  return await res.json();
}
