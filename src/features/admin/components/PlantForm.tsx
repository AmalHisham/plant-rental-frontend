import { useRef, useState } from 'react';
import type { Plant } from '../../plants/types';
import type { CreatePlantRequest } from '../types';

interface Props {
  initialValues?: Plant;
  onSubmit: (data: CreatePlantRequest, newFiles: File[]) => void;
  onDeleteImage?: (url: string) => void;
  isLoading: boolean;
}

const CARE_LEVELS = ['easy', 'medium', 'hard'] as const;

export default function PlantForm({ initialValues, onSubmit, onDeleteImage, isLoading }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [pricePerDay, setPricePerDay] = useState(String(initialValues?.pricePerDay ?? ''));
  const [depositAmount, setDepositAmount] = useState(String(initialValues?.depositAmount ?? ''));
  const [stock, setStock] = useState(String(initialValues?.stock ?? ''));
  const [careLevel, setCareLevel] = useState<'easy' | 'medium' | 'hard'>(
    initialValues?.careLevel ?? 'easy',
  );
  const [isAvailable, setIsAvailable] = useState(initialValues?.isAvailable ?? true);
  const [error, setError] = useState('');

  // New images picked locally (not yet uploaded)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingImages = initialValues?.images ?? [];
  const totalCount = existingImages.length + newFiles.length;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const slots = 10 - existingImages.length - newFiles.length;
    if (slots <= 0) return;
    const picked = Array.from(fileList).slice(0, slots);
    setNewFiles((prev) => [...prev, ...picked]);
  };

  const removeNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required.');
    if (!category.trim()) return setError('Category is required.');
    if (!description.trim()) return setError('Description is required.');
    if (Number(pricePerDay) < 0) return setError('Price per day must be 0 or more.');
    if (Number(depositAmount) < 0) return setError('Deposit amount must be 0 or more.');
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
      return setError('Stock must be a non-negative whole number.');

    onSubmit(
      {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        pricePerDay: Number(pricePerDay),
        depositAmount: Number(depositAmount),
        stock: Number(stock),
        careLevel,
        images: existingImages,
        isAvailable,
      },
      newFiles,
    );
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monstera Deliciosa"
          />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <input
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Tropical"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          className={inputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A beautiful tropical plant..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Price / Day (₹) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <label className={labelClass}>Deposit (₹) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="200"
          />
        </div>
        <div>
          <label className={labelClass}>Stock *</label>
          <input
            type="number"
            min="0"
            step="1"
            className={inputClass}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Care Level</label>
          <select
            className={inputClass}
            value={careLevel}
            onChange={(e) => setCareLevel(e.target.value as typeof careLevel)}
          >
            {CARE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm font-medium text-gray-700">Available for rental</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>
          Images{' '}
          <span className="text-gray-400 font-normal">({totalCount}/10)</span>
        </label>

        {/* Existing images (edit mode) */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {existingImages.map((url) => (
              <div key={url} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {onDeleteImage && (
                  <button
                    type="button"
                    onClick={() => onDeleteImage(url)}
                    disabled={isLoading}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:pointer-events-none"
                  >
                    <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                      Remove
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New files preview */}
        {newFiles.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {newFiles.map((file, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(idx)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    Remove
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        {totalCount < 10 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors select-none ${
              dragOver
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <p className="text-sm text-gray-500">
              Drop images or <span className="text-green-600 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP · max 5 MB each</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {initialValues ? 'Save Changes' : 'Create Plant'}
        </button>
      </div>
    </form>
  );
}
