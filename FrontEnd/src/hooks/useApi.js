import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API calls with loading and error states
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute an API call with automatic loading and error handling
   * @param {Function} apiCall - The API function to execute
   * @returns {Object} - { data, error }
   */
  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();

      if (response.success) {
        return { data: response.data, error: null };
      } else {
        setError(response.message);
        return { data: null, error: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
}

/**
 * Custom hook for handling paginated API calls
 */
export function usePaginatedApi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  /**
   * Fetch paginated data
   * @param {Function} apiCall - API function that returns paginated response
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  const fetchPage = useCallback(async (apiCall, page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(page, pageSize);

      if (response.success) {
        const paginatedData = response.data;
        setData(paginatedData.items);
        setPagination({
          pageNumber: paginatedData.pageNumber,
          pageSize: paginatedData.pageSize,
          totalItems: paginatedData.totalItems,
          totalPages: paginatedData.totalPages,
          hasNext: paginatedData.hasNext,
          hasPrevious: paginatedData.hasPrevious,
        });
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch data';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear data and reset pagination
   */
  const reset = useCallback(() => {
    setData([]);
    setPagination({
      pageNumber: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    fetchPage,
    reset,
  };
}

export default useApi;