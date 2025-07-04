'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function SearchableDropdown({ 
  lists, 
  selectedList, 
  onSelect, 
  placeholder = "Search and select a list...",
  loading = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLists, setFilteredLists] = useState(lists);
  const dropdownRef = useRef(null);

  // Filter lists based on search query
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setFilteredLists(lists);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = lists.filter(list => 
        list.name.toLowerCase().includes(query) ||
        list.type.toLowerCase().includes(query)
      );
      setFilteredLists(filtered);
    }
  }, [searchQuery, lists]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (list) => {
    onSelect(list);
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectedListData = lists.find(list => list.id === selectedList);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer bg-white text-gray-900"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            <span className="text-gray-500">Loading lists...</span>
          </div>
        ) : selectedListData ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{selectedListData.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({selectedListData.count} contacts)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {selectedListData.type}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{placeholder}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lists..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Lists */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLists.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No lists found matching your search.' : 'No lists available.'}
              </div>
            ) : (
              filteredLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => handleSelect(list)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedList === list.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{list.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {list.count} contacts • Created {new Date(list.created_at).toLocaleDateString('en-US', {
                          timeZone: 'UTC',
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {list.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 