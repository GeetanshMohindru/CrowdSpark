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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await axios.post('/api/campaigns', {
        ...form,
        goal: Number(form.goal),
      })
      setToast('Campaign created!')
      setForm({ title: '', description: '', goal: '', deadline: '', owner: '' })
    } catch (err) {
      setToast(err.response?.data?.error || 'Error creating campaign')
    } finally {
      setLoading(false)
    }
  }

  const handleContribute = async (id, amount) => {
    if (!amount || amount <= 0) return;
    try {
      await axios.post(`/api/campaigns/${id}/contribute`, { amount: Number(amount) });
      setToast('Contribution successful!');
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

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/api/campaigns')
        setCampaigns(res.data)
      } catch (err) {
        setFetchError('Failed to load campaigns')
      }
    }
    fetchCampaigns()
  }, [message]) // refetch on new campaign

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socketIO()
      socketRef.current.on('funded', ({ campaignId, fundsRaised }) => {
        setCampaigns(prev => prev.map(c => c._id === campaignId ? { ...c, fundsRaised } : c))
      })
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/" element={<Landing />} />
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center">
                <Card className="w-full max-w-md mb-8">
                  <CardHeader>
                    <CardTitle>Create a Campaign</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                      <input
                        className="mb-4 w-full px-3 py-2 border rounded"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                      <textarea
                        className="mb-4 w-full px-3 py-2 border rounded"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                      />
                      <input
                        className="mb-4 w-full px-3 py-2 border rounded"
                        name="goal"
                        type="number"
                        placeholder="Goal Amount"
                        value={form.goal}
                        onChange={handleChange}
                        required
                      />
                      <input
                        className="mb-4 w-full px-3 py-2 border rounded"
                        name="deadline"
                        type="date"
                        placeholder="Deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        required
                      />
                      <input
                        className="mb-4 w-full px-3 py-2 border rounded"
                        name="owner"
                        placeholder="Owner ID (temp)"
                        value={form.owner}
                        onChange={handleChange}
                        required
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Campaign'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <div className="w-full max-w-2xl">
                  <h2 className="text-2xl font-semibold mb-4 text-primary">All Campaigns</h2>
                  {fetchError && <div className="text-error mb-2">{fetchError}</div>}
                  <ul>
                    {Array.isArray(campaigns) && campaigns.map(c => (
                      <li key={c._id} className="mb-4 p-4 bg-white rounded shadow">
                        <div className="font-bold text-lg text-primary">{c.title}</div>
                        <div className="text-muted mb-1">{c.description}</div>
                        <div className="flex flex-wrap gap-4 text-sm mt-2">
                          <span>Goal: <span className="text-accent font-semibold">₹{c.goal}</span></span>
                          <span>Raised: <span className="text-success font-semibold">₹{c.fundsRaised}</span></span>
                          <span>Deadline: <span className="text-dark">{c.deadline ? new Date(c.deadline).toLocaleDateString() : ''}</span></span>
                        </div>
                        <form
                          className="mt-2 flex gap-2"
                          onSubmit={e => {
                            e.preventDefault();
                            handleContribute(c._id, contribs[c._id]);
                            setContribs({ ...contribs, [c._id]: '' });
                          }}
                        >
                          <input
                            type="number"
                            min="1"
                            className="border rounded px-2 py-1 w-24"
                            placeholder="Amount"
                            value={contribs[c._id] || ''}
                            onChange={e => setContribs({ ...contribs, [c._id]: e.target.value })}
                            required
                          />
                          <button
                            type="submit"
                            className="bg-success text-white px-3 py-1 rounded hover:bg-success/80"
                          >
                            Fund
                          </button>
                          <button
                            type="button"
                            className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80"
                            onClick={() => handleStripePayment(c._id, contribs[c._id])}
                            disabled={!contribs[c._id] || contribs[c._id] <= 0}
                          >
                            Pay with Stripe
                          </button>
                          <button
                            type="button"
                            className="bg-accent text-white px-3 py-1 rounded hover:bg-accent/80"
                            onClick={() => handleRazorpayPayment(c._id, contribs[c._id])}
                            disabled={!contribs[c._id] || contribs[c._id] <= 0}
                          >
                            Pay with Razorpay
                          </button>
                        </form>
                        {paymentMsg && <div className="mt-2 text-xs text-accent">{paymentMsg}</div>}
                      </li>
                    ))}
                  </ul>
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
