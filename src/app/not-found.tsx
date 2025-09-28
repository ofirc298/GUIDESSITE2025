import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--gray-50)'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: 'var(--gray-900)',
          marginBottom: '1rem'
        }}>
          404 - העמוד לא נמצא
        </h1>
        <p style={{ 
          color: 'var(--gray-600)', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          העמוד שחיפשת לא קיים או הועבר למקום אחר.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            href="/" 
            className="btn btn-primary"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <Home size={16} />
            חזור לעמוד הבית
          </Link>
          <Link 
            href="/courses" 
            className="btn btn-outline"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <Search size={16} />
            עיין בקורסים
          </Link>
        </div>
      </div>
    </div>
  )
}