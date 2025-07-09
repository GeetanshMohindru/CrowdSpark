import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io as socketIO } from 'socket.io-client'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Discovery from './pages/Discovery.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Notifications from './pages/Notifications.jsx'
import { Sidebar } from './components/ui/sidebar'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/card'
import { Toast } from './components/ui/toast'
import Landing from './pages/Landing.jsx'
import { Topbar } from './components/ui/topbar'

function App() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    deadline: '',
    owner: '', // Placeholder for now
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [fetchError, setFetchError] = useState('')
  const socketRef = useRef(null)
  const [paymentMsg, setPaymentMsg] = useState('')
  const [toast, setToast] = useState(null)
  const [contribs, setContribs] = useState({})
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [descriptionValidation, setDescriptionValidation] = useState(null)
  const [showDescriptionPrompt, setShowDescriptionPrompt] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    
    // Validate description in real-time
    if (e.target.name === 'description') {
      validateDescription(e.target.value)
    }
  }

  const validateDescription = async (description) => {
    try {
      const res = await axios.post('/api/campaigns/validate-description', { description })
      setDescriptionValidation(res.data)
    } catch (err) {
      console.error('Description validation error:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // Check if description is valid before submitting
    if (!form.description || form.description.trim().length < 50) {
      setShowDescriptionPrompt(true)
      setLoading(false)
      return
    }
    
    try {
      const res = await axios.post('/api/campaigns', {
        ...form,
        goal: Number(form.goal),
      })
      setToast('Campaign created successfully!')
      setForm({ title: '', description: '', goal: '', deadline: '', owner: '' })
      setDescriptionValidation(null)
      setShowDescriptionPrompt(false)
      fetchCampaigns() // Refresh campaigns list
    } catch (err) {
      if (err.response?.data?.requiresDescription) {
        setShowDescriptionPrompt(true)
      }
      setToast(err.response?.data?.error || 'Error creating campaign')
    } finally {
      setLoading(false)
    }
  }

  const handleContribute = async (id, amount) => {
    if (!amount || amount <= 0) return;
    try {
      await axios.post(`/api/campaigns/${id}/contribute`, { 
        amount: Number(amount),
        contributorId: form.owner, // Using owner as contributor for demo
        contributorName: 'Demo User'
      });
      setToast('Contribution successful!');
      fetchCampaigns(); // Refresh to show updated funds
    } catch (err) {
      setToast('Contribution failed');
    }
  };

  const handleStripePayment = async (id, amount) => {
    setPaymentMsg('')
    try {
      const res = await axios.post(`/api/campaigns/${id}/stripe-intent`, { amount: Number(amount) })
      setPaymentMsg(`Stripe client secret: ${res.data.clientSecret}`)
    } catch (err) {
      setPaymentMsg('Stripe payment failed')
    }
  }

  const handleRazorpayPayment = async (id, amount) => {
    setPaymentMsg('')
    try {
      const res = await axios.post(`/api/campaigns/${id}/razorpay-order`, { amount: Number(amount) })
      setPaymentMsg(`Razorpay order id: ${res.data.id}`)
    } catch (err) {
      setPaymentMsg('Razorpay payment failed')
    }
  }

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('/api/campaigns')
      setCampaigns(res.data)
    } catch (err) {
      setFetchError('Failed to load campaigns')
    }
  }

  const fetchNotifications = async () => {
    if (form.owner) {
      try {
        const res = await axios.get(`/api/notifications/${form.owner}`)
        setNotifications(res.data)
        setUnreadCount(res.data.filter(n => !n.read).length)
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      }
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [form.owner])

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socketIO()
      
      // Join user room for targeted notifications
      if (form.owner) {
        socketRef.current.emit('join', form.owner)
      }
      
      // Listen for real-time updates
      socketRef.current.on('campaignFunded', ({ campaignId, fundsRaised, amount, contributorName }) => {
        setCampaigns(prev => prev.map(c => c._id === campaignId ? { ...c, fundsRaised } : c))
        setToast(`${contributorName} contributed ₹${amount}!`)
      })
      
      socketRef.current.on('campaignComment', ({ campaignId, comment }) => {
        setToast(`New comment on campaign: "${comment.comment.substring(0, 50)}..."`)
      })
      
      socketRef.current.on('campaignApproved', ({ title }) => {
        setToast(`Campaign "${title}" has been approved!`)
        fetchCampaigns()
      })
      
      socketRef.current.on('campaignRejected', ({ title, reason }) => {
        setToast(`Campaign "${title}" was rejected: ${reason}`)
        fetchCampaigns()
      })
      
      socketRef.current.on('campaignCompleted', ({ campaignId, title }) => {
        setToast(`🎉 Campaign "${title}" has reached its funding goal!`)
        fetchCampaigns()
      })
      
      socketRef.current.on('allCampaignsCompleted', ({ message }) => {
        setToast(message)
      })
      
      socketRef.current.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        setToast(notification.message)
      })
      
      socketRef.current.on('broadcast', ({ message }) => {
        setToast(message)
      })
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [form.owner])

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar unreadCount={unreadCount} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
          
          {/* Description Prompt Modal */}
          {showDescriptionPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-lg mx-4">
                <CardHeader>
                  <CardTitle className="text-red-600">Description Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Please provide a detailed description (minimum 50 characters) to help potential backers understand your campaign better.
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Your description should include:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>What your campaign is about</li>
                      <li>How the funds will be used</li>
                      <li>Your story and motivation</li>
                      <li>Any rewards or benefits for backers</li>
                      <li>Timeline and milestones</li>
                    </ul>
                  </div>
                  <textarea
                    className="w-full px-3 py-2 border rounded mb-4"
                    name="description"
                    placeholder="Enter a detailed description..."
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                  />
                  {descriptionValidation && (
                    <div className={`text-sm mb-4 ${descriptionValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {descriptionValidation.message}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={() => setShowDescriptionPrompt(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (form.description.trim().length >= 50) {
                        setShowDescriptionPrompt(false)
                        handleSubmit({ preventDefault: () => {} })
                      }
                    }}
                    disabled={!descriptionValidation?.valid}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/notifications" element={<Notifications notifications={notifications} />} />
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={
              <div className="flex flex-col items-center justify-center">
                <Card className="w-full max-w-md mb-8">
                  <CardHeader>
                    <CardTitle>Create a Campaign</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        className="w-full px-3 py-2 border rounded"
                        name="title"
                        placeholder="Campaign Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                      <div>
                        <textarea
                          className="w-full px-3 py-2 border rounded"
                          name="description"
                          placeholder="Detailed Description (minimum 50 characters)"
                          value={form.description}
                          onChange={handleChange}
                          rows={4}
                          required
                        />
                        {descriptionValidation && (
                          <div className={`text-sm mt-1 ${descriptionValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                            {descriptionValidation.message}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {form.description.length}/50 characters minimum
                        </div>
                      </div>
                      <input
                        className="w-full px-3 py-2 border rounded"
                        name="goal"
                        type="number"
                        placeholder="Goal Amount (₹)"
                        value={form.goal}
                        onChange={handleChange}
                        required
                      />
                      <input
                        className="w-full px-3 py-2 border rounded"
                        name="deadline"
                        type="date"
                        placeholder="Deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        required
                      />
                      <input
                        className="w-full px-3 py-2 border rounded"
                        name="owner"
                        placeholder="Owner ID (temp)"
                        value={form.owner}
                        onChange={handleChange}
                        required
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading || (descriptionValidation && !descriptionValidation.valid)}
                      >
                        {loading ? 'Creating...' : 'Create Campaign'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <div className="w-full max-w-2xl">
                  <h2 className="text-2xl font-semibold mb-4 text-primary">All Campaigns</h2>
                  {fetchError && <div className="text-red-600 mb-2">{fetchError}</div>}
                  <div className="space-y-4">
                    {Array.isArray(campaigns) && campaigns.map(c => (
                      <Card key={c._id} className="p-4">
                        <CardHeader>
                          <CardTitle className="text-lg">{c.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{c.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span>Goal: <span className="font-semibold text-blue-600">₹{c.goal}</span></span>
                            <span>Raised: <span className="font-semibold text-green-600">₹{c.fundsRaised}</span></span>
                            <span>Deadline: <span className="text-gray-700">{c.deadline ? new Date(c.deadline).toLocaleDateString() : ''}</span></span>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <input
                              type="number"
                              min="1"
                              className="border rounded px-2 py-1 w-24"
                              placeholder="Amount"
                              value={contribs[c._id] || ''}
                              onChange={e => setContribs({ ...contribs, [c._id]: e.target.value })}
                            />
                            <Button
                              onClick={() => {
                                handleContribute(c._id, contribs[c._id]);
                                setContribs({ ...contribs, [c._id]: '' });
                              }}
                              disabled={!contribs[c._id] || contribs[c._id] <= 0}
                              size="sm"
                            >
                              Fund
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App

