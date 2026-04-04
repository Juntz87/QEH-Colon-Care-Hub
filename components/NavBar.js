'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sun, Moon, LogIn, LogOut, Shield } from 'lucide-react'
import { auth, provider } from '../lib/firebaseClient'
import { signInWithPopup, signOut } from 'firebase/auth'
import useAuthRole from '../hooks/useAuthRole'

export default function NavBar() {
  const [theme, setTheme] = useState('light')
  const { user, role } = useAuthRole()

  // 🌗 Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('qeh_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const init = saved || (prefersDark ? 'dark' : 'light')
    setTheme(init)
    document.documentElement.classList.toggle('dark', init === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('qeh_theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      console.error('Login failed:', e)
      alert('Login failed — check console for details.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.error('Logout failed:', e)
      alert('Logout failed — check console for details.')
    }
  }

  // 🔐 Who can see the Admin button?
  const hasAdminAccess = ['master', 'officer', 'admin'].includes(role)
  const adminHref = role === 'officer' ? '/admin/clinic-updates' : '/admin'

  return (
    <header className="bg-gradient-to-r from-qehNavy to-qehBlue text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="font-semibold text-lg">Colon Care Hub</span>
          </Link>

          {/* Navigation links */}
          {role === 'master' && (
            <Link href="/design"><span className="hover:underline text-sm opacity-70">Design</span></Link>
          )}
          <nav className="hidden md:flex gap-4 ml-6 items-center">
            {/* ✅ Officers Resources visible for Master + Officer */}
            {['master', 'officer'].includes(role) && (
              <Link href="/officers-resources">
                <span className="hover:underline">Officers Resources</span>
              </Link>
            )}

            <Link href="/patients"><span className="hover:underline">Patient Education</span></Link>
            <Link href="/counselling"><span className="hover:underline">Counselling</span></Link>
            <Link href="/support"><span className="hover:underline">Support</span></Link>
            <Link href="/contact"><span className="hover:underline">Contact</span></Link>
            <Link href="/team"><span className="hover:underline">Meet Our Team</span></Link>
            <Link href="/clinic-updates"><span className="hover:underline">Clinic Updates</span></Link>
          {['master', 'officer'].includes(role) && (
  <Link href="/admin/audit-study-a">
    <span className="hover:underline">Audit Studies</span>
  </Link>
)}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* 🔸 Admin button (role-based link) */}
          {user && hasAdminAccess && (
            <Link href={adminHref} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition">
              <Shield size={16} />
              Admin
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md hover:bg-white/10 transition"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Sign In / Out */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition"
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
