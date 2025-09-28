export default function LoadingCourses() {
  return (
    <div style={{ 
      minHeight: '50vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--gray-200)',
        borderTop: '3px solid var(--primary-600)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: 'var(--gray-600)' }}>טוען קורסים...</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}