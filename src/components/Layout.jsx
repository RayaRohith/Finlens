import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'

function Layout({ currentPage, setCurrentPage, children }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [currentPage])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ marginLeft: '224px', flex: 1, padding: '32px' }}>
        <div className={visible ? 'animate-fadein-up' : 'opacity-0'}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout