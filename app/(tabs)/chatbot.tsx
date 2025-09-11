import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { cleanMarkdown, sendChatMessage, speechToText, SUPPORTED_LANGUAGES, textToSpeech } from "../api/chatbot";

const LIME = "#9AF300";
const { width: screenWidth } = Dimensions.get("window");

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your farming assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      language: "English",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [sound, recording]);

  const addMessage = (text: string, isUser: boolean, language: string = selectedLanguage) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    addMessage(userMessage, true);

    setIsLoading(true);
    setLoadingMessage("Generating reply...");
    try {
      const response = await sendChatMessage(userMessage, selectedLanguage);
      const cleanedReply = cleanMarkdown(response.reply);
      addMessage(cleanedReply, false, response.language);
    } catch (error) {
      addMessage("Sorry, I couldn't process your request. Please try again.", false);
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Please grant microphone permission to use voice features.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      setIsLoading(true);
      setLoadingMessage("Transcribing audio...");
      try {
        const response = await speechToText(uri);
        // Populate the text input with recognized text. Do not send automatically.
        if (response.text.trim()) {
          setInputText(response.text.trim());
        }
      } catch (error) {
        addMessage("Sorry, I couldn't understand your voice message.", false);
      } finally {
        setIsLoading(false);
        setLoadingMessage(null);
      }
    }
  };

  const playResponse = async (text: string, language: string) => {
    try {
      if (isTTSLoading || isPlaying) return;
      setIsTTSLoading(true);
      setLoadingMessage("Preparing audio...");
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // Clean the text for TTS (remove any remaining markdown)
      const cleanText = cleanMarkdown(text);
      
      const audioUrl = await textToSpeech(cleanText, language);
      
      // Validate the audio URL
      if (!audioUrl || typeof audioUrl !== 'string') {
        throw new Error("Invalid audio URL received from server");
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      
      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            newSound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
          } else if (status.isPlaying) {
            setIsPlaying(true);
          }
        }
      });
      
      setIsTTSLoading(false);
      setLoadingMessage(null);
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback error:", error);
      Alert.alert("Error", `Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsTTSLoading(false);
      setIsPlaying(false);
      setLoadingMessage(null);
    }
  };

  const stopPlayback = async () => {
    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      }
    } catch {}
    setSound(null);
    setIsPlaying(false);
  };

  const renderMessage = (message: Message) => (
    <Animated.View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.botMessage,
        { opacity: fadeAnim },
      ]}
    >
      <View style={[styles.messageBubble, message.isUser ? styles.userBubble : styles.botBubble]}>
        <AppText
          style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.botText,
          ]}
        >
          {message.text}
        </AppText>
         <View style={styles.messageFooter}>
           <AppText style={styles.timestamp}>
             {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </AppText>
           {!message.isUser && (
             isPlaying ? (
               <TouchableOpacity
                 style={styles.playButton}
                 onPress={stopPlayback}
               >
                 <AppText style={styles.playButtonText}>⏹️</AppText>
               </TouchableOpacity>
             ) : (
               <TouchableOpacity
                 style={styles.playButton}
                 onPress={() => playResponse(message.text, message.language)}
                 disabled={isTTSLoading}
               >
                 <AppText style={styles.playButtonText}>{isTTSLoading ? "⏳" : "🔊"}</AppText>
               </TouchableOpacity>
             )
           )}
         </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText weight="bold" sizeClassName="text-xl" style={{ color: "#fff" }}>
            Farming Assistant
          </AppText>
          <View style={styles.languageSelector}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={setSelectedLanguage}
              style={styles.picker}
              dropdownIconColor="#0f3d00"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <Picker.Item
                  key={lang.code}
                  label={`${lang.flag} ${lang.name}`}
                  value={lang.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <View style={[styles.messageBubble, styles.botBubble]}>
                {loadingMessage ? (
                  <AppText style={[styles.messageText, styles.botText]}>{loadingMessage}</AppText>
                ) : (
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, styles.typingDotDelay1]} />
                    <View style={[styles.typingDot, styles.typingDotDelay2]} />
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about farming, crops, weather..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
            />
             <TouchableOpacity
               style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
               onPress={isRecording ? stopRecording : startRecording}
             >
               <AppText style={styles.voiceButtonText}>
                 {isRecording ? "⏹️" : "🎤"}
               </AppText>
             </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <AppText style={styles.sendButtonText}>📤</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: LIME,
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  languageSelector: {
    marginTop: 12,
    backgroundColor: "#f7ffe9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b8ff57",
    overflow: "hidden",
    minWidth: 200,
  },
  picker: {
    color: "#0f3d00",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  botMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userBubble: {
    backgroundColor: LIME,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#0f3d00",
  },
  botText: {
    color: "#1f2937",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#6b7280",
  },
  playButton: {
    padding: 4,
    marginLeft: 8,
  },
  playButtonText: {
    fontSize: 16,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LIME,
    marginHorizontal: 2,
  },
   typingDotDelay1: {
     // Animation delay handled by Animated API
   },
   typingDotDelay2: {
     // Animation delay handled by Animated API
   },
  inputContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f9fa",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    maxHeight: 100,
    paddingVertical: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIME,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  voiceButtonRecording: {
    backgroundColor: "#ef4444",
  },
  voiceButtonText: {
    fontSize: 18,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIME,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  sendButtonText: {
    fontSize: 18,
  },
});
