import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, View } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

// Überprüfen, ob der API-Schlüssel korrekt geladen wurde
console.log('Loaded API Key:', OPENAI_API_KEY);

const HealthAi = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // Ensure the model is correctly specified
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json', // Ensure the content type is specified
          },
        }
      );
      setResponse(result.data.choices[0].message.content);
    } catch (error) {
      console.error('Error creating completion:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold">HealthAI</Text>
      <View className="w-full mt-4">
        <TextInput
          className="border p-2 w-full rounded"
          placeholder="Frag etwas..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Senden" onPress={handleSend} />
      </View>
      {response ? (
        <View className="mt-4 p-4 border rounded w-full">
          <Text className="text-lg">{response}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default HealthAi;
