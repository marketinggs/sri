'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SearchableDropdown from './SearchableDropdown';
import { fetchLists } from '../lib/utils';
import { API_ENDPOINTS, API_CONFIG } from '../lib/endpoints';

export default function CustomerUpload() {
  const [listName, setListName] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(true);

  // Load lists function - moved to component level so it can be called from handleUpload
  const loadLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLists();
      setLists(data);
    } catch (err) {
      setError('Failed to load customer lists. Please try again.');
      console.error('Error loading lists:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch lists from API on component mount
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleListSelect = (list) => {
    setSelectedList(list.id);
    setListName(list.name);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const contacts = [];
    
    if (lines.length === 0) return contacts;
    
    // Check if first row contains headers or is data
    const firstRowColumns = lines[0].split(',').map(col => col.trim().toLowerCase().replace(/['"]/g, ''));
    const hasHeaders = firstRowColumns.some(col => 
      col.includes('email') || col.includes('mail') || 
      col.includes('name') || col.includes('company') || 
      col.includes('phone') || col.includes('mobile')
    );
    
    // If headers exist, find column indices
    let emailIndex = -1, nameIndex = -1, companyIndex = -1, phoneIndex = -1;
    let startRowIndex = 0;
    
    if (hasHeaders) {
      emailIndex = firstRowColumns.findIndex(h => h.includes('email') || h.includes('mail'));
      nameIndex = firstRowColumns.findIndex(h => h.includes('name'));
      companyIndex = firstRowColumns.findIndex(h => h.includes('company') || h.includes('organization'));
      phoneIndex = firstRowColumns.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('tel'));
      startRowIndex = 1; // Skip header row
    }
    
    // Process each data row
    for (let i = startRowIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const columns = line.split(',').map(col => col.trim().replace(/['"]/g, ''));
        
        // Find email - use header mapping if available, otherwise search all columns
        let email = '';
        if (hasHeaders && emailIndex >= 0 && columns[emailIndex]) {
          email = columns[emailIndex];
        } else {
          // Search all columns for email pattern
          email = columns.find(col => col && col.includes('@') && col.includes('.')) || '';
        }
        
        if (email && email.includes('@') && email.includes('.')) {
          const contact = {
            email: email,
            name: hasHeaders && nameIndex >= 0 ? (columns[nameIndex] || '') : 
                  (columns.find(col => col && !col.includes('@') && isNaN(col)) || ''),
            company: hasHeaders && companyIndex >= 0 ? (columns[companyIndex] || '') : '',
            phone: hasHeaders && phoneIndex >= 0 ? (columns[phoneIndex] || '') : 
                   (columns.find(col => col && /^\+?[\d\s\-\(\)]+$/.test(col)) || '')
          };
          contacts.push(contact);
        }
      }
    }
    
    return contacts;
  };

  const handleUpload = async () => {
    const finalListName = isCreatingNew ? listName.toLowerCase() : lists.find(l => l.id === selectedList)?.name;
    
    if (!finalListName || !selectedFile) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Read and parse CSV file
      const csvText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(selectedFile);
      });
      
      const contacts = parseCSV(csvText);
      
      if (contacts.length === 0) {
        throw new Error('No valid contacts found in the CSV file. Please ensure the first column contains email addresses.');
      }
      
      // Call the bulk upload API
      const response = await fetch(API_ENDPOINTS.BULK_ADD_TO_LIST, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          listName: finalListName,
          values: contacts
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Reset form
      setListName('');
      setSelectedList('');
      setSelectedFile(null);
      setIsCreatingNew(true);
      
      // Reload lists to show updated data
      await loadLists();
      
      alert(`Success! ${contacts.length} contacts ${isCreatingNew ? 'uploaded to new list' : 'added to existing list'} "${finalListName}"`);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const selectedListData = lists.find(l => l.id === selectedList);
  const canUpload = (isCreatingNew ? listName : selectedList) && selectedFile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Upload Customer List</h1>
        <p className="text-gray-600 mt-2">Create new customer lists or add customers to existing lists by uploading CSV files</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="space-y-8">
          
          {/* List Selection Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Action
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isCreatingNew}
                  onChange={() => {
                    setIsCreatingNew(true);
                    setSelectedList('');
                    setListName('');
                  }}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Create New List</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isCreatingNew}
                  onChange={() => {
                    setIsCreatingNew(false);
                    setListName('');
                  }}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Add to Existing List</span>
              </label>
            </div>
          </div>

          {/* List Name Input or Selection */}
          {isCreatingNew ? (
            <div>
              <label htmlFor="listName" className="block text-sm font-semibold text-gray-700 mb-3">
                New List Name
              </label>
              <input
                type="text"
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value.toLowerCase())}
                placeholder="Enter new list name (e.g., newsletter_subscribers)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                List name will be automatically converted to lowercase
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Existing List
              </label>
              <SearchableDropdown
                lists={lists}
                selectedList={selectedList}
                onSelect={handleListSelect}
                placeholder="Search and select an existing list..."
                loading={loading}
              />
              {selectedListData && (
                <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-sm font-medium text-primary-800">
                    📊 Adding customers to &ldquo;{selectedListData.name}&rdquo; (currently {selectedListData.count} contacts)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Customer Data File
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="space-y-6">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📄</span>
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Drop your CSV file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports CSV files with email addresses
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer font-semibold"
                >
                  Browse Files
                </label>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleUpload}
              disabled={!canUpload || uploading}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                !canUpload || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
              }`}
            >
              {uploading ? 'Uploading...' : isCreatingNew ? 'Create List & Upload' : 'Add to List'}
            </button>
          </div>
        </div>
      </div>

      {/* Available Lists Summary */}
      {lists.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Lists Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{lists.length}</div>
              <div className="text-blue-700">Total Lists</div>
            </div>
            <div className="text-center p-3 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {lists.reduce((sum, list) => sum + list.count, 0).toLocaleString()}
              </div>
              <div className="text-primary-700">Total Contacts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {lists.filter(list => list.count > 0).length}
              </div>
              <div className="text-purple-700">Active Lists</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">CSV Format Requirements</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Include a header row with column names (name, email, company, phone)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Email column is required - other columns are optional</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Flexible column order - parser automatically detects email column</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Example: name, email, company, phone OR email, name, company, phone</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Can handle any number of contacts (automatically batched)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Maximum file size: 10MB • Supported format: CSV (.csv)</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 