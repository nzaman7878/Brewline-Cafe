import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({ onImageSelected, defaultImage }) => {
  const [preview, setPreview] = useState(defaultImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-on-surface">Item Image</label>
      <div 
        className={`relative border-2 border-dashed rounded-card overflow-hidden flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/10' : 'border-outline hover:bg-surface-variant'}
          ${preview ? 'h-64' : 'h-40'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-error text-on-error p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center p-4 pointer-events-none">
            <Upload size={32} className="mx-auto mb-2 text-on-surface-variant" />
            <p className="text-sm font-bold text-on-surface">Drag & Drop image here</p>
            <p className="text-xs text-on-surface-variant mt-1">or click to browse files (JPEG, PNG, WEBP)</p>
          </div>
        )}
      </div>
    </div>
  );
};
