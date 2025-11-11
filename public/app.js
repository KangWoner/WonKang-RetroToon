// DOM Elements
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');
const styleButtons = document.querySelectorAll('.style-btn');

// State
let selectedFile = null;
let selectedStyle = '80s';

// Initialize event listeners
function init() {
  uploadBox.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  convertBtn.addEventListener('click', handleConvert);
  resetBtn.addEventListener('click', handleReset);

  // Style selection
  styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      styleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStyle = btn.dataset.style;
    });
  });

  // Drag and drop
  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
  });

  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && isValidImageFile(file)) {
      selectedFile = file;
      updateUploadUI();
    } else {
      showError('Please select a valid image file (JPEG, PNG, or WebP)');
    }
  });
}

// Handle file selection
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file && isValidImageFile(file)) {
    selectedFile = file;
    updateUploadUI();
    hideError();
  } else {
    showError('Please select a valid image file (JPEG, PNG, or WebP)');
  }
}

// Validate image file
function isValidImageFile(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    showError('File size must be less than 10MB');
    return false;
  }

  return true;
}

// Update upload UI
function updateUploadUI() {
  if (selectedFile) {
    uploadBox.querySelector('.upload-icon').textContent = '✅';
    uploadBox.querySelector('.upload-text').textContent = selectedFile.name;
    uploadBox.querySelector('.upload-hint').textContent = `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
    convertBtn.disabled = false;
  }
}

// Handle convert button click
async function handleConvert() {
  if (!selectedFile) {
    showError('Please select an image first');
    return;
  }

  // Show loading state
  setLoading(true);
  hideError();

  try {
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('style', selectedStyle);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to convert image');
    }

    // Show result
    displayResult(data.imageUrl);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Failed to convert image. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Display conversion result
function displayResult(imageUrl) {
  resultImage.src = imageUrl;
  downloadBtn.href = imageUrl;
  resultSection.hidden = false;

  // Scroll to result
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Reset to initial state
function handleReset() {
  selectedFile = null;
  fileInput.value = '';
  convertBtn.disabled = true;
  resultSection.hidden = true;
  hideError();

  // Reset upload UI
  uploadBox.querySelector('.upload-icon').textContent = '📸';
  uploadBox.querySelector('.upload-text').textContent = 'Click or drag a photo here';
  uploadBox.querySelector('.upload-hint').textContent = 'Supports: JPEG, PNG, WebP (max 10MB)';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide loading state
function setLoading(isLoading) {
  convertBtn.disabled = isLoading;
  if (isLoading) {
    btnText.hidden = true;
    btnLoader.hidden = false;
  } else {
    btnText.hidden = false;
    btnLoader.hidden = true;
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = `❌ ${message}`;
  errorMessage.hidden = false;
  setTimeout(() => {
    hideError();
  }, 5000);
}

// Hide error message
function hideError() {
  errorMessage.hidden = true;
}

// Initialize the app
init();
