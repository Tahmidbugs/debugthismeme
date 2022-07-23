import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import firebase from "../firebase";
import {
  AntDesign,
  FontAwesome,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CreatePost = ({ navigation, route }) => {
  const [template, setTemplate] = React.useState(null);

  React.useEffect(() => {
    if (route.params) {
      setTemplate({
        imageURI: route.params.imageURL,
        topCaption: route.params.topCaption,
        bottomCaption: route.params.bottomCaption,
      });
      console.log(route.params.imageURL);
    }
  }, [route.params]);

  return (
    <>
      <View style={{ backgroundColor: "black", flex: 1 }}>
        {template && <UploadPost navigation={navigation} template={template} />}
        {!template && <UploadPost navigation={navigation} />}
      </View>
      <View style={{ position: "absolute", bottom: 2 }}></View>
    </>
  );
};

const UploadPost = ({ navigation, template }) => {
  return (
    <View>
      <Header navigation={navigation} />
      <AppForm navigation={navigation} template={template} />
    </View>
  );
};

const Header = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign
          name="left"
          size={21}
          color="#F9883E"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>Create your post</Text>
      <Text></Text>
    </SafeAreaView>
  );
};

const AppForm = ({ navigation, template }) => {
  const validationSchema = Yup.object().shape({
    caption: Yup.string().max(
      2000,
      "Caption must not be over 2000 characters!"
    ),
  });
  let arr = new Array(tagList.length);
  arr.fill(false, 0, tagList.length);
  const [selectedTags, setSelectedTags] = React.useState(arr);
  const [topCaption, setTopCaption] = React.useState(
    template?.topCaption || ""
  );
  const [bottomCaption, setBottomCaption] = React.useState(
    template?.bottomCaption || ""
  );
  const [imageURI, setImageURI] = React.useState(template?.imageURI || null);

  const [thumbnail, setThumbnail] = React.useState(imageURI);

  const [currentLoggedInUser, setCurrentLoggedInUser] = React.useState(null);
  const getUserCredentials = async () => {
    const user = await firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("users")
      .doc(user.email)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          //   console.log("Document data:", doc.data());
          setCurrentLoggedInUser(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  React.useEffect(() => {
    getUserCredentials();
  }, []);

  const UploadPostToFirebase = async (
    imageURL,
    caption,
    tags,
    topCaption,
    bottomCaption
  ) => {
    const db = firebase.firestore();
    db.collection("users")
      .doc(firebase.auth().currentUser.email)
      .collection("posts")
      .add({
        imageURL: imageURL,
        caption: caption,
        tags: tags,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        profile_picture: currentLoggedInUser.profile_picture,
        username: currentLoggedInUser.username,
        topCaption: topCaption,
        bottomCaption: bottomCaption,
      })
      .then(() => {
        console.log("Document successfully uploaded!");
        navigation.navigate("Home");
      })
      .catch((error) => console.log("baal", error));
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", result.uri, true);
          xhr.send(null);
        });
        const metadata = { contentType: "image/jpg" };
        const current = new Date().toLocaleTimeString();
        const postedby = firebase.auth().currentUser.email;
        const imgRef = firebase
          .storage()
          .ref()
          .child(`${postedby}at${current}`);

        await imgRef.put(blob, metadata);

        // We're done with the blob, close and release it
        blob.close();

        // Image permanent URL

        const imageURL = await imgRef.getDownloadURL();
        setThumbnail(imageURL);
        console.log(imageURL);
      }
    } catch (error) {
      console.log("error reading image", error);
    }
  };

  return (
    <View>
      <Formik
        initialValues={{ caption: "" }}
        onSubmit={(values) => {
          UploadPostToFirebase(
            thumbnail,
            values.caption,
            selectedTags,
            topCaption,
            bottomCaption
          );
        }}
        validationSchema={validationSchema}
        validateOnMount={true}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          isValid,
          handleBlur,
        }) => (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  marginHorizontal: 30,
                  height: "100%",
                  maxWidth: "100%",
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderRadius: 15,
                  borderColor: "#F9883E",
                }}
              >
                <TextInput
                  name="caption"
                  placeholder="Add a post caption"
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={"#F9883E"}
                  style={{
                    color: "#F9883E",
                    fontSize: 18,
                    marginVertical: 30,
                    marginHorizontal: 10,
                  }}
                  onChangeText={handleChange("caption")}
                  onBlur={handleBlur("caption")}
                  value={values.caption}
                />
                {thumbnail && (
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: thumbnail }}
                      style={{ width: 250, height: 250 }}
                    />
                    {topCaption != "" && (
                      <Text
                        style={{
                          position: "absolute",
                          fontWeight: "900",
                          fontSize: 14,
                          top: 10,
                          alignSelf: "center",
                          color: "white",
                          textShadowColor: "black",
                          textShadowRadius: 5,
                        }}
                      >
                        {topCaption}
                      </Text>
                    )}
                    {bottomCaption != "" && (
                      <Text
                        style={{
                          position: "absolute",
                          fontWeight: "900",
                          fontSize: 14,
                          top: 220,
                          alignSelf: "center",
                          color: "white",
                          textShadowColor: "black",
                          textShadowRadius: 5,
                        }}
                      >
                        {bottomCaption}
                      </Text>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        setThumbnail(null);
                        setTopCaption("");
                        setBottomCaption("");
                      }}
                      style={{ position: "absolute", top: -15, left: 20 }}
                    >
                      <Ionicons name="close-circle" size={30} color="#F9883E" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 40,
              }}
            >
              <TouchableOpacity onPress={selectImage}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome name="photo" size={24} color="#F9883E" />
                  <Text
                    style={{
                      color: "#F9883E",
                      marginLeft: 10,
                      fontWeight: "700",
                    }}
                  >
                    Add a meme
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateMeme")}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="create" size={24} color="#F9883E" />
                  <Text
                    style={{
                      color: "#F9883E",
                      marginLeft: 10,
                      fontWeight: "700",
                    }}
                  >
                    Create a meme
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Tags
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={{ color: "black", fontWeight: "700" }}>
                Upload post
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const Tags = ({ selectedTags, setSelectedTags }) => {
  return (
    <>
      <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 30 }}>
        <FontAwesome name="tags" size={24} color="#F9883E" />
        <Text
          style={{
            color: "#F9883E",
            fontWeight: "800",
            marginLeft: 10,
            marginTop: 5,
            fontSize: 17,
          }}
        >
          Tags :
        </Text>
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

const BottomTab = () => {
  const [activeTab, setActiveTab] = React.useState("Home");
  return (
    <View
      style={{
        color: "black",
        backgroundColor: "black",
        width: "100%",
        height: 60,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 530,
      }}
    >
      {bottomTabIcons.map((icon, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setActiveTab(icon.name);
            navigation.navigate(icon.navigation);
          }}
        >
          <Image
            source={{
              uri: activeTab === icon.name ? icon.active : icon.inactive,
            }}
            style={[
              styles.Icon,
              icon.name === "Profile" ? styles.Profile() : null,
              activeTab == "Profile" && icon.name === activeTab
                ? styles.Profile(activeTab)
                : null,
            ]}
          />
        </TouchableOpacity>
      ))}
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
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: "#DBD1EE",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    height: 100,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  headerText: {
    color: "#F9883E",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 27.5,
  },
  Profile: (activeTab = "") => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: activeTab === "Profile" ? 2 : 0,
    borderColor: "black",
  }),
  submitButton: {
    width: 150,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#F9883E",
    marginTop: 60,
    height: 40,
    borderRadius: 8,
  },
  tag: (selectedTags, index) => ({
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 10,
    marginLeft: 14,
    backgroundColor: selectedTags[index] ? "#F18035" : "#FFBB8E",
    borderColor: selectedTags[index] ? "#F18035" : "#FFBB8E",
    borderWidth: 1,
    alignItems: "center",
    padding: 5,
    marginTop: 2,
  }),
  tagText: (selectedTags, index) => ({
    color: selectedTags[index] ? "black" : "white",
    fontWeight: "700",
  }),
});

export default CreatePost;
