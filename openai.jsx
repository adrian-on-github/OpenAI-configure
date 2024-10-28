import {Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useState } from "react";

const App = () => {
const [loading, setLoading] = useState(false);

// be sure to configure apiKey properly in .env
const apiKey = process.env.OPENAI_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";

  const [version, setVersion] = useState({
    state: "Free Trial",
  });

  const maxPrompts = version.state === "Premium" ? 15 : 2;
  const maxPromptsReUsed = version.state === "Premium" ? 15 : 2;

  const handleSend = async () => {
    if (promptsUsed >= maxPrompts && version.state !== "Premium") {
      Alert.alert(
        "Limit Reached",
        "Subscribe to HealthAI Plus to get a higher Usage Limit of prompt requests!",
        [
          { text: "OK" },
          { text: "Subscribe Now", onPress: () => console.log("paywall") },
        ],
        { cancelable: true }
      );
      return;
    }
    if (promptsUsed >= maxPrompts && version.state === "Premium") {
      Alert.alert("Limit Reached", "You have no more prompts left for today!", [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);

    try {
      const prompt = textInput;
      const response = await axios.post(
        apiUrl,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content:"You are an helpful assistant"
            },
          ],
          max_tokens: 2000,
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const text = response.data.choices[0].message.content;
      const newData = [
        ...data,
        { type: "user", text: textInput },
        { type: "bot", text: text },
      ];
      setData(newData);
      setTextInput("");

      const newCount = promptsUsed + 1;
      setPromptsUsed(newCount);
      await AsyncStorage.setItem("promptsUsed", newCount.toString());

      const newPrompt = {
        userPrompt: { type: "user", text: textInput },
        botResponse: { type: "bot", text: text },
        date: new Date().toISOString(), // Speichern des Zeitstempels
      };
      setSavedPrompts((prevPrompts) => [...prevPrompts, newPrompt]);

      await AsyncStorage.setItem(
        "savedPrompts",
        JSON.stringify([...savedPrompts, newPrompt])
      );
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending the prompt.");
    } finally {
      setLoading(false);
    }
  };
};

export default App;
