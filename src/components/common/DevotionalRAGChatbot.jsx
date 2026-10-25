import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Loader2, 
  Flame, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Share2, 
  Edit2, 
  Mic, 
  MicOff, 
  ArrowRight 
} from 'lucide-react';
import Link from '@/components/common/Link';

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    sender: 'bot',
    text: 'Pranam! I am Sadhna AI (साधना मित्र), your Vedic incense & ritual knowledge guide. How may I assist your spiritual practice today?',
    timestamp: 'Just now',
    topic: 'Vedic Devotional Guidance',
  },
];

const QUICK_QUESTIONS = [
  'Why bambooless agarbatti?',
  'How to ignite havan cups?',
  'Are ingredients 100% natural?',
  'Shipping policy & charges?',
  'How to change shipping address?',
];

export default function DevotionalRAGChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);

  // Copied & Speaking state tracking
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [statusNotice, setStatusNotice] = useState(null);

  // Voice Assistant Mode (Continuous Speech-to-Text)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const voiceFinalTranscriptRef = useRef('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      // Stop speech synthesis & voice recognition if closed
      stopSpeaking();
      stopListening();
    }
  }, [isOpen]);

  // Clear notice after 3s
  useEffect(() => {
    if (statusNotice) {
      const timer = setTimeout(() => setStatusNotice(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusNotice]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  // -------------------------------------------------------------
  // Voice Assistant Mode (Continuous speech-to-text)
  // -------------------------------------------------------------
  const toggleVoiceMode = () => {
    if (isListening) {
      stopListening();
      setStatusNotice('Voice listening stopped.');
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusNotice('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English & Hindi terms

      voiceFinalTranscriptRef.current = inputQuery;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusNotice('Voice Assistant Active: Speak now...');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = voiceFinalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += (finalTranscript ? ' ' : '') + event.results[i][0].transcript.trim();
            voiceFinalTranscriptRef.current = finalTranscript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combined = finalTranscript + (interimTranscript ? ' ' + interimTranscript : '');
        setInputQuery(combined);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setStatusNotice('Microphone access denied. Please allow microphone permission.');
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // If still supposed to be listening, auto-restart (handles browser silence timeouts)
        if (isListening && recognitionRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize voice recognition:', err);
      setStatusNotice('Could not start microphone. Please check permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // -------------------------------------------------------------
  // Text-To-Speech (Voice Speaking)
  // -------------------------------------------------------------
  const toggleSpeaking = (msgId, text) => {
    if (speakingId === msgId) {
      stopSpeaking();
    } else {
      speakMessage(msgId, text);
    }
  };

  const speakMessage = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      setStatusNotice('Voice synthesis is not supported on this device.');
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingId(msgId);

    // Clean text of markdown / symbols
    const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick Indian English / English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  // -------------------------------------------------------------
  // Chat Actions: Send, Copy, Edit, Regenerate, Download, Restart, Share
  // -------------------------------------------------------------
  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    // Stop voice listening while sending
    if (isListening) stopListening();

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    voiceFinalTranscriptRef.current = '';
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      if (!res.ok) throw new Error('Chatbot service unavailable');

      const data = await res.json();
      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer,
        topic: data.topic,
        recommendedProduct: data.recommendedProduct,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: `msg-error-${Date.now()}`,
        sender: 'bot',
        text: 'Apologies, devotee. We are having a momentary connection lull with the Vedic knowledge base. Please feel free to reach our temple care team at care@vedapavitra.com or WhatsApp.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setStatusNotice('Text copied to clipboard!');
  };

  const handleEditMessage = (text) => {
    setInputQuery(text);
    inputRef.current?.focus();
    setStatusNotice('Message loaded into input field for editing.');
  };

  const handleRegenerate = async (botMsgId) => {
    // Find index of this bot message
    const botIdx = messages.findIndex(m => m.id === botMsgId);
    if (botIdx <= 0) return;

    // The preceding user message
    let precedingUserQuery = '';
    for (let i = botIdx - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        precedingUserQuery = messages[i].text;
        break;
      }
    }

    if (!precedingUserQuery) return;

    setRegeneratingId(botMsgId);
    stopSpeaking();

    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: precedingUserQuery }),
      });

      if (!res.ok) throw new Error('Regeneration failed');
      const data = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: data.answer,
                topic: data.topic,
                recommendedProduct: data.recommendedProduct,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : msg
        )
      );
      setStatusNotice('Answer regenerated successfully!');
    } catch (err) {
      setStatusNotice('Failed to regenerate answer.');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleShareMessage = async (text) => {
    const shareContent = `✦ Vedic Guidance from VedaPavitra (Sadhna AI):\n\n"${text}"\n\nExplore pure bambooless incense at: https://vedapavitra.com`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VedaPavitra Devotional Guidance',
          text: shareContent,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareContent);
      setStatusNotice('Devotional quote copied to clipboard to share!');
    }
  };

  const handleDownloadChat = () => {
    const formattedTranscript = [
      '==================================================================',
      '        VEDAPAVITRA - SADHNA AI (साधना मित्र) DEVOTIONAL TRANSCRIPT',
      `        Exported On: ${new Date().toLocaleString()}`,
      '==================================================================\n',
      ...messages.map((m) => {
        const speaker = m.sender === 'user' ? '[Devotee]' : '[Sadhna AI]';
        return `${speaker} (${m.timestamp}):\n${m.text}\n`;
      }),
      '==================================================================',
      '        Har Har Mahadev | Om Namo Bhagavate Vasudevaya',
      '==================================================================',
    ].join('\n');

    const blob = new Blob([formattedTranscript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VedaPavitra_Sadhna_AI_Chat_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusNotice('Conversation transcript downloaded!');
  };

  const handleRestartChat = () => {
    stopSpeaking();
    stopListening();
    setMessages(INITIAL_MESSAGES);
    setInputQuery('');
    voiceFinalTranscriptRef.current = '';
    setStatusNotice('Chat conversation restarted.');
  };

  return (
    <div id="sadhna-rag-chatbot-root" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Main Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '0',
            width: 'clamp(320px, 94vw, 420px)',
            height: 'clamp(520px, 78vh, 640px)',
            backgroundColor: '#FFF',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(28, 25, 23, 0.28)',
            border: '1px solid #EAE3D6',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#1C1917',
              color: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #C8822A',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF0E4',
                  color: '#C8822A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  boxShadow: '0 0 10px rgba(200, 130, 42, 0.4)',
                }}
              >
                <Flame size={19} color="#C8822A" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.05rem', color: '#FAF7F2' }}>
                    Sadhna AI
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                  Online • Gandhashastra Assistant
                </div>
              </div>
            </div>

            {/* Header Action Buttons: Download, Restart, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Download Chat Button */}
              <button
                onClick={handleDownloadChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FAF7F2',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#292524')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                title="Download chat transcript (.txt)"
                aria-label="Download Chat"
              >
                <Download size={16} color="#FEF08A" />
              </button>

              {/* Restart Chat Button */}
              <button
                onClick={handleRestartChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FAF7F2',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#292524')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                title="Restart conversation"
                aria-label="Restart Conversation"
              >
                <RotateCcw size={16} color="#E7E5E4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FAF7F2',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close chat"
                aria-label="Close Chat"
              >
                <X size={18} color="#FAF7F2" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              padding: '9px 12px',
              backgroundColor: '#FAF7F2',
              borderBottom: '1px solid #EAE3D6',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
            }}
          >
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#FFF',
                  border: '1px solid #D6CEBE',
                  borderRadius: '14px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#5C5446',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#C8822A';
                  e.currentTarget.style.color = '#C8822A';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#D6CEBE';
                  e.currentTarget.style.color = '#5C5446';
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Status Toast Notice inside Chat */}
          {statusNotice && (
            <div
              style={{
                backgroundColor: '#1C1917',
                color: '#FEF08A',
                fontSize: '0.74rem',
                padding: '6px 14px',
                textAlign: 'center',
                borderBottom: '1px solid #C8822A',
                animation: 'fadeIn 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>{statusNotice}</span>
            </div>
          )}

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#FDFCF9',
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const isThisSpeaking = speakingId === m.id;
              const isThisRegenerating = regeneratingId === m.id;

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '92%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    position: 'relative',
                  }}
                >
                  {/* Topic badge if bot */}
                  {!isUser && m.topic && (
                    <span style={{ fontSize: '0.65rem', color: '#8C7E6C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px', paddingLeft: '4px' }}>
                      {m.topic}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    style={{
                      padding: '12px 15px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: isUser ? '#1C1917' : '#F4EEE1',
                      color: isUser ? '#FAF7F2' : '#2D2821',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      border: isUser ? 'none' : isThisSpeaking ? '1.5px solid #C8822A' : '1px solid #E5D9C3',
                      transition: 'border 0.2s',
                    }}
                  >
                    {isThisRegenerating ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#786E5F', fontStyle: 'italic' }}>
                        <RotateCw size={13} className="animate-spin" />
                        <span>Regenerating sacred answer...</span>
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>

                  {/* Recommended Product Card */}
                  {!isUser && m.recommendedProduct && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '10px 12px',
                        backgroundColor: '#FFF',
                        border: '1px solid #C8822A',
                        borderRadius: '10px',
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(200, 130, 42, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.68rem', backgroundColor: '#FAF0E4', color: '#C8822A', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {m.recommendedProduct.tag || 'Recommended'}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1C1917' }}>
                          {m.recommendedProduct.price}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                        {m.recommendedProduct.title}
                      </div>
                      <Link
                        href={m.recommendedProduct.link}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: '#C8822A',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <span>View Sacred Offering</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}

                  {/* ACTION BUTTONS TOOLBAR */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px',
                      padding: '0 4px',
                      fontSize: '0.7rem',
                      color: '#8C8277',
                    }}
                  >
                    <span>{m.timestamp}</span>

                    {/* USER MESSAGE ACTIONS: Copy & Edit */}
                    {isUser && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyText(m.id, m.text)}
                          title="Copy question"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: copiedId === m.id ? '#16A34A' : '#78716C',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                        </button>

                        {/* Edit button */}
                        <button
                          onClick={() => handleEditMessage(m.text)}
                          title="Edit question in input field"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#78716C',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}

                    {/* BOT RESPONSE ACTIONS: Copy, Regenerate, Voice Speaking, Share */}
                    {!isUser && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                        {/* Copy response */}
                        <button
                          onClick={() => handleCopyText(m.id, m.text)}
                          title="Copy answer"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: copiedId === m.id ? '#16A34A' : '#78716C',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                        </button>

                        {/* Regenerate response */}
                        <button
                          onClick={() => handleRegenerate(m.id)}
                          title="Regenerate answer"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#78716C',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <RotateCw size={12} />
                        </button>

                        {/* Voice speaking (TTS) */}
                        <button
                          onClick={() => toggleSpeaking(m.id, m.text)}
                          title={isThisSpeaking ? 'Stop voice speaking' : 'Listen to answer (Voice Speaking)'}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isThisSpeaking ? '#C8822A' : '#78716C',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {isThisSpeaking ? <VolumeX size={13} color="#C8822A" /> : <Volume2 size={13} />}
                        </button>

                        {/* Share response */}
                        <button
                          onClick={() => handleShareMessage(m.text)}
                          title="Share answer"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#78716C',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Share2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: '#F4EEE1',
                  borderRadius: '14px 14px 14px 2px',
                  width: 'fit-content',
                  fontSize: '0.78rem',
                  color: '#786E5F',
                  fontStyle: 'italic',
                }}
              >
                <Loader2 size={14} color="#C8822A" className="animate-spin" />
                <span>Consulting Gandhashastra corpus...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box with Voice Assistant Mode */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            style={{
              padding: '10px 14px',
              backgroundColor: '#FFF',
              borderTop: '1px solid #EAE3D6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* Voice Assistant Mic Button - Works on click and continues until clicked again */}
            <button
              type="button"
              onClick={toggleVoiceMode}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: isListening ? '2px solid #DC2626' : '1px solid #D6CEBE',
                backgroundColor: isListening ? '#FEE2E2' : '#FAF7F2',
                color: isListening ? '#DC2626' : '#6B635B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                position: 'relative',
                transition: 'all 0.2s',
                boxShadow: isListening ? '0 0 10px rgba(220, 38, 38, 0.4)' : 'none',
              }}
              title={isListening ? 'Voice Assistant Active (Click to stop)' : 'Click to start Voice Assistant'}
              aria-label="Voice Assistant Microphone"
            >
              {isListening ? (
                <>
                  <MicOff size={17} color="#DC2626" />
                  <span
                    style={{
                      position: 'absolute',
                      inset: '-3px',
                      borderRadius: '50%',
                      border: '2px solid rgba(220, 38, 38, 0.6)',
                      animation: 'pingRing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              ) : (
                <Mic size={17} />
              )}
            </button>

            {/* Query Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? 'Listening continuously... Speak now' : 'Ask about rituals, ingredients, orders...'}
              style={{
                flex: 1,
                border: isListening ? '1.5px solid #DC2626' : '1px solid #D6CEBE',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '0.8125rem',
                outline: 'none',
                backgroundColor: isListening ? '#FFF5F5' : '#FAF7F2',
                color: '#1C1917',
                transition: 'border 0.2s',
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              style={{
                backgroundColor: inputQuery.trim() ? '#C8822A' : '#D6CEBE',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 12px',
                cursor: inputQuery.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
              aria-label="Send Message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button (Clean, no hovering banner or permanent tooltip) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#1C1917',
          color: '#FAF7F2',
          border: '2px solid #C8822A',
          boxShadow: '0 8px 24px rgba(28, 25, 23, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        aria-label="Toggle Sadhna AI Devotional Assistant"
      >
        {isOpen ? (
          <X size={24} color="#FEF08A" />
        ) : (
          <>
            <Flame size={24} color="#E09C48" />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                border: '2px solid #1C1917',
              }}
            />
          </>
        )}
      </button>
    </div>
  );
}
