import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Box, IconButton, Typography, TextField, Fade, Badge, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import './ChatWidget.css';

interface Message {
  _id?: string;
  roomId?: string;
  content: string;
  senderType: 'USER' | 'ADMIN' | 'AI';
  senderNick: string;
  createdAt: Date;
  seen?: boolean;
  seenAt?: Date;
}

interface ChatRoom {
  _id: string;
  status: string;
}

interface AdminStatus {
  isOnline: boolean;
  adminCount: number;
  lastSeen: Date;
}

type ChatMode = null | 'admin' | 'ai';

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
};

const formatMessageTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const WIDGET_NAME = 'BrewChat';
const STORAGE_KEY = 'brewchat_session_interacted';

const ChatWidget: React.FC = () => {
  const { authMember } = useGlobals();
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({ isOnline: false, adminCount: 0, lastSeen: new Date() });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const prevAuthMemberRef = useRef<typeof authMember>(null);

  // Close widget on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset unread count when opening and mark as interacted
  useEffect(() => {
    // Keep ref in sync with state for socket callbacks
    isOpenRef.current = isOpen;
    
    if (isOpen) {
      setUnreadCount(0);
      if (!hasInteracted && authMember) {
        setHasInteracted(true);
        setShouldAnimate(false);
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }
    }
  }, [isOpen, hasInteracted, authMember]);

  // Trigger animation on login/signup - detects when user logs in
  useEffect(() => {
    const wasLoggedOut = prevAuthMemberRef.current === null;
    const isNowLoggedIn = authMember !== null;
    
    // Detect login event: transition from null to logged-in
    if (wasLoggedOut && isNowLoggedIn) {
      console.log('🎉 Login detected! Triggering BrewChat animation');
      // Clear any previous interaction state and trigger animation
      sessionStorage.removeItem(STORAGE_KEY);
      setShouldAnimate(true);
      setHasInteracted(false);
    }
    
    // User logged out - reset animation state
    if (!isNowLoggedIn) {
      setShouldAnimate(false);
      setHasInteracted(false);
      sessionStorage.removeItem(STORAGE_KEY);
    }
    
    // Update the ref to track the current value for next render
    prevAuthMemberRef.current = authMember;
  }, [authMember]);

  // Global socket for admin status
  useEffect(() => {
    const statusSocket = io(serverApi, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    statusSocket.on('admin:status', (status: AdminStatus) => {
      setAdminStatus(status);
    });

    return () => {
      statusSocket.disconnect();
    };
  }, []);

  // Initialize socket connection for chat - connect when user is logged in
  useEffect(() => {
    if (authMember) {
      const newSocket = io(serverApi, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        // Automatically join user's room when connected
        newSocket.emit('user:join', {
          memberId: authMember._id,
          memberNick: authMember.memberNick,
        });
      });

      newSocket.on('room:joined', (data: { room: ChatRoom }) => {
        setCurrentRoom(data.room);
      });

      newSocket.on('messages:history', (data: { messages: Message[] }) => {
        setMessages(data.messages);
        // Mark admin messages as seen by user
        const hasUnseenAdminMessages = data.messages.some(m => m.senderType === 'ADMIN' && !m.seen);
        if (hasUnseenAdminMessages) {
          newSocket.emit('message:mark-seen', { roomId: data.messages[0]?.roomId, viewerType: 'USER' });
        }
      });

      newSocket.on('message:receive', (data: { message: Message }) => {
        setMessages((prev) => [...prev, data.message]);
        // Use ref to get current isOpen state (avoids stale closure)
        if (!isOpenRef.current && data.message.senderType === 'ADMIN') {
          setUnreadCount((prev) => prev + 1);
        }
        // If chat is open and admin sends message, mark it as seen immediately
        if (isOpenRef.current && data.message.senderType === 'ADMIN') {
          newSocket.emit('message:mark-seen', { roomId: data.message.roomId, viewerType: 'USER' });
        }
      });

      newSocket.on('room:closed', () => {
        setMessages([]);
        setCurrentRoom(null);
        setChatMode(null);
      });

      newSocket.on('admin:status', (status: AdminStatus) => {
        setAdminStatus(status);
      });

      // Listen for when admin reads our messages
      newSocket.on('messages:seen', (data: { roomId: string; seenBy: string; seenAt: Date }) => {
        if (data.seenBy === 'ADMIN') {
          setMessages((prev) => 
            prev.map((msg) => 
              msg.senderType === 'USER' && !msg.seen 
                ? { ...msg, seen: true, seenAt: new Date(data.seenAt) } 
                : msg
            )
          );
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [authMember]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const content = inputValue.trim();
    setInputValue('');

    if (chatMode === 'admin' && socket && currentRoom) {
      socket.emit('message:send', {
        roomId: currentRoom._id,
        senderId: authMember?._id,
        senderType: 'USER',
        senderNick: authMember?.memberNick || 'Guest',
        content,
      });
    } else if (chatMode === 'ai') {
      const userMessage: Message = {
        content,
        senderType: 'USER',
        senderNick: authMember?.memberNick || 'You',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const response = await fetch(`${serverApi}/chat/ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
        });

        const data = await response.json();

        const aiMessage: Message = {
          content: data.aiResponse,
          senderType: 'AI',
          senderNick: 'Coffee Bot',
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('AI chat error:', error);
        const errorMessage: Message = {
          content: 'Sorry, I\'m having trouble right now. Please try again!',
          senderType: 'AI',
          senderNick: 'Coffee Bot',
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    setChatMode(null);
    setMessages([]);
    // Don't disconnect socket - keep it alive for notifications
    // Socket will be cleaned up on component unmount
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEndChat = () => {
    if (socket && currentRoom) {
      if (window.confirm('Are you sure you want to end this chat?')) {
        socket.emit('room:close', { roomId: currentRoom._id });
        handleBack();
      }
    }
  };

  const selectChatMode = (mode: ChatMode) => {
    if (mode === 'admin' && !authMember) {
      alert('Please login to chat with our team!');
      return;
    }
    setChatMode(mode);
  };

  const getNotificationDisplay = () => {
    if (unreadCount === 0) return null;
    if (unreadCount > 10) return '10+';
    return unreadCount;
  };

  return (
    <Box className="chat-widget-container" ref={widgetRef}>
      {/* Attention Tooltip for first-time users */}
      {shouldAnimate && !isOpen && (
        <Fade in={shouldAnimate}>
          <Box className="attention-tooltip">
            <span>Say hi!</span>
            <div className="tooltip-arrow"></div>
          </Box>
        </Fade>
      )}

      {/* BrewChat Button */}
      <Fade in={!isOpen}>
        <Box
          className={`chat-widget-button coffee-cup ${shouldAnimate ? 'animate-bounce' : ''}`}
          onClick={() => setIsOpen(true)}
          sx={{ display: isOpen ? 'none' : 'flex' }}
        >
          <Badge 
            badgeContent={getNotificationDisplay()} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                fontWeight: 'bold',
                minWidth: '20px',
                height: '20px',
              }
            }}
          >
            <div className="coffee-icon">
              <div className="steam">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="cup"><img src="/img/chat-icon.svg" alt="Chat" className="chat-icon-img" /></div>
            </div>
          </Badge>
          <span className="widget-name">{WIDGET_NAME}</span>
        </Box>
      </Fade>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Box className="chat-widget-window" sx={{ display: isOpen ? 'flex' : 'none' }}>
          {/* Header */}
          <Box className="chat-widget-header">
            {chatMode && (
              <IconButton onClick={handleBack} size="small" sx={{ color: '#fff', mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                {chatMode === 'admin' ? 'Live Chat' : chatMode === 'ai' ? 'Coffee Bot' : WIDGET_NAME}
              </Typography>
              {chatMode === 'admin' && (
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {adminStatus.isOnline ? (
                    <span className="status-online">Agent Online</span>
                  ) : (
                    <span className="status-offline">Last seen {formatRelativeTime(adminStatus.lastSeen)}</span>
                  )}
                </Typography>
              )}
            </Box>
            {chatMode === 'admin' && currentRoom && (
              <IconButton onClick={handleEndChat} size="small" sx={{ color: '#ff6b6b', mr: 1 }} title="End Chat">
                <ExitToAppIcon />
              </IconButton>
            )}
            <IconButton onClick={handleClose} size="small" sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box className="chat-widget-content">
            {!chatMode ? (
              <Box className="chat-mode-selection">
                <Box className="welcome-coffee">
                  <img src="/img/coffee-cup.svg" alt="Coffee" className="welcome-icon" />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Welcome to {WIDGET_NAME}!
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                    How can we help you today?
                  </Typography>
                  <Typography variant="caption" sx={{ color: adminStatus.isOnline ? '#4caf50' : '#999' }}>
                    {adminStatus.isOnline ? `${adminStatus.adminCount} agent(s) online` : 'All agents offline'}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  className="chat-mode-btn admin-btn"
                  startIcon={<SupportAgentIcon />}
                  onClick={() => selectChatMode('admin')}
                  fullWidth
                >
                  Chat with Our Barista
                </Button>
                <Button
                  variant="contained"
                  className="chat-mode-btn ai-btn"
                  startIcon={<SmartToyIcon />}
                  onClick={() => selectChatMode('ai')}
                  fullWidth
                >
                  Ask Coffee Bot AI
                </Button>
              </Box>
            ) : (
              <Box className="chat-messages">
                {messages.length === 0 && (
                  <Box className="chat-welcome">
                    <Typography variant="body2" color="textSecondary">
                      {chatMode === 'admin'
                        ? 'Send a message to start chatting!'
                        : 'Ask me anything about coffee!'}
                    </Typography>
                  </Box>
                )}
                {messages.map((msg, index) => (
                  <Box
                    key={msg._id || index}
                    className={`chat-message ${msg.senderType === 'USER' ? 'user' : 'other'}`}
                  >
                    <Typography variant="caption" className="sender-name">
                      {msg.senderNick}
                    </Typography>
                    <Box className="message-bubble">
                      {msg.content}
                      <Box className="message-meta">
                        <span className="message-time">{formatMessageTime(msg.createdAt)}</span>
                        {msg.senderType === 'USER' && (
                          <span className="message-status">
                            {msg.seen ? (
                              <DoneAllIcon sx={{ fontSize: 14, color: '#4fc3f7' }} />
                            ) : (
                              <DoneIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                            )}
                          </span>
                        )}
                      </Box>
                    </Box>
                    {msg.seen && msg.seenAt && msg.senderType === 'USER' && (
                      <Typography variant="caption" className="seen-text">
                        Seen {formatRelativeTime(msg.seenAt)}
                      </Typography>
                    )}
                  </Box>
                ))}
                {isTyping && (
                  <Box className="chat-message other">
                    <Typography variant="caption" className="sender-name">
                      Coffee Bot
                    </Typography>
                    <Box className="message-bubble typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>
            )}
          </Box>

          {/* Input */}
          {chatMode && (
            <Box className="chat-widget-input">
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ 
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    backgroundColor: '#f5f5f5',
                  }
                }}
              />
              <IconButton 
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default ChatWidget;
