'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ComparisonContextType {
    comparisonIds: string[];
    addToComparison: (id: string) => void;
    removeFromComparison: (id: string) => void;
    clearComparison: () => void;
    isInComparison: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: React.ReactNode }) => {
    const [comparisonIds, setComparisonIds] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('comparison_ids');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // Allow both UUIDs and numeric IDs as strings
                    const validIds = parsed
                        .map(id => String(id).trim())
                        .filter(id => id.length > 5); // UUIDs are long
                    setComparisonIds(validIds);
                }
            } catch (e) {
                console.error('Failed to load comparison IDs');
            }
        }
        setIsInitialized(true);
    }, []);

    // Simple Persistence
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('comparison_ids', JSON.stringify(comparisonIds));
        }
    }, [comparisonIds, isInitialized]);

    const addToComparison = (id: string) => {
        const strId = String(id).trim();
        if (!strId) return;

        setComparisonIds(prev => {
            if (prev.length >= 4) {
                alert('Maximum 4 vehicles allowed for comparison.');
                return prev;
            }
            if (prev.includes(strId)) return prev;
            return [...prev, strId];
        });
    };

    const removeFromComparison = (id: string) => {
        setComparisonIds(prev => prev.filter(cid => cid !== String(id).trim()));
    };

    const clearComparison = () => setComparisonIds([]);

    const isInComparison = (id: string) => comparisonIds.includes(String(id).trim());

    return (
        <ComparisonContext.Provider value={{ 
            comparisonIds, 
            addToComparison, 
            removeFromComparison, 
            clearComparison,
            isInComparison
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};
