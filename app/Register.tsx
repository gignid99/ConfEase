import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [entryNo, setEntryNo] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    console.log('Registered:', { fullName, entryNo, email });
    router.push('/signin');
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

        {/* Register Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Register</Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Entry Number */}
          <View style={styles.inputContainer}>
            <Ionicons name="id-card-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Entry No."
              placeholderTextColor="#999"
              value={entryNo}
              onChangeText={setEntryNo}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
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

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTER</Text>
          </TouchableOpacity>

          {/* Already Registered */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already registered? </Text>
            <Link href="/signin" style={styles.signInLink}>
              Sign in
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
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    maxWidth: 400, // keeps it narrow like SignIn
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
    textAlign: 'center',
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
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signInLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
});
