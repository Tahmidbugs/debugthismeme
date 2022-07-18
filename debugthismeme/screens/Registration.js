import { Formik } from "formik";
import React from "react";
import firebase from "../firebase";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Yup from "yup";
import { validate } from "email-validator";
import { AntDesign } from "@expo/vector-icons";
const Registration = ({}) => {
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 320, height: 90, alignSelf: "center" }}
        />
        <Forms />
        <TouchableOpacity style={{ marginBottom: 10 }}>
          <Text style={{ color: "black", alignSelf: "center", marginTop: 50 }}>
            Already have an account?{" "}
            <Text style={{ color: "#0095F6", fontWeight: "800" }}>Log in!</Text>
          </Text>
        </TouchableOpacity>
        <FacebookandGoogle />
      </View>
    </View>
  );
};

const FacebookandGoogle = () => {
  return (
    <>
      <TouchableOpacity
        style={{
          backgroundColor: "#32519B",
          height: 35,
          width: "80%",
          alignSelf: "center",
          alignItems: "center",
          marginTop: 10,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <AntDesign
              name="facebook-square"
              size={24}
              color="black"
              style={{ alignSelf: "center", marginRight: 10 }}
            />
            <Text
              style={{
                fontWeight: "700",
                paddingVertical: 10,
                color: "white",
              }}
            >
              Sign in with Facebook
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#D0463B",
          height: 35,
          width: "80%",
          alignSelf: "center",
          alignItems: "center",
          marginTop: 10,
          borderRadius: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <AntDesign
            name="google"
            size={24}
            color="black"
            style={{ alignSelf: "center", marginRight: 10 }}
          />
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: "700",
                paddingVertical: 10,
                color: "white",
              }}
            >
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </>
  );
};

const Forms = ({ navigation }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().label("Email"),
    username: Yup.string().required().min(4),
    password: Yup.string().min(4).label("Password"),
  });

  const handleSignUp = async (email, password) => {
    try {
      const authUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const db = firebase.firestore();
      db.collection("users").doc(authUser.user.email).set({
        email: email,
        owner_uid: authUser.user.uid,
      });
      console.log("database added");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSignUp(values.email, values.password)}
      validateOnMount={true}
    >
      {({ handleChange, handleSubmit, values, isValid, handleBlur }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            name="email"
            placeholder="Email"
            placeholderTextColor="black"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            returnKeyType="next"
            autoCorrect={false}
            autoCapitalize="none"
            style={[
              styles.inputField,
              {
                borderColor:
                  values.email.length < 1 || validate(values.email)
                    ? null
                    : "red",
              },
            ]}
          />
          <TextInput
            name="password"
            placeholder="Password"
            placeholderTextColor="black"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            returnKeyType="go"
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
            style={[
              styles.inputField,
              {
                borderColor:
                  values.password.length > 6 || values.password.length < 1
                    ? null
                    : "red",
              },
            ]}
          />
          <TouchableOpacity
            style={styles.submitButton(isValid)}
            onPress={handleSubmit}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBD1EE",
    justifyContent: "center",
  },
  inputField: {
    backgroundColor: "#64587C",
    marginTop: 20,
    paddingVertical: 18,
    marginHorizontal: 20,
    paddingLeft: 20,
    borderRadius: 8,
    borderWidth: 1,
    color: "white",
  },
  submitButton: (isValid) => ({
    width: 320,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: isValid ? "#64587C" : "#AA8FE0",
    marginTop: 30,
    height: 35,
    borderRadius: 8,
  }),
});
export default Registration;
