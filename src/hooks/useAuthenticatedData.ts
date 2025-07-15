import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface UseAuthenticatedDataOptions {
  enabled?: boolean
  requireAuth?: boolean
  requireAdmin?: boolean
  retryCount?: number
  retryDelay?: number
}

interface UseAuthenticatedDataReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useAuthenticatedData<T>(
  fetchFunction: () => Promise<T>,
  options: UseAuthenticatedDataOptions = {}
): UseAuthenticatedDataReturn<T> {
  const {
    enabled = true,
    requireAuth = true,
    requireAdmin = false,
    retryCount = 3,
    retryDelay = 1000,
  } = options

  const { user, profile, refreshProfile } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (retryAttempt = 0) => {
    if (!enabled) return

    // Check authentication requirements
    if (requireAuth && !user) {
      setError(new Error('Authentication required'))
      setLoading(false)
      return
    }

    if (requireAdmin && user) {
      // Use profile from context or fetch if not available
      let userProfile = profile
      if (!userProfile) {
        try {
          await refreshProfile()
          const { data: profileData } = await supabase
            .from('customers')
            .select('role')
            .eq('id', user.id)
            .single()
          userProfile = profileData
        } catch (err) {
          console.error('Error fetching user profile:', err)
        }
      }

      if (userProfile?.role !== 'admin') {
        setError(new Error('Admin access required'))
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)

      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      console.error('Error fetching data:', err)

      // Handle session-related errors
      if (err instanceof Error) {
        if (
          err.message.includes('JWT') ||
          err.message.includes('token') ||
          err.message.includes('session')
        ) {
          // Try to refresh the profile/session
          try {
            await refreshProfile()
            // Retry the fetch if we have retries left
            if (retryAttempt < retryCount) {
              setTimeout(() => {
                fetchData(retryAttempt + 1)
              }, retryDelay * Math.pow(2, retryAttempt))
              return
            }
          } catch (refreshError) {
            console.error('Profile refresh failed:', refreshError)
          }
        }
      }

      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [
    enabled,
    requireAuth,
    requireAdmin,
    user,
    profile,
    fetchFunction,
    refreshProfile,
    retryCount,
    retryDelay,
  ])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}