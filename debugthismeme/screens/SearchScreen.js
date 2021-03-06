import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import firebase from "../firebase";

const SearchScreen = () => {
  const navigation = useNavigation();

  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState(null);

  const getUsers = () => {
    const db = firebase.firestore();
    const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsubscribe;
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      getUsers();
    }
    console.log(users);
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
      {users && (
        <>
          <View
            style={{
              backgroundColor: "#2B1701",
              flexDirection: "row",
              height: 35,
              borderRadius: 8,
              alignItems: "center",
              paddingHorizontal: 10,
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <AntDesign
              name="search1"
              size={18}
              color="#80572A"
              style={{ paddingRight: 10 }}
            />
            <TextInput
              placeholder="Search fellow programmers"
              placeholderTextColor="#80572A"
              style={{ flex: 1, fontSize: 18, color: "#F18035" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.nativeEvent.text)}
              returnKeyType="search"
            />
          </View>

          <ScrollView>
            {searchInput == "" && (
              <Text
                style={{
                  color: "#F18035",
                  padding: 15,
                  fontSize: 15,
                  fontWeight: "600",
                  marginLeft: 10,
                }}
              >
                Suggested for you
              </Text>
            )}
            {users
              .filter((user) => {
                if (
                  user.username
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
                )
                  return user;
              })
              .map((user) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  key={user.id}
                  onPress={() =>
                    navigation.navigate(
                      user.email == firebase.auth().currentUser.email
                        ? "ProfileScreen"
                        : "UserProfile",
                      user.email.toLowerCase()
                    )
                  }
                >
                  <Image
                    source={{ uri: user.profile_picture }}
                    style={{ height: 60, width: 60, borderRadius: 80 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: "#F18035", fontWeight: "800" }}>
                      {user.username}
                    </Text>
                    <Text style={{ color: "#F18035", fontWeight: "500" }}>
                      {user.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
