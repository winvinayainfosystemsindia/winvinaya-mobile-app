/**
 * useActivityData Hook
 * 
 * Custom hook for fetching activity logs based on user role with pagination support.
 * - Admin users: Fetches all activity logs
 * - Regular users: Fetches only their own activity logs
 * 
 * @module useActivityData
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useAppSelector } from '../store/hooks';

interface UseActivityDataOptions {
    limit?: number;
    autoRefreshMs?: number | null;
    fetchOnMount?: boolean;
    initialPage?: number;
}

export const useActivityData = (options: UseActivityDataOptions = {}) => {
    const {
        limit = 10,
        autoRefreshMs = null,
        fetchOnMount = true,
        initialPage = 1,
    } = options;

    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Mock states for now as slices are removed
    const [logs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error] = useState<string | null>(null);
    const [pagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(limit);

    const isAdmin = useCallback(() => {
        if (!user) return false;
        return user.role === 'admin';
    }, [user]);

    const fetchData = useCallback(async (page: number = currentPage, size: number = pageSize) => {
        if (!isAuthenticated) return;
        // Mocking fetch logic
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
        console.log(`Mock fetch activity logs for page ${page} with size ${size}`);
    }, [isAuthenticated, currentPage, pageSize]);

    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        fetchData(page, pageSize);
    }, [fetchData, pageSize]);

    const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newPageSize = parseInt(event.target.value, 10);
        setPageSize(newPageSize);
        setCurrentPage(1);
        fetchData(1, newPageSize);
    }, [fetchData]);

    const refresh = useCallback(() => {
        fetchData(currentPage, pageSize);
    }, [fetchData, currentPage, pageSize]);

    useEffect(() => {
        if (fetchOnMount && isAuthenticated) {
            fetchData(currentPage, pageSize);
        }
    }, [fetchOnMount, isAuthenticated, fetchData, currentPage, pageSize]);

    useEffect(() => {
        if (autoRefreshMs && autoRefreshMs > 0 && isAuthenticated) {
            const intervalId = setInterval(() => {
                fetchData(currentPage, pageSize);
            }, autoRefreshMs);

            return () => clearInterval(intervalId);
        }
    }, [autoRefreshMs, isAuthenticated, fetchData, currentPage, pageSize]);

    return {
        logs,
        loading,
        error,
        pagination,
        currentPage,
        pageSize,
        isAdmin: isAdmin(),
        refresh,
        isAuthenticated,
        handlePageChange,
        handlePageSizeChange,
    };
};

export default useActivityData;
