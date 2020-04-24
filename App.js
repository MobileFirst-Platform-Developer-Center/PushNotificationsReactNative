
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
  DeviceEventEmitter,
  Alert,
  FlatList
} from "react-native";
import {
  MFPPush,
  MFPSimplePushNotification
} from "react-native-ibm-mobilefirst-push";

import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import { FloatingAction } from "react-native-floating-action";

const NOTIFICATION_CALLBACK_RECEIVER = "NOTIFICATION_CALLBACK_RECEIVER";
const SUCCESS = "SUCCESS\n";
const FAILURE = "FAILURE\n";

DeviceEventEmitter.addListener(NOTIFICATION_CALLBACK_RECEIVER, function(event) {
  var notification = new MFPSimplePushNotification(event);
  Alert.alert(notification.getAlert());
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      sports: false,
      isLoading: true
    };

    // views
    // this.returnOperationDetailView = this.returnOperationDetailView.bind(this);

    // operations
    this.registerDevice = this.registerDevice.bind(this);
    this.unregisterDevice = this.unregisterDevice.bind(this);
    this.getSubscriptions = this.getSubscriptions.bind(this);
    this.getTags = this.getTags.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.onSports = this.onSports.bind(this);
  }

  async componentDidMount() {
    // return fetch("https://facebook.github.io/react-native/movies.json")
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

  onSports() {
    console.log("Reached Here: " + this.state.sports);
    this.state.sports ? this.unsubscribe() : this.subscribe();
    console.log("Reached Here2: " + this.state.sports);
  }

  registerDevice() {
    MFPPush.initialize();
    MFPPush.registerDevice()
      .then(data => {
        console.log("registered");
        console.log(this.state.result);
        MFPPush.registerNotificationsCallback(NOTIFICATION_CALLBACK_RECEIVER);
        this.setState({ result: SUCCESS + "Successfully registered device." });
        console.log(this.state.result);
      })
      .catch(err => {
        console.log("failed");
        this.setState({
          result: FAILURE + "Failed to register device. " + JSON.stringify(err)
        });
      });
  }

  unregisterDevice() {
    MFPPush.unregisterDevice()
      .then(data => {
        this.setState({ result: SUCCESS + "Successfully unregistered device" });
      })
      .catch(err => {
        this.setState({
          result:
            FAILURE + "Failed to unregister device. " + JSON.stringify(err)
        });
      });
  }

  getSubscriptions() {
    MFPPush.getSubscriptions()
      .then(data => {
        var res = "Successfully received device subscriptions: \n";
        res += JSON.stringify(data) + "\n";
        this.setState({ result: SUCCESS + res });
      })
      .catch(err => {
        this.setState({
          result:
            FAILURE + "Failed to get subscriptions. " + JSON.stringify(err)
        });
      });
  }

  getTags() {
    MFPPush.getTags()
      .then(data => {
        var res = "Successfully received tags available for subscriptions: \n";
        res += JSON.stringify(data) + "\n";
        this.setState({ result: SUCCESS + res });
      })
      .catch(err => {
        this.setState({
          result:
            FAILURE +
            "Failed to get available tags for application. " +
            JSON.stringify(err)
        });
      });
  }

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

  unsubscribe() {
    // alert("unsubscribe");
    MFPPush.unsubscribe(["tag1", "tag2"])
      .then(data => {
        this.setState({
          result: SUCCESS + "Successfully unsubscribed from tag1 and tag2.",
          sports: false
        });
      })
      .catch(err => {
        this.setState({
          result: FAILURE + "Failed to unsubscribe from tag1 and tag2. " + err
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Basic Example</Text>

        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                height: 100,
                padding: 2
                // fontWeight: bol
              }}
            >
              <View style={{ backgroundColor: "blue", flex: 0.3 }} />
              <View style={{ backgroundColor: "red", flex: 0.5 }} />
              <Text style={{ fontWeight: "bold" }}>
                {item.title} : {item.description}
              </Text>
            </View>
          )}
          keyExtractor={({ id }, index) => id}
        />
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
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="All Tasks"
            onPress={() => {}}
          >
            <Icon name="ios-download" style={styles.actionButtonIcon} />
          </ActionButton.Item>

          <ActionButton.Item
            buttonColor="#ab59b6"
            title="UnRegister"
            // onPress={() => console.log("notes tapped!")}
            onPress={this.unregisterDevice}
          >
            <Icon name="ios-log-out" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  testItemsContainer: {
    height: "70%",
    width: "100%"
  },
  testResultsContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "black"
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 30,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
