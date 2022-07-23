import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const EditTemplate = ({ navigation, route }) => {
  const { URI } = route.params;

  const [topCaption, onChangeTopCaption] = React.useState("");
  const [bottomCaption, onChangeBottomCaption] = React.useState("");

  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <View>
        <Text
          style={{
            color: "#F9883E",
            alignSelf: "center",
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 70,
          }}
        >
          Generate your meme
        </Text>
      </View>

      <View style={{ marginLeft: 5, marginTop: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: "#F9883E",
              fontSize: 18,
              fontWeight: "bold",
              marginRight: 26,
            }}
          >
            Top Caption:
          </Text>
          <TextInput
            name="topText"
            placeholder="Type top caption in here"
            placeholderTextColor="#F9883E"
            onChangeText={onChangeTopCaption}
            autoCapitalize="none"
            returnKeyType="next"
            autoCorrect={false}
            value={topCaption}
            style={{
              backgroundColor: "#231201",
              borderRadius: 10,
              marginLeft: 5,
              paddingLeft: 10,
              fontWeight: "200",
              color: "#F9883E",
              width: 250,
              height: 30,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#F9883E", fontSize: 18, fontWeight: "bold" }}>
            Bottom Caption:
          </Text>
          <TextInput
            name="bottomText"
            placeholder="Type bottom caption in here"
            placeholderTextColor="#F9883E"
            onChangeText={onChangeBottomCaption}
            autoCapitalize="none"
            returnKeyType="next"
            autoCorrect={false}
            value={bottomCaption}
            style={{
              backgroundColor: "#231201",
              borderRadius: 10,
              marginLeft: 5,
              color: "#F9883E",
              paddingLeft: 10,
              width: 250,
              height: 30,
              fontWeight: "200",
            }}
          />
        </View>
      </View>
      <View style={{}}>
        <Image source={{ uri: URI }} style={{ height: 400, width: "100%" }} />
        {topCaption != "" && (
          <Text
            style={{
              position: "absolute",
              top: 10,
              fontWeight: "900",
              alignSelf: "center",
              fontSize: 27,
              color: "white",
              textShadowColor: "black",
              textShadowRadius: 5,
            }}
          >
            {topCaption == "" ? "Top caption goes here" : topCaption}
          </Text>
        )}
        {bottomCaption != "" && (
          <Text
            style={{
              position: "absolute",
              fontWeight: "900",
              fontSize: 23,
              top: 350,
              alignSelf: "center",
              color: "white",
              textShadowColor: "black",
              textShadowRadius: 5,
            }}
          >
            {bottomCaption == "" ? "Bottom caption goes here" : bottomCaption}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="sticker-minus"
            size={40}
            color="#AA0908"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CreatePost", {
              imageURL: URI,
              topCaption: topCaption,
              bottomCaption: bottomCaption,
            })
          }
        >
          <MaterialCommunityIcons
            name="sticker-check"
            size={40}
            color="#44B906"
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 5,
          justifyContent: "space-around",
        }}
      >
        <Text style={{ color: "black", fontWeight: "bold" }}>Discard</Text>
        <Text style={{ color: "black", fontWeight: "bold" }}>Use Meme</Text>
      </View>
    </View>
  );
};

export default EditTemplate;
