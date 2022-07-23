import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import one from "../assets/memetemplates/1.jpg";
const oneUri = Image.resolveAssetSource(one).uri;
import two from "../assets/memetemplates/2.jpg";
const twoUri = Image.resolveAssetSource(two).uri;
import three from "../assets/memetemplates/3.jpg";
const threeUri = Image.resolveAssetSource(three).uri;
import four from "../assets/memetemplates/4.jpg";
const fourUri = Image.resolveAssetSource(four).uri;
import five from "../assets/memetemplates/5.jpg";
const fiveUri = Image.resolveAssetSource(five).uri;
import six from "../assets/memetemplates/6.png";
const sixUri = Image.resolveAssetSource(six).uri;
import seven from "../assets/memetemplates/7.jpg";
const sevenUri = Image.resolveAssetSource(seven).uri;
import * as ImagePicker from "expo-image-picker";
import firebase from "../firebase";
const imageURIS = [
  oneUri,
  twoUri,
  threeUri,
  fourUri,
  fiveUri,
  sixUri,
  sevenUri,
];
const CreateMeme = ({ navigation }) => {
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
        navigation.navigate("EditTemplate", { URI: imageURL });
      }
    } catch (error) {
      console.log("error reading image", error);
    }
  };

  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <Text
        style={{
          color: "#F9883E",
          alignSelf: "center",
          fontSize: 25,
          fontWeight: "bold",
          marginTop: 70,
        }}
      >
        Select a template
      </Text>
      <ScrollView>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 30 }}>
          {imageURIS.map((URI, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("EditTemplate", { URI: URI })}
            >
              <Image
                source={{ uri: URI }}
                style={{
                  width: 185,
                  height: 200,
                  margin: 5,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#F9883E",
                }}
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={selectImage}>
            <Image
              source={{
                uri: "https://t3.ftcdn.net/jpg/02/18/21/86/360_F_218218632_jF6XAkcrlBjv1mAg9Ow0UBMLBaJrhygH.jpg",
              }}
              style={{ width: 185, height: 200, margin: 5, borderRadius: 20 }}
            />
            <Text
              style={{
                position: "absolute",
                color: "#F9883E",
                top: 20,
                alignSelf: "center",
                fontWeight: "800",
              }}
            >
              Use your own template
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateMeme;
