'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import SearchableDropdown from './SearchableDropdown';
import { fetchLists } from '../lib/utils';
import { API_ENDPOINTS, API_CONFIG } from '../lib/endpoints';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List, 
  ListOrdered, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Quote,
  Code as CodeIcon,
  CheckCircle,
  XCircle,
  X,
  Clock,
  Send
} from 'lucide-react';

export default function EmailComposer() {
  const [selectedList, setSelectedList] = useState('');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Load customer lists on component mount
  useEffect(() => {
    async function loadLists() {
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
    }

    loadLists();
  }, []);

  // Handle list selection
  const handleListSelect = (list) => {
    setSelectedList(list.id);
  };

  // Show notification modal
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  // Hide notification modal
  const hideNotification = () => {
    setNotification({ show: false, type: '', message: '' });
  };

  // Get current date and time in IST for min values
  const getCurrentISTDateTime = () => {
    // Use Intl.DateTimeFormat to get reliable IST time
    const now = new Date();
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const parts = istFormatter.formatToParts(now);
    const date = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}`;
    const time = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}`;
    
    return { date, time };
  };

  // Convert IST to API format with timezone offset
  const convertISTToAPIFormat = (date, time) => {
    // Return in the format: "2025-07-04T16:28:00+05:30"
    return `${date}T${time}:00+05:30`;
  };

  // Get minimum time for time input (only for today's date)
  const getMinTimeForDate = (selectedDate) => {
    const currentIST = getCurrentISTDateTime();
    if (selectedDate === currentIST.date) {
      // Add 1 minute buffer for current date
      const currentTime = currentIST.time.split(':');
      const currentMinutes = parseInt(currentTime[0]) * 60 + parseInt(currentTime[1]) + 1;
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    return undefined;
  };

  // Show link modal
  const showLinkCreator = () => {
    const { from, to } = editor.state.selection;
    const selectedText = from !== to ? editor?.state.doc.textBetween(from, to, ' ') : '';
    
    setLinkText(selectedText.trim());
    setLinkUrl('');
    setShowLinkModal(true);
  };

  // Hide link modal
  const hideLinkModal = () => {
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Create link
  const createLink = () => {
    if (!linkUrl.trim() || !linkText.trim()) return;

    let url = linkUrl.trim();
    let text = linkText.trim();
    
    // Strip any HTML tags from the text to ensure clean links for email clients
    text = text.replace(/<[^>]*>/g, '');
    
    // Ensure URL has proper protocol
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
      url = 'https://' + url;
    }

    // Clean HTML for email clients - no nested formatting
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${text}</a>`;
    
    // Clear any selection and insert the link
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    
    if (hasSelection) {
      // Replace selected content completely
      editor?.commands.deleteSelection();
    }
    
    // Insert as raw HTML to avoid editor processing
    editor?.commands.insertContent(linkHtml);
    
    hideLinkModal();
  };

  // Inject custom CSS for Tiptap editor
  useEffect(() => {
    const styleId = 'tiptap-custom-styles';
    const existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .ProseMirror {
          outline: none !important;
          color: #374151 !important;
          line-height: 1.6 !important;
        }

        .ProseMirror h1 {
          font-size: 2.25rem !important;
          font-weight: 700 !important;
          margin: 1rem 0 !important;
          color: #111827 !important;
          line-height: 1.2 !important;
        }

        .ProseMirror h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          margin: 0.875rem 0 !important;
          color: #111827 !important;
          line-height: 1.3 !important;
        }

        .ProseMirror h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 !important;
          color: #111827 !important;
          line-height: 1.4 !important;
        }

        .ProseMirror p {
          margin: 0.5rem 0 !important;
          color: #374151 !important;
          line-height: 1.6 !important;
        }

        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 0.75rem 0 !important;
        }

        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.75rem 0 !important;
        }

        .ProseMirror li {
          margin: 0.25rem 0 !important;
          color: #374151 !important;
          line-height: 1.6 !important;
        }

        .ProseMirror li p {
          margin: 0 !important;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: #6b7280 !important;
        }

        .ProseMirror code {
          background-color: #f3f4f6 !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 0.875rem !important;
          color: #be123c !important;
        }

        .ProseMirror strong {
          font-weight: 700 !important;
        }

        .ProseMirror em {
          font-style: italic !important;
        }

        .ProseMirror u {
          text-decoration: underline !important;
        }

        .ProseMirror s {
          text-decoration: line-through !important;
        }

        .ProseMirror a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }

        .ProseMirror a:hover {
          color: #1d4ed8 !important;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // We'll configure this separately
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color: #3b82f6; text-decoration: underline;',
        },
        protocols: ['http', 'https', 'mailto'],
        validate: href => /^https?:\/\//.test(href) || /^mailto:/.test(href),
      }),
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Blockquote,
      Code,
    ],
    content: '<p>Write your email content here...</p>',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const handleSendEmails = async () => {
    const content = editor?.getHTML();
    if (!selectedList || !subject || !content) return;
    
    // If scheduling is enabled, validate date and time
    if (isScheduled) {
      if (!scheduleDate || !scheduleTime) {
        showNotification('error', 'Please select both date and time for scheduling');
        return;
      }
      
      // Create comparable timestamps in IST
      const currentIST = getCurrentISTDateTime();
      const currentTimestamp = new Date(`${currentIST.date}T${currentIST.time}:00+05:30`).getTime();
      const selectedTimestamp = new Date(`${scheduleDate}T${scheduleTime}:00+05:30`).getTime();
      
      // Add 1 minute buffer to avoid edge cases
      const oneMinute = 60 * 1000;
      
      if (selectedTimestamp <= (currentTimestamp + oneMinute)) {
        showNotification('error', 'Please select a future date and time (at least 1 minute from now)');
        return;
      }
    }
    
    const selectedListData = lists.find(l => l.id === selectedList);
    setSending(true);
    
    try {
      const payload = {
        listId: selectedList,
        subject: subject,
        campaign_data: content
      };
      
      // Add scheduling information if enabled
      if (isScheduled) {
        const scheduledAt = convertISTToAPIFormat(scheduleDate, scheduleTime);
        payload.scheduledAt = scheduledAt;
        payload.idempotencyKey = scheduledAt; // Use same timestamp as idempotency key
      }
      
      // Use different endpoint for scheduled campaigns
      const endpoint = isScheduled ? API_ENDPOINTS.SCHEDULE_CAMPAIGN : API_ENDPOINTS.SEND_CAMPAIGN;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      const successMessage = isScheduled 
        ? `Email campaign scheduled successfully for ${scheduleDate} at ${scheduleTime} IST to "${selectedListData?.name || 'selected list'}"!`
        : `Email campaign sent successfully to "${selectedListData?.name || 'selected list'}"!`;
      
      showNotification('success', successMessage);
      
      // Reset form
      setSelectedList('');
      setSubject('');
      setIsScheduled(false);
      setScheduleDate('');
      setScheduleTime('');
      editor?.commands.clearContent();
      
    } catch (error) {
      console.error('Error sending email campaign:', error);
      showNotification('error', `Failed to ${isScheduled ? 'schedule' : 'send'} email campaign: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleSendTest = async () => {
    const content = editor?.getHTML();
    if (!testEmail || !subject || !content) return;
    
    setSendingTest(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.SEND_TEST_EMAIL, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          email: testEmail,
          subject: `[TEST] ${subject}`,
          content: content
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showNotification('success', `Test email sent to ${testEmail}!`);
      setShowTestModal(false);
      setTestEmail('');
      
    } catch (error) {
      console.error('Error sending test email:', error);
      showNotification('error', `Failed to send test email: ${error.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const MenuButton = ({ onClick, disabled, children, title, isActive = false }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        disabled 
          ? 'text-gray-400 cursor-not-allowed' 
          : isActive
          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  // Get current heading level for dropdown
  const getCurrentHeadingLevel = () => {
    if (editor?.isActive('heading', { level: 1 })) return '1';
    if (editor?.isActive('heading', { level: 2 })) return '2';
    if (editor?.isActive('heading', { level: 3 })) return '3';
    return '0';
  };

  const hasContent = editor?.getText().trim().length > 0;
  const selectedListData = lists.find(l => l.id === selectedList);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Compose Email Campaign</h1>
        <p className="text-gray-600 mt-2">Create and send emails to your customer lists</p>
      </div>

      {/* Temporarily commented out - Error Alert */}

      {/* Email Composer */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="space-y-8">
          {/* Customer List Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Customer List
            </label>
            <SearchableDropdown
              lists={lists}
              selectedList={selectedList}
              onSelect={handleListSelect}
              placeholder="Search and select a customer list..."
              loading={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {selectedListData && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">
                  📊 This email will be sent to {selectedListData.count} customers
                </p>
              </div>
            )}
          </div>

          {/* Email Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
              Email Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject line..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
            />
          </div>

          {/* Email Content - Tiptap Editor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Content
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center gap-1 flex-wrap">
                  {/* Heading Controls */}
                  <div className="flex items-center gap-1 mr-3">
                    <select
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                      value={getCurrentHeadingLevel()}
                      onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                          editor?.chain().focus().clearNodes().setParagraph().run();
                        } else {
                          editor?.chain().focus().clearNodes().setHeading({ level }).run();
                        }
                      }}
                    >
                      <option value="0">Paragraph</option>
                      <option value="1">Heading 1</option>
                      <option value="2">Heading 2</option>
                      <option value="3">Heading 3</option>
                    </select>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-2" />

                  {/* Basic Formatting */}
                  <MenuButton
                    onClick={() => {
                      editor?.chain().focus().toggleBold().run();
                    }}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                    isActive={editor?.isActive('bold')}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => {
                      editor?.chain().focus().toggleItalic().run();
                    }}
                    disabled={!editor?.can().chain().focus().toggleItalic().run()}
                    isActive={editor?.isActive('italic')}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => {
                      editor?.chain().focus().toggleUnderline().run();
                    }}
                    disabled={!editor?.can().chain().focus().toggleUnderline().run()}
                    isActive={editor?.isActive('underline')}
                    title="Underline"
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => {
                      editor?.chain().focus().toggleStrike().run();
                    }}
                    disabled={!editor?.can().chain().focus().toggleStrike().run()}
                    isActive={editor?.isActive('strike')}
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => {
                      editor?.chain().focus().toggleCode().run();
                    }}
                    disabled={!editor?.can().chain().focus().toggleCode().run()}
                    isActive={editor?.isActive('code')}
                    title="Code"
                  >
                    <CodeIcon className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-300 mx-2" />

                  {/* Lists */}
                  <MenuButton
                    onClick={() => {
                      if (editor?.isActive('bulletList')) {
                        editor?.chain().focus().clearNodes().setParagraph().run();
                      } else {
                        editor?.chain().focus().toggleBulletList().run();
                      }
                    }}
                    disabled={!editor?.can().chain().focus().toggleBulletList().run()}
                    isActive={editor?.isActive('bulletList')}
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => {
                      if (editor?.isActive('orderedList')) {
                        editor?.chain().focus().clearNodes().setParagraph().run();
                      } else {
                        editor?.chain().focus().toggleOrderedList().run();
                      }
                    }}
                    disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
                    isActive={editor?.isActive('orderedList')}
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => {
                      if (editor?.isActive('blockquote')) {
                        editor?.chain().focus().clearNodes().setParagraph().run();
                      } else {
                        editor?.chain().focus().toggleBlockquote().run();
                      }
                    }}
                    disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
                    isActive={editor?.isActive('blockquote')}
                    title="Quote"
                  >
                    <Quote className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-300 mx-2" />

                  {/* Link */}
                  <MenuButton
                    onClick={showLinkCreator}
                    isActive={editor?.isActive('link')}
                    title="Add Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-300 mx-2" />

                  {/* Undo/Redo */}
                  <MenuButton
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editor?.can().chain().focus().undo().run()}
                    title="Undo"
                  >
                    <Undo className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editor?.can().chain().focus().redo().run()}
                    title="Redo"
                  >
                    <Redo className="w-4 h-4" />
                  </MenuButton>
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="bg-white">
                <EditorContent 
                  editor={editor} 
                  className="min-h-[300px] focus-within:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Campaign Scheduling */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Campaign Options</h3>
                <p className="text-sm text-gray-600">Choose when to send your campaign</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 text-sm font-medium ${!isScheduled ? 'text-blue-600' : 'text-gray-500'}`}>
                  <Send className="w-4 h-4" />
                  <span>Send Now</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScheduled(!isScheduled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isScheduled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isScheduled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className={`flex items-center space-x-2 text-sm font-medium ${isScheduled ? 'text-blue-600' : 'text-gray-500'}`}>
                  <Clock className="w-4 h-4" />
                  <span>Schedule</span>
                </div>
              </div>
            </div>

            {/* Scheduling Controls */}
            {isScheduled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="scheduleDate"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={getCurrentISTDateTime().date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                                 <div>
                   <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-2">
                     Select Time (IST)
                   </label>
                   <input
                     type="time"
                     id="scheduleTime"
                     value={scheduleTime}
                     onChange={(e) => setScheduleTime(e.target.value)}
                     min={getMinTimeForDate(scheduleDate)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   <p className="text-xs text-gray-500 mt-1">Indian Standard Time (IST)</p>
                 </div>
                {scheduleDate && scheduleTime && (
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-md">
                      <span>📅</span>
                      <span>
                        Campaign will be sent on <strong>{scheduleDate}</strong> at <strong>{scheduleTime}</strong> IST
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={() => setShowTestModal(true)}
              disabled={!selectedList || !subject || !hasContent}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send Test Email
            </button>
            <button
              onClick={handleSendEmails}
              disabled={!selectedList || !subject || !hasContent || sending || (isScheduled && (!scheduleDate || !scheduleTime))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {sending 
                ? (isScheduled ? 'Scheduling Campaign...' : 'Sending Campaign...') 
                : (isScheduled ? 'Schedule Campaign' : 'Send Campaign')
              }
            </button>
          </div>
        </div>
      </div>

      {/* Temporarily commented out - Statistics Card */}
      {/* 
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
                {lists.filter(list => list.type === 'List').length}
              </div>
              <div className="text-purple-700">Static Lists</div>
            </div>
          </div>
        </div>
      )}
      */}

      {/* Email Tips */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Email Best Practices</h3>
        <ul className="text-sm text-amber-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Keep subject lines concise and compelling</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Personalize content when possible</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Include a clear call-to-action</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Test your emails before sending to the full list</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Ensure content is mobile-friendly</span>
          </li>
        </ul>
      </div>

      {/* Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Test Email</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email Address
                </label>
                <input
                  type="email"
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter test email address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTest}
                  disabled={!testEmail || sendingTest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingTest ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {notification.type === 'success' ? 'Success' : 'Error'}
                </h3>
              </div>
              <button
                onClick={hideNotification}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">{notification.message}</p>
            <div className="flex justify-end">
              <button
                onClick={hideNotification}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  notification.type === 'success'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Link</h3>
            <div className="space-y-4">
                             <div>
                 <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-2">
                   Link Text
                 </label>
                 <input
                   type="text"
                   id="linkText"
                   value={linkText}
                   onChange={(e) => setLinkText(e.target.value)}
                   placeholder="e.g., Visit our website"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
                 <p className="text-xs text-gray-500 mt-1">This is the text that will be displayed as the link</p>
               </div>
               <div>
                 <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-2">
                   Link URL
                 </label>
                 <input
                   type="text"
                   id="linkUrl"
                   value={linkUrl}
                   onChange={(e) => setLinkUrl(e.target.value)}
                   placeholder="https://example.com"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
                 <p className="text-xs text-gray-500 mt-1">Enter the full URL including https://</p>
               </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={hideLinkModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                                 <button
                   onClick={createLink}
                   disabled={!linkUrl.trim() || !linkText.trim()}
                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Create Link
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 