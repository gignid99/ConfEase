import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig'; // added auth now
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


const signIn = async () => {
  if (!email.trim() || !password.trim()) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // Step 1️⃣: Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;


    // Step 2️⃣: Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      alert("User data not found. Please sign up again.");
      return;
    }

    const userData = userDoc.data();
    const role = userData.role;
    const approved=userData.approve;
     if (approved=="pending") {
      alert("your account is pending for admin approvale!");
      return;
    }

    console.log("Logged in as:", role);

    // Step 3️⃣: Navigate based on role
    if (role === "admin") {
      router.replace("/adminHome" as any);
    } else if (role === "organizer") {
      router.replace("/organizerHome" as any);
    } else if (role === "attendee") {
      router.replace("/attendeeHome" as any);
    } else {
      alert("Unknown role. Contact support.");
    }
  } catch (error: any) {
    console.error(error);
    alert("Sign in failed: " + error.message);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.brandName}>ConFX</Text>
        </View>

        {/* Sign In Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign in</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            {/* <View style={styles.inputIcon}>
            <View style={styles.emailIcon} />
          </View> */}
            <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="abc@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            {/* <View style={styles.inputIcon}>
            <View style={styles.lockIcon} />
          </View> */}
            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {/* //<View style={styles.eyeIconShape} /> */}
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <View style={styles.rememberMe}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                thumbColor="#fff"
              />
              <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={signIn}>
            <Text style={styles.signInButtonText}>SIGN IN</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            {/* <View style={styles.googleIcon} /> */}
            <Ionicons name="logo-google" size={24} color="#4285f4" style={{ marginRight: 12 }} />
            <Text style={styles.socialButtonText}>Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            {/* <View style={styles.facebookIcon} /> */}
            <Ionicons name="logo-facebook" size={24} color="#1877f2" style={{ marginRight: 12 }} />
            <Text style={styles.socialButtonText}>Login with Facebook</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href="/signup" style={styles.signUpLink}>
              Sign up
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22d3ee',
    borderWidth: 3,
    borderColor: '#fff',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1f2937',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  emailIcon: {
    width: 20,
    height: 16,
    backgroundColor: '#9ca3af',
    borderRadius: 2,
  },
  lockIcon: {
    width: 16,
    height: 20,
    backgroundColor: '#9ca3af',
    borderRadius: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconShape: {
    width: 24,
    height: 16,
    backgroundColor: '#9ca3af',
    borderRadius: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  forgotText: {
    fontSize: 14,
    color: '#6366f1',
  },
  signInButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    marginRight: 8,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9ca3af',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285f4',
    marginRight: 12,
  },
  facebookIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1877f2',
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signUpText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signUpLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
});