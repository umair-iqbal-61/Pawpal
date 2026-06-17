import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
            <p className="text-4xl mb-4">🐾</p>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Don't worry, your pet data is safe. Try refreshing the page.
            </p>
            {this.state.error && (
              <p className="text-xs text-gray-300 dark:text-gray-700 font-mono mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-left break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">
                Go to dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}