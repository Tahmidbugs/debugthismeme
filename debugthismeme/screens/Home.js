import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import firebase from "../firebase";
import {
  MaterialIcons,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const Home = ({ navigation }) => {
  const [currentLoggedInUser, setCurrentLoggedInUser] = React.useState(null);
  const getUserCredentials = async () => {
    const user = await firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("users")
      .doc(user.email)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setCurrentLoggedInUser(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  const [posts, setPosts] = React.useState([]);

  const getPosts = async () => {
    let mounted = true;
    const db = firebase.firestore();
    if (mounted) {
      try {
        db.collectionGroup("posts")
          //   .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setPosts(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
          });
      } catch (error) {
        console.log("Error at", error);
      }
    }
    mounted = false;
  };

  React.useEffect(() => {
    getUserCredentials();
    getPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <UploadPost
        navigation={navigation}
        currentLoggedInUser={currentLoggedInUser}
      />
      <ScrollView style={{ maxHeight: "100%" }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </ScrollView>
      <BottomTab />
    </View>
  );
};
const Post = ({ post }) => {
  const [neutral, setNeutral] = React.useState(false);
  const [lol, setLol] = React.useState(false);
  const [rofl, setRofl] = React.useState(false);

  return (
    <View
      style={{
        marginTop: "2%",
        marginBottom: "2%",
        marginHorizontal: "2%",
        borderWidth: 1,
        borderColor: "#E79039",
        borderRadius: 10,
        backgroundColor: "#130A01",
        padding: "5%",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: post.profile_picture }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: "#E79039",
          }}
        />

        <View style={{ marginLeft: "2%" }}>
          <Text style={{ fontSize: 20, color: "white" }}>{post.username}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, marginTop: "4%", color: "white" }}>
        {post.caption}
      </Text>
      {post.imageURL && (
        <Image
          style={{ width: 350, height: 300, marginTop: "5%" }}
          source={{ uri: post.imageURL }}
        />
      )}
      {post.topCaption != "" && (
        <Text
          style={{
            position: "absolute",
            fontWeight: "900",
            fontSize: 20,
            top: 130,
            alignSelf: "center",
            color: "white",
            textShadowColor: "black",
            textShadowRadius: 5,
          }}
        >
          {post.topCaption}
        </Text>
      )}
      {post.bottomCaption != "" && (
        <Text
          style={{
            position: "absolute",
            fontWeight: "900",
            fontSize: 20,
            top: 370,
            alignSelf: "center",
            color: "white",
            textShadowColor: "black",
            textShadowRadius: 5,
          }}
        >
          {post.bottomCaption}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          marginTop: "2%",
          justifyContent: "space-around",
          marginTop: 30,
        }}
      >
        <TouchableOpacity onPress={() => setNeutral(!neutral)}>
          {neutral ? (
            <Image
              source={require("../assets/neutral_clicked.png")}
              style={{ height: 30, width: 30 }}
            />
          ) : (
            <Image
              source={require("../assets/neutral_unclicked.png")}
              style={{ height: 30, width: 30 }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLol(!lol)}>
          {lol ? (
            <Image
              source={require("../assets/lol_clicked.png")}
              style={{ height: 30, width: 30 }}
            />
          ) : (
            <Image
              source={require("../assets/lol_unclicked.png")}
              style={{ height: 30, width: 30 }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRofl(!rofl)}>
          {rofl ? (
            <Image
              source={require("../assets/rofl_clicked.png")}
              style={{ height: 30, width: 30 }}
            />
          ) : (
            <Image
              source={require("../assets/rofl_unclicked.png")}
              style={{ height: 30, width: 30 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Header = () => {
  const signOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => firebase.auth().signOut() },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <View
        style={{
          height: 45,
          backgroundColor: "black",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: "15%",
        }}
      >
        <Text> </Text>
        <View
          style={{
            width: 300,
            height: 100,
            backgroundColor: "#130A01",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <Image
            source={require("../assets/logo3.png")}
            style={{ width: 250, height: 100, marginTop: 2 }}
          />
        </View>
        <TouchableOpacity onPress={signOut}>
          <Entypo name="log-out" size={24} color="#E79039" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const BottomTab = () => {
  const [activeTab, setActiveTab] = React.useState("Home");

  const textoverPicture = () => {
    if (activeTab === "Home") {
      return "Home";
    } else if (activeTab === "Profile") {
      return "Profile";
    } else if (activeTab === "Settings") {
      return "Settings";
    }
  };

  return (
    <View
      style={{
        color: "black",
        backgroundColor: "black",
        width: "100%",
        height: 80,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <Ionicons name="search-circle" size={40} color="#E79039" />
      <MaterialCommunityIcons name="home-circle" size={60} color="#E79039" />
      <MaterialIcons name="account-circle" size={35} color="#E79039" />
    </View>
  );
};
const bottomTabIcons = [
  {
    name: "Search",
    active: "https://img.icons8.com/ios-filled/500/ffffff/search--v1.png",
    inactive: "https://img.icons8.com/ios/500/ffffff/search--v1.png",
    navigation: "SearchScreen",
  },
  {
    name: "Home",
    active: "https://img.icons8.com/fluency-systems-filled/144/ffffff/home.png",
    inactive:
      "https://img.icons8.com/fluency-systems-regular/48/ffffff/home.png",
    navigation: "Home",
  },

  {
    name: "Profile",
    active:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfHXJexU8T3fYobb9B7aPWEeXa1scKM4cweQ&usqp=CAU",
    inactive:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfHXJexU8T3fYobb9B7aPWEeXa1scKM4cweQ&usqp=CAU",
    navigation: "ProfileScreen",
  },
];

const UploadPost = ({ navigation, currentLoggedInUser }) => {
  return (
    <View>
      <View style={{ marginTop: 40, marginLeft: 10, flexDirection: "row" }}>
        {currentLoggedInUser && (
          <>
            <Image
              source={{ uri: currentLoggedInUser.profile_picture }}
              style={{
                width: 50,
                height: 50,
                marginTop: 2,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: "#E79039",
              }}
            />
          </>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("CreatePost")}
          style={{
            height: 50,
            width: 310,
            borderColor: "#E79039",
            borderWidth: 1,
            borderStyle: "dotted",
            borderRadius: 25,
            marginLeft: 10,
            paddingLeft: 15,
            paddingRight: 10,
            paddingTop: 15,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#E79039",
              textAlignVertical: "center",
              fontWeight: "200",
            }}
          >
            Write a pun or share a meme
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#E79039",
          height: 1,
          width: "100%",
          marginTop: 30,
        }}
      ></View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  submitButton: (isValid) => ({
    width: 350,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: isValid ? "#64587C" : "#AA8FE0",
    marginTop: 30,
    height: 40,
    borderRadius: 8,
  }),
  inputField: {
    backgroundColor: "#64587C",
    marginTop: 20,
    paddingVertical: 18,
    marginHorizontal: 20,
    paddingLeft: 20,
    color: "white",
    borderRadius: 8,
    borderWidth: 1,
  },
  Icon: {
    width: 30,
    height: 30,
  },
  Profile: (activeTab = "") => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: activeTab === "Profile" ? 2 : 0,
    borderColor: "white",
  }),
});

export default Home;
