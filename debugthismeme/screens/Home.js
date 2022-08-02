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
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import firebase from "../firebase";
import {
  MaterialIcons,
  Entypo,
  Ionicons,
  FontAwesome,
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
  let arr = new Array(tagList.length);
  arr.fill(false, 0, tagList.length);
  const [selectedTags, setSelectedTags] = React.useState(arr);
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
  }, [selectedTags]);

  return (
    <View style={styles.container}>
      <Header />
      <UploadPost
        navigation={navigation}
        currentLoggedInUser={currentLoggedInUser}
      />
      <ScrollView style={{ maxHeight: "100%" }}>
        <Filters
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        {posts
          .filter((post) => {
            // console.log(post.tags);
            if (JSON.stringify(selectedTags) == JSON.stringify(arr)) {
              return post;
            }

            if (JSON.stringify(selectedTags) == JSON.stringify(post.tags)) {
              return post;
            }
          })
          .map((post) => (
            <Post key={post.id} post={post} />
          ))}
      </ScrollView>
      <BottomTab navigation={navigation} />
    </View>
  );
};

const Filters = ({ selectedTags, setSelectedTags }) => {
  return (
    <>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 15 }}
      >
        {tagList.map((tag, index) => (
          <TouchableOpacity
            style={styles.tag(selectedTags, index)}
            key={index}
            onPress={() => {
              setSelectedTags((selectedTags) => {
                return [
                  ...selectedTags.slice(0, index),
                  !selectedTags[index],
                  ...selectedTags.slice(index + 1),
                ];
              });
            }}
          >
            <Text style={styles.tagText(selectedTags, index)}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};
const tagList = ["Python", "C++", "Javascript", "Java", "C#", "PHP"];

const Post = ({ post }) => {
  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

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
      <PostReaction post={post} />
    </View>
  );
};
const PostReaction = ({ post }) => {
  const [neutral, setNeutral] = React.useState(false);
  const [lol, setLol] = React.useState(false);
  const [rofl, setRofl] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const currentValue = React.useState(new Animated.Value(0))[0];
  const handleNeutral = () => {
    setNeutral(!neutral);
    if (!neutral) {
      setVisible(true);
    }
    console.log(post);
    if (!neutral) {
      Animated.spring(currentValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(currentValue, {
          toValue: 0,
          friction: 2,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
        });
      });
    }
    const db = firebase.firestore();
    db.collection("users")
      .doc(post.op_email)
      .collection("posts")
      .doc(post.id)
      .update({
        neutral: !neutral
          ? firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.email
            )
          : firebase.firestore.FieldValue.arrayRemove(
              firebase.auth().currentUser.email
            ),
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };
  const handleLol = () => {
    setLol(!lol);
    if (!lol) {
      setVisible2(true);
    }
    if (!lol) {
      Animated.spring(currentValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(currentValue, {
          toValue: 0,
          friction: 2,
          useNativeDriver: true,
        }).start(() => {
          setVisible2(false);
        });
      });
    }
    const db = firebase.firestore();
    db.collection("users")
      .doc(post.op_email)
      .collection("posts")
      .doc(post.id)
      .update({
        lol: !lol
          ? firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.email
            )
          : firebase.firestore.FieldValue.arrayRemove(
              firebase.auth().currentUser.email
            ),
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };
  const handleRofl = () => {
    setRofl(!rofl);
    if (!rofl) {
      setVisible3(true);
    }
    if (!rofl) {
      Animated.spring(currentValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(currentValue, {
          toValue: 0,
          friction: 2,
          useNativeDriver: true,
        }).start(() => {
          setVisible3(false);
        });
      });
    }
    const db = firebase.firestore();
    db.collection("users")
      .doc(post.op_email)
      .collection("posts")
      .doc(post.id)
      .update({
        rofl: !rofl
          ? firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.email
            )
          : firebase.firestore.FieldValue.arrayRemove(
              firebase.auth().currentUser.email
            ),
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const AnimatedImage = Animated.createAnimatedComponent(Image);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginTop: "2%",
          justifyContent: "space-around",
          marginTop: 30,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleNeutral}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {visible && (
            <AnimatedImage
              style={[
                {
                  position: "absolute",
                  top: post.imageURL ? -220 : -100,
                  alignSelf: "center",
                  left: 80,
                  zIndex: 3,
                  height: 100,
                  width: 100,
                  transform: [
                    {
                      scale: currentValue,
                    },
                  ],
                },
              ]}
              source={require("../assets/neutral_clicked.png")}
            />
          )}
          {neutral ? (
            <>
              <Image
                source={require("../assets/neutral_clicked.png")}
                style={{ height: 30, width: 30 }}
              />
            </>
          ) : (
            <>
              <Image
                source={require("../assets/neutral_unclicked.png")}
                style={{ height: 30, width: 30 }}
              />
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLol}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {visible2 && (
            <AnimatedImage
              style={[
                {
                  position: "absolute",
                  top: post.imageURL ? -220 : -100,
                  alignSelf: "center",
                  left: -30,
                  zIndex: 3,
                  height: 100,
                  width: 100,
                  transform: [
                    {
                      scale: currentValue,
                    },
                  ],
                },
              ]}
              source={require("../assets/lol_clicked.png")}
            />
          )}
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
        <TouchableOpacity
          onPress={handleRofl}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {visible3 && (
            <AnimatedImage
              style={[
                {
                  position: "absolute",
                  top: post.imageURL ? -220 : -100,
                  alignSelf: "center",
                  left: -140,
                  zIndex: 3,
                  height: 100,
                  width: 100,
                  transform: [
                    {
                      scale: currentValue,
                    },
                  ],
                },
              ]}
              source={require("../assets/rofl_clicked.png")}
            />
          )}
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
      {(neutral || lol || rofl) && (
        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-around",
            marginTop: 0,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "orange" }}>({post.neutral.length})</Text>
          <Text style={{ color: "orange" }}>({post.lol.length})</Text>
          <Text style={{ color: "orange" }}>({post.rofl.length})</Text>
        </View>
      )}
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
            width: 220,
            height: 80,
            backgroundColor: "#130A01",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 230, height: 80, marginTop: 2 }}
          />
        </View>
        <TouchableOpacity onPress={signOut}>
          <Entypo name="log-out" size={24} color="#E79039" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const BottomTab = ({ navigation }) => {
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
      <Ionicons
        name="search-circle"
        size={40}
        color="#E79039"
        onPress={() => navigation.navigate("SearchScreen")}
      />
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
  tag: (selectedTags, index) => ({
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 10,
    marginLeft: 14,
    backgroundColor: selectedTags[index] ? "#F18035" : "#E79039",
    borderColor: selectedTags[index] ? "black" : "#F18035",
    borderWidth: 1,
    alignItems: "center",
    padding: 5,
    marginTop: 2,
  }),
  tagText: (selectedTags, index) => ({
    color: selectedTags[index] ? "white" : "black",
    fontWeight: "700",
  }),
});

export default Home;
