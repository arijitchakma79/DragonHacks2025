// src/components/tabs/AskAITab.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { tabContentStyles } from '../../styles/tabStyles';

// Your Flask server URL
const API_BASE_URL = 'http://10.250.106.84:5000'; 

// Sample wound data
const sampleWoundData = {
  "records": [
    { "date": "2025-04-25", "length_cm": 5.2, "width_cm": 4.1 },
    { "date": "2025-04-26", "length_cm": 5.0, "width_cm": 3.9 },
    { "date": "2025-04-27", "length_cm": 4.7, "width_cm": 3.7 },
    { "date": "2025-04-28", "length_cm": 4.4, "width_cm": 3.5 }
  ]
};

const AskAITab = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskGemini = async () => {
    if (!question.trim()) {
      alert('Please enter a question!');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const fullPrompt = `
Here is the patient's wound healing data:

${JSON.stringify(sampleWoundData, null, 2)}

Based on this data, please answer the following question:
"${question}"

Please keep your answer simple, helpful, and medically appropriate.
`;

      const res = await axios.post(`${API_BASE_URL}/analyze-wound-data`, { "prompt": fullPrompt }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponse(res.data.analysis);
    } catch (error) {
      console.error('Error talking to Gemini:', error);
      setResponse('Failed to get response from AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={tabContentStyles.title}>💬 Ask AI about your Wound</Text>

      {/* Question Input */}
      <TextInput
        style={styles.input}
        placeholder="Type your question about the wound healing..."
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      {/* Ask Button */}
      <TouchableOpacity style={styles.button} onPress={handleAskGemini} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Thinking...' : 'Ask Gemini'}</Text>
      </TouchableOpacity>

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {/* AI Response */}
      {response.length > 0 && (
        <View style={styles.responseBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>🧠 Gemini's Response:</Text>
          <Text style={{ fontSize: 16 }}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 120,
    marginTop: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  responseBox: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
});

export default AskAITab;
