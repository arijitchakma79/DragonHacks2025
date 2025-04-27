// src/components/tabs/AskAITab.tsx

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.250.106.84:5000'; // your server IP

const AskAITab = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const woundData = {
        "records": [
          { "date": "2025-04-25", "length_cm": 5.2, "width_cm": 4.1 },
          { "date": "2025-04-26", "length_cm": 5.0, "width_cm": 3.9 },
          { "date": "2025-04-27", "length_cm": 4.7, "width_cm": 3.7 },
          { "date": "2025-04-28", "length_cm": 4.4, "width_cm": 3.5 }
        ]
      };

      const fullPrompt = `
You are a wound healing assistant AI. Here is the patient's data:

${JSON.stringify(woundData, null, 2)}

Now answer clearly:
"${input}"
`;

      const res = await axios.post(`${API_BASE_URL}/analyze-wound-data`, { prompt: fullPrompt }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessages(prev => [...prev, { role: 'ai', text: res.data.analysis }]);
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: '❌ Failed to get AI response.' }]);
    } finally {
      setLoading(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1 }}>
        {/* Chat Scroll Area */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          {loading && (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10 }} />
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Gemini about your wound..."
            placeholderTextColor="#aaa"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AskAITab;

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#e6f0ff',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
