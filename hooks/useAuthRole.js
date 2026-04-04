import { useEffect, useState } from 'react'
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'

function normalizeRole(claims) {
  const rawRole = claims?.role || claims?.Role || 'public'
  return String(rawRole).toLowerCase()
}

export default function useAuthRole() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('public')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null)
        setRole('public')
        setLoading(false)
        return
      }

      setUser(nextUser)

      try {
        const token = await getIdTokenResult(nextUser)
        setRole(normalizeRole(token.claims))
      } catch (error) {
        console.error('Unable to read auth claims:', error)
        setRole('public')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, role, loading }
}
