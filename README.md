
<!---

Licensed Materials - Property of IBM

  

(C) Copyright 2018 IBM Corp.

  

Unless required by applicable law or agreed to in writing, software

distributed under the License is distributed on an "AS IS" BASIS,

WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and

limitations under the License.

-->

  

# React Native IBM Push Sample

  

This is a React-Native Sample Sports News Applications for subscribing to favorite sports news and demonstrating usage of IBM MFP Push Notifications.


Checkout this link to know more: [Notifications - IBM Mobile Foundation Developer Center](http://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/notifications/)


## Getting Started

  

### Pre-requisites

  

1. Make sure you have all the pre-requisites for a React Native app covered. See the [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) page if you're new to this whole stuff.

2. Setup of MobileFirst server

  

## Setting up the Sample

  

1. Get into the project directory: `cd PushNotificationsReactNative`

2. To add IBM MobileFirst&trade; Push capabilities to an existing React Native app, you add the react-native-ibm-mobilefirst & react-native-ibm-mobilefirst-push plug-in to your app. The react-native-ibm-mobilefirst plug-in contains the IBM MobileFirst Platform Foundation SDK and the react-native-ibm-mobilefirst-push contains all the APIs to work with Push Notifications.

 
	`npm i react-native-ibm-mobilefirst`

	`npm i react-native-ibm-mobilefirst-push`

  

3. Install other project dependencies: `npm install`
4. Change <TARGET> in Podfile to your project name

	 In  `ios` -> `Podfile` 
	`target '<TARGET>' do`  --->> `target 'MFPPushReactNative' do`

5. Link your project so that all native dependencies are added to your React Native project. This step is not required for react-native version 0.60 and above.

	`react-native link`

```
$react-native link

info Linking "react-native-ibm-mobilefirst" iOS dependency

info iOS module "react-native-ibm-mobilefirst" has been successfully linked

info Linking "react-native-ibm-mobilefirst" Android dependency

info Android module "react-native-ibm-mobilefirst" has been successfully linked

info Linking "react-native-ibm-mobilefirst-push" iOS dependency

info iOS module "react-native-ibm-mobilefirst-push" has been successfully linked

info Linking "react-native-ibm-mobilefirst-push" Android dependency

info Android module "react-native-ibm-mobilefirst-push" has been successfully linked
```
<!-- 
5. Register the app with your MFP Server:
```
cd android /cd ios
mfpdev app register
```

Example
```
cd android/
android > mfpdev app register
Verifying server configuration...
Registering to server:'http://127.0.0.1:9080' runtime:'mfp'
Registered app for platform: android
```
   -->
#  Update Application to subscribe news
- To get the news updates from online we are fetching it as a json response from below snippet

```
  async componentDidMount() {
    return fetch("https://api.myjson.com/bins/15rhwc")
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson.movies
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
```

- Update the Action Button with subscription list we would like to subscribe with the corresponding tags created on server

```

 <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Register"
            // onPress={() => console.log("notes tapped!")}
            onPress={this.registerDevice}
          >
            <Icon name="ios-log-in" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Sports"
            // onPress={() => {}}
            onPress={this.onSports}
          >
            <Icon
              name={this.state.sports ? "ios-star" : "ios-star-outline"}
              .
              .
              .
              .
              .
            <Icon name="ios-log-out" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
```

- Subcribe to tag

when action button clicked to subscribe for a tag we are calling this to subscribe the tag

```
  subscribe() {
    MFPPush.subscribe(["tag1", "tag2"])
      .then(data => {
        this.setState({
          result: SUCCESS + "Successfully subscribed to tag1 and tag2.",
          sports: true
        });
      })
      .catch(err => {
        this.setState({
          result: FAILURE + "Failed to subscribe to tag1 and tag2. " + err
        });
      });
  }
  ```

# Configure the Application

  

## Android

  - Register the android application:

		cd android 
		mfpdev app register

>NOTE: Double check the values in mfpclient.properties file

- Add the following lines to **AndroidManifest.xml** ({project-folder}/android/app/src/main/) :

  
	-  `xmlns:tools="http://schemas.android.com/tools"` --- within the **manifest** tag

	-  `tools:replace="android:allowBackup"` --- within the **application** tag

	- in  `<manifest>` tag add below permissions

	```
	<uses-permission android:name="android.permission.INTERNET" />
	<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
	<uses-permission android:name="android.permission.WAKE_LOCK"/>
	```

	- in the **application** tag inside the Main Activity of the app add the following intent-filter:
	
	```
	<intent-filter>
	<action android:name="<YOUR.PACKAGENAME>.IBMPushNotification" />  
	<category android:name="android.intent.category.DEFAULT" />
	</intent-filter>
	```

	- also, add the following under the **application** tag:
  

	```

	<activity android:name="com.ibm.mobilefirstplatform.clientsdk.android.push.api.MFPPushNotificationHandler"
	android:theme="@android:style/Theme.NoDisplay"/>

	<!-- MFPPush Intent Service -->

	<service android:exported="true" android:name="com.ibm.mobilefirstplatform.clientsdk.android.push.api.MFPPushIntentService">
	<intent-filter>
	<action android:name="com.google.firebase.MESSAGING_EVENT" />
	</intent-filter>
	</service>
	 
	<service android:name="com.ibm.mobilefirstplatform.clientsdk.android.push.api.MFPPush" android:exported="true">
	<intent-filter>
	<action android:name="com.google.firebase.INSTANCE_ID_EVENT" />
	</intent-filter>
	</service>

	```

  

  ---


  

- Register your app on Firebase Console.

	- create a new Project

	- go to Project Settings

	- click on **Add Firebase to your Android app**

	- give the package name **com.ibm.mobilefirstplatform.clientsdk.android.push**

	- click on Register app and skip the rest of the steps

	- add another app by clicking **add App** button

	- give the package name just as you have in your app. For eg. **com.MFPPushReactNative**

	- click on Register app

	- download the config file — **google-services.json** and paste it inside `/<YOUR—REACT—NATIVE—APP>/android/app/` directory

- Configure your MFP console app
	-  security scope element: _push.mobileclient_ set (for android) 
	-  FCM credentials are correctly put under _Push Settings_.

  



- open /android/build.gradle file

  
	- add the following line to dependencies{ … } inside the buildscript{ … } block

  

		`classpath 'com.google.gms:google-services:4.0.0'`

  

- open /android/app/build.gradle file

	- add the following lines inside the dependencies{…}


	```
	implementation 'com.google.firebase:firebase-core:16.0.1'
	implementation 'com.google.android.gms:play-services-base:15.0.1'
	implementation 'com.google.firebase:firebase-messaging:17.1.0'
	```

  

- finally add the following line at the end of the build.gradle file:

  

	`apply plugin: 'com.google.gms.google-services'`

- To run the application :

	`react-native run-android`

  

## iOS

  
 - Register the iOS application:

		cd ios
		mfpdev app register

- Install Mobilefirst specific cocopods dependencies to the project.

  

>  `cd ios && pod install`
  

-  **react-native-ibm-mobilefirst-push** plugin internally depends on **react-native-ibm-mobilefirst** plugin, so your app will be required to have **mfpclient** configuration file. Make sure your application is added with **mfpclient** configuration file updated with Valid MobileFirst Server Host Address.

  

- Setup the Push Notifications feature in MobileFirst Server Operations Console for Android and iOS Platforms. Refer [this](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/notifications/sending-notifications/#setting-up-notifications) documentation for more details.

- Make sure your iOS Application is configured with valid provisioning profile enabled with push capability

- By default, React Native creates a native iOS project built with application delegate class, therefore you will need to add the following code below to application delegate(`AppDelegate.m`) class file.

  

```

  

- (void) application:(UIApplication _) application didRegisterForRemoteNotificationsWithDeviceToken:(NSData _)deviceToken {

[[NSNotificationCenter defaultCenter] postNotificationName:@"RNMFPPushDidRegisterForRemoteNotificationsWithDeviceToken" object:deviceToken];

}

  

- (void) application:(UIApplication*)application didFailToRegisterForRemoteNotifications: (NSError*) error {

[[NSNotificationCenter defaultCenter] postNotificationName:@"RNMFPPushDidFailToRegisterForRemoteNotificationsWithError" object:error];

}

  

- (void)application:(UIApplication _)application didReceiveRemoteNotification:(NSDictionary _)userInfo {

[[NSNotificationCenter defaultCenter] postNotificationName:@"RNMFPPushDidReceiveRemoteNotification" object:userInfo];

}

  

```

  

- To run the application :

`react-native run-ios`

  

> **Note :** In XCode, in the project navigator, drag and drop **mfpclient.plist** from **ios** folder. This step is applicable only for iOS platform.

  

#### React Native App

  

- We need to add a Notification Event Listener in order to be notified when a Push Notification arrives. For this, add the following code to your JS file.

- Register a Notification Callback by using the **registerNotificationsCallback** API of **MFPPush** class:

`MFPPush.registerNotificationsCallback("my_listener");`

  

Finally add the following code to define a Event Listener:

  

```

  

import {Platform, DeviceEventEmitter, NativeAppEventEmitter} from 'react-native';

import {MFPPush, MFPSimplePushNotification} from 'react-native-ibm-mobilefirst-push'

  

const emitter = Platform.select({

ios: NativeAppEventEmitter,

android: DeviceEventEmitter,

});

  

emitter.addListener("my_listener", function(notification) {

// Here 'notification' is an instance of MFPSimplePushNotification class

console.log(notification.getAlert());

});

  

```

  

## Supported platforms

  

- Android

- iOS

  

## Documentation

  

See the IBM MobileFirst Platform Foundation section of IBM Dev Center:

  

[IBM Push Notifications](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/notifications/)
