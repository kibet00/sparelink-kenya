import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import api from '../../utils/api'

export default function SupplierMessages() {
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const navigate = useNavigate()

  useEffect(() => {
    fetchInbox()
  }, [])

  useEffect(() => {
    if (selectedUser) fetchThread(selectedUser.id)
  }, [selectedUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchInbox = async () => {
    try {
      const response = await api.get('/messages/inbox/')
      setConversations(response.data)
    } catch (err) {
      console.error('Failed to fetch inbox', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchThread = async (userId) => {
    try {
      const response = await api.get(`/messages/thread/${userId}/`)
      setMessages(response.data)
    } catch (err) {
      console.error('Failed to fetch thread', err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    try {
      await api.post('/messages/send/', {
        receiver: selectedUser.id,
        content: newMessage,
      })
      setNewMessage('')
      fetchThread(selectedUser.id)
    } catch (err) {
      console.error('Failed to send message', err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/supplier/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Messages</h1>
      </div>

      <div style={styles.chatLayout}>
        <div style={styles.inbox}>
          <h3 style={styles.inboxTitle}>Conversations</h3>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : conversations.length === 0 ? (
            <p style={styles.empty}>No conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                style={{
                  ...styles.convItem,
                  background: selectedUser?.id === conv.id ? '#e0f2fe' : 'white',
                }}
                onClick={() => setSelectedUser(conv)}
              >
                <div style={styles.convAvatar}>
                  {conv.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={styles.convName}>{conv.full_name}</p>
                  <p style={styles.convRole}>{conv.role}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.chatWindow}>
          {!selectedUser ? (
            <div style={styles.noChat}>
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              <div style={styles.chatHeader}>
                <div style={styles.convAvatar}>
                  {selectedUser.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={styles.chatName}>{selectedUser.full_name}</p>
                  <p style={styles.chatRole}>{selectedUser.role}</p>
                </div>
              </div>

              <div style={styles.messages}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.message,
                      alignSelf: msg.sender === currentUser.id ? 'flex-end' : 'flex-start',
                      background: msg.sender === currentUser.id ? '#1a1a2e' : '#f0f0f0',
                      color: msg.sender === currentUser.id ? 'white' : '#333',
                    }}
                  >
                    <p>{msg.content}</p>
                    <span style={styles.msgTime}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} style={styles.inputArea}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.messageInput}
                />
                <button type="submit" style={styles.sendBtn}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  chatLayout: { display: 'flex', gap: '1.5rem', height: '70vh' },
  inbox: { width: '280px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  inboxTitle: { padding: '1rem', borderBottom: '1px solid #f0f0f0', color: '#1a1a2e' },
  empty: { padding: '1rem', color: '#999', textAlign: 'center' },
  convItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' },
  convAvatar: { width: '40px', height: '40px', background: '#1a1a2e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
  convName: { fontWeight: '600', color: '#1a1a2e', fontSize: '0.9rem' },
  convRole: { color: '#999', fontSize: '0.75rem', textTransform: 'capitalize' },
  chatWindow: { flex: 1, background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  noChat: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' },
  chatHeader: { padding: '1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  chatName: { fontWeight: '600', color: '#1a1a2e' },
  chatRole: { color: '#999', fontSize: '0.75rem', textTransform: 'capitalize' },
  messages: { flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  message: { maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: '12px' },
  msgTime: { fontSize: '0.7rem', opacity: 0.7, display: 'block', marginTop: '0.25rem' },
  inputArea: { padding: '1rem', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '0.75rem' },
  messageInput: { flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' },
  sendBtn: { padding: '0.75rem 1rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
}