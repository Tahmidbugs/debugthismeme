import { Formik } from "formik";
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
import * as Yup from "yup";
import { validate } from "email-validator";
import firebase from "../firebase";
const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 320, height: 90, alignSelf: "center", marginTop: 60 }}
      />

      <View
        style={{
          backgroundColor: "#CEBEEC",
          flex: 1,
          marginTop: 20,
          borderTopEndRadius: 100,
          borderTopStartRadius: 100,
        }}
      >
        <View style={{ marginTop: 50 }}>
          <Text
            style={{
              color: "#64587C",
              fontSize: 25,
              marginBottom: 40,
              fontWeight: "800",
              alignSelf: "center",
            }}
          >
            Sign in
          </Text>
          <Forms navigation={navigation} />
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text
              style={{
                color: "#64587C",
                alignSelf: "center",
                marginTop: 50,
                fontWeight: "600",
              }}
            >
              New user?{" "}
              <Text style={{ color: "#64587C", fontWeight: "800" }}>
                Sign up!
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Forms = ({ navigation }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required().label("Email"),
    password: Yup.string()
      .min(6, "Password has to have at least 6 characters")
      .label("Password"),
  });

  const handleLogIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);

      console.log("Signed in!");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleLogIn(values.email, values.password)}
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
        <View style={{ width: "100%" }}>
          <Text
            style={{
              color: "#64587C",
              fontWeight: "800",
              marginLeft: 25,
              marginBottom: -10,
            }}
          >
            Username or email
          </Text>
          <TextInput
            name="email"
            placeholderTextColor="#9D89BF"
            onChangeText={handleChange("email")}
            autoCapitalize="none"
            keyboardType="email-address"
            autoFocus={true}
            onBlur={handleBlur("email")}
            returnKeyType="next"
            autoCorrect={false}
            value={values.email}
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
          <Text
            style={{
              color: "#64587C",
              fontWeight: "800",
              marginLeft: 25,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Password
          </Text>
          <TextInput
            name="password"
            placeholderTextColor="#9D89BF"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            returnKeyType="go"
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
            value={values.password}
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
            onPress={() => navigation.navigate("Registration")}
            style={{ flexDirection: "row-reverse" }}
          >
            <Text
              style={{
                color: "#64587C",
                fontWeight: "600",
                margin: 10,
                fontSize: 12,
                marginRight: 30,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton(isValid)}
            onPress={handleSubmit}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>Log in</Text>
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
});
export default LoginScreen;
