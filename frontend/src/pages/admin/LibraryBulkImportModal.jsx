import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, 
  Download, Layers, Settings2, ArrowRight, RefreshCw, FileText 
} from 'lucide-react';

const DEFAULT_MAPPING = {
  bookNumber: ['ACCESSION NO', 'ACCESSION', 'Sl.No.', 'SL.NO', 'Book Number', 'Book No', 'No.', 'ID'],
  title: ['TITLE', 'Title', 'Book Title', 'Name', 'Book Name'],
  author: ['AUTHOR', 'Author', 'Writer', 'Author Name'],
  category: ['Section', 'SECTION', 'Source Sheet', 'Category', 'Genre', 'Subject'],
  callNumber: ['CALL NO', 'Call No', 'Call Number', 'CallNo'],
  publisher: ['PUBLISHER', 'Publisher', 'Publication'],
  price: ['PRICE', 'Price', 'Cost', 'Amount'],
  remarks: ['Remarks', 'REMARKS', 'Notes', 'Comments']
};

const autoDetectMapping = (headers) => {
  const mapping = {
    bookNumber: '',
    title: '',
    author: '',
    category: '',
    callNumber: '',
    publisher: '',
    price: '',
    remarks: ''
  };

  const cleanHeaders = headers.map(h => (h ? String(h).trim() : ''));

  Object.keys(DEFAULT_MAPPING).forEach(field => {
    const candidates = DEFAULT_MAPPING[field];
    const matched = cleanHeaders.find(h => 
      candidates.some(c => c.toLowerCase() === h.toLowerCase())
    );
    if (matched) {
      mapping[field] = matched;
    }
  });

  // Fallbacks if not auto-matched
  if (!mapping.bookNumber) {
    mapping.bookNumber = cleanHeaders.find(h => /accession|book.*num|sl.*no|id/i.test(h)) || cleanHeaders[0] || '';
  }
  if (!mapping.title) {
    mapping.title = cleanHeaders.find(h => /title|name/i.test(h)) || cleanHeaders[1] || '';
  }
  if (!mapping.author) {
    mapping.author = cleanHeaders.find(h => /author|writer/i.test(h)) || cleanHeaders[2] || '';
  }

  return mapping;
};

const LibraryBulkImportModal = ({ isOpen, onClose, onImport, isImporting }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [duplicateAction, setDuplicateAction] = useState('skip');
  const [step, setStep] = useState(1); // 1: Upload, 2: Map & Preview

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet('');
    setRawHeaders([]);
    setRawRows([]);
    setColumnMapping({});
    setStep(1);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const processWorkbookSheet = async (wb, sheetName, XLSXModule) => {
    const XLSX = XLSXModule || (await import('xlsx'));
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!jsonData || jsonData.length === 0) return;

    const headers = (jsonData[0] || []).map(h => String(h).trim());
    const rows = jsonData.slice(1).filter(r => r.some(cell => cell !== ''));

    setRawHeaders(headers);
    setRawRows(rows);

    const detected = autoDetectMapping(headers);
    setColumnMapping(detected);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const XLSX = await import('xlsx');
        const data = new Uint8Array(event.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        const firstSheet = wb.SheetNames[0] || '';
        setSelectedSheet(firstSheet);
        await processWorkbookSheet(wb, firstSheet, XLSX);
        setStep(2);
      } catch (err) {
        alert('Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv file.');
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleSheetChange = async (e) => {
    const sheetName = e.target.value;
    setSelectedSheet(sheetName);
    if (workbook && sheetName) {
      await processWorkbookSheet(workbook, sheetName);
    }
  };

  const handleDownloadSample = async () => {
    const XLSX = await import('xlsx');
    const sampleData = [
      {
        "ACCESSION NO": 1001,
        "TITLE": "Tafsir Al-Qurtubi Vol 1",
        "AUTHOR": "Imam Al-Qurtubi",
        "Section": "Arabic - Tafseer",
        "CALL NO": "222.3 QUR/K",
        "PUBLISHER": "Dar Al-Kotob Al-Ilmiyah",
        "PRICE": 450,
        "Remarks": "Hardcover"
      },
      {
        "ACCESSION NO": 1002,
        "TITLE": "Sahih Al-Bukhari",
        "AUTHOR": "Imam Al-Bukhari",
        "Section": "Arabic - Hadith",
        "CALL NO": "223.1 BUK/S",
        "PUBLISHER": "Darussalam",
        "PRICE": 600,
        "Remarks": "Volume 1"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Sample Books");
    XLSX.writeFile(wb, "Sample_Book_Catalogue.xlsx");
  };

  // Convert raw rows to parsed book objects based on current column mapping
  const parsedBooks = rawRows.map((row) => {
    const getVal = (fieldName) => {
      const colHeader = columnMapping[fieldName];
      if (!colHeader) return '';
      const colIdx = rawHeaders.indexOf(colHeader);
      if (colIdx === -1) return '';
      const val = row[colIdx];
      return val !== undefined && val !== null ? String(val).trim() : '';
    };

    const bookNumber = getVal('bookNumber');
    const title = getVal('title');
    const author = getVal('author');
    const category = getVal('category');
    const callNumber = getVal('callNumber');
    const publisher = getVal('publisher');
    const price = getVal('price');
    const remarks = getVal('remarks');

    const numParsed = parseInt(bookNumber, 10);
    const isValid = !isNaN(numParsed) && title.length > 0;

    return {
      bookNumber: isNaN(numParsed) ? bookNumber : numParsed,
      title,
      author: author || 'Unknown',
      category: category || 'General',
      callNumber,
      publisher,
      price: parseFloat(price) || 0,
      remarks,
      isValid
    };
  });

  const validCount = parsedBooks.filter(b => b.isValid).length;
  const invalidCount = parsedBooks.length - validCount;

  const handleSubmitImport = async () => {
    const booksToSubmit = parsedBooks.filter(b => b.isValid);
    if (booksToSubmit.length === 0) {
      alert('No valid books to import. Please check your file and column mappings.');
      return;
    }

    const success = await onImport(booksToSubmit, duplicateAction);
    if (success) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#11322f] w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#0d2522] bg-gray-50/50 dark:bg-[#0d2522]/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-teal/10 rounded-xl text-brand-teal dark:text-brand-mint">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Bulk Import Book Catalogue
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload Excel (.xlsx, .xls) or CSV files to add or update multiple books at once
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {step === 1 ? (
            /* STEP 1: Upload File */
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-[#0d2522] hover:border-brand-teal dark:hover:border-brand-mint rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 bg-gray-50/50 dark:bg-[#0d2522]/30 hover:bg-brand-mint/5 group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden" 
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-mint/10 dark:bg-brand-mint/20 text-brand-teal dark:text-brand-mint flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
                  Click to upload Excel file or drag & drop
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Supports .xlsx, .xls, and .csv files (e.g. PFM catalogue.xlsx)
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-semibold shadow-sm group-hover:bg-brand-teal/90">
                  Select File
                </div>
              </div>

              {/* Sample File Box */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">Need a format template?</h4>
                    <p className="text-[11px] text-blue-700/70 dark:text-blue-400">Download a pre-formatted Excel catalogue file with standard headers.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  <Download size={13} /> Download Template
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Sheet Selector, Column Mapping & Live Preview */
            <div className="space-y-6">
              
              {/* File Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-[#0d2522] rounded-xl border border-gray-100 dark:border-[#0d2522]">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-white">
                  <FileSpreadsheet size={16} className="text-brand-mint" />
                  <span className="truncate max-w-[200px]">{file?.name}</span>
                </div>

                {/* Sheet Selector */}
                {sheetNames.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500">Sheet:</span>
                    <select
                      value={selectedSheet}
                      onChange={handleSheetChange}
                      className="text-xs bg-white dark:bg-[#11322f] border border-gray-200 dark:border-[#0d2522] px-2.5 py-1 rounded-lg text-gray-800 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    >
                      {sheetNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-brand-teal dark:text-brand-mint font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Change File
                </button>
              </div>

              {/* Column Mapping Section */}
              <div className="p-4 bg-gray-50/60 dark:bg-[#0d2522]/40 rounded-xl border border-gray-100 dark:border-[#0d2522] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 size={16} className="text-brand-mint" />
                    <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                      Column Mapping (Excel Header → Book Field)
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-400">Auto-detected matching headers</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'bookNumber', label: 'Book / Acc No *' },
                    { key: 'title', label: 'Book Title *' },
                    { key: 'author', label: 'Author' },
                    { key: 'category', label: 'Section / Category' },
                    { key: 'callNumber', label: 'Call Number' },
                    { key: 'publisher', label: 'Publisher' },
                    { key: 'price', label: 'Price' },
                    { key: 'remarks', label: 'Remarks' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {label}
                      </label>
                      <select
                        value={columnMapping[key] || ''}
                        onChange={(e) => setColumnMapping({ ...columnMapping, [key]: e.target.value })}
                        className="w-full text-xs bg-white dark:bg-[#11322f] border border-gray-200 dark:border-[#0d2522] px-2 py-1.5 rounded-lg text-gray-800 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal"
                      >
                        <option value="">-- Ignore Field --</option>
                        {rawHeaders.map((header, idx) => (
                          <option key={idx} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duplicate Resolution Options */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/20 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-300">
                  Duplicate Book Numbers Handling:
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-900 dark:text-amber-300 font-medium">
                    <input 
                      type="radio" 
                      name="duplicateAction" 
                      value="skip"
                      checked={duplicateAction === 'skip'}
                      onChange={() => setDuplicateAction('skip')}
                      className="text-brand-teal focus:ring-brand-teal"
                    />
                    Skip existing book numbers
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-900 dark:text-amber-300 font-medium">
                    <input 
                      type="radio" 
                      name="duplicateAction" 
                      value="update"
                      checked={duplicateAction === 'update'}
                      onChange={() => setDuplicateAction('update')}
                      className="text-brand-teal focus:ring-brand-teal"
                    />
                    Update existing books
                  </label>
                </div>
              </div>

              {/* Preview Stats & Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Data Preview ({parsedBooks.length} rows parsed)
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                      ✓ {validCount} Valid Ready
                    </span>
                    {invalidCount > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30">
                        ⚠ {invalidCount} Skipped (Incomplete)
                      </span>
                    )}
                  </div>
                </div>

                <div className="border border-gray-100 dark:border-[#0d2522] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-[#0d2522] sticky top-0 border-b border-gray-100 dark:border-[#0d2522] text-gray-400 uppercase font-bold">
                      <tr>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Book No.</th>
                        <th className="px-3 py-2">Title</th>
                        <th className="px-3 py-2">Author</th>
                        <th className="px-3 py-2">Category / Section</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
                      {parsedBooks.slice(0, 100).map((book, idx) => (
                        <tr key={idx} className={book.isValid ? 'hover:bg-gray-50/50 dark:hover:bg-[#0d2522]/30' : 'bg-red-50/30 dark:bg-red-900/10'}>
                          <td className="px-3 py-2">
                            {book.isValid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={12} /> Ready
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400" title="Missing Book Number or Title">
                                <AlertCircle size={12} /> Incomplete
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 font-mono font-semibold text-gray-800 dark:text-white">
                            #{book.bookNumber || '-'}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                            {book.title || <em className="text-gray-400">Missing Title</em>}
                          </td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                            {book.author}
                          </td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                            {book.category}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedBooks.length > 100 && (
                    <div className="p-2 text-center text-xs text-gray-400 bg-gray-50 dark:bg-[#0d2522]">
                      Showing first 100 rows out of {parsedBooks.length}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#0d2522] bg-gray-50/50 dark:bg-[#0d2522]/50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isImporting}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          {step === 2 && (
            <button
              type="button"
              onClick={handleSubmitImport}
              disabled={isImporting || validCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              {isImporting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Importing {validCount} Books...
                </>
              ) : (
                <>
                  Import {validCount} Books <ArrowRight size={14} />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default LibraryBulkImportModal;
