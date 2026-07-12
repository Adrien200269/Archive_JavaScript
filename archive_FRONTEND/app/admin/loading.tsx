import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminLoading() {
  return (
    <main className="page" style={{ justifyContent: 'center', minHeight: '100vh' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>
      <LoadingSpinner />
    </main>
  )
}
