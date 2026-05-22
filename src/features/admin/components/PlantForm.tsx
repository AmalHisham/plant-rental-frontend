import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Plant } from '../../plants/types';
import type { CreatePlantRequest } from '../types';
import { MAX_PLANT_IMAGES } from '../../../config/constants';

interface Props {
  initialValues?: Plant;                                             // existing plant data — passed in edit mode, omitted in create mode
  onSubmit: (data: CreatePlantRequest, newFiles: File[]) => void;   // called with form fields + newly picked images on submit
  onDeleteImage?: (url: string) => void;                            // called with image URL when user removes an existing image
  isLoading: boolean;                                               // disables submit button and shows spinner while API call runs
}

interface FormValues {
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  stock: number;
  careLevel: 'easy' | 'medium' | 'hard';
  isAvailable: boolean;
}

const CARE_LEVELS = ['easy', 'medium', 'hard'] as const;

export default function PlantForm({ initialValues, onSubmit, onDeleteImage, isLoading }: Props) {
  const getOriginalUrl = (image: Plant['images'][number]) =>
    typeof image === 'string' ? image : image.original;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialValues?.name ?? '',
      category: initialValues?.category ?? '',
      description: initialValues?.description ?? '',
      pricePerDay: initialValues?.pricePerDay ?? 0,
      depositAmount: initialValues?.depositAmount ?? 0,
      stock: initialValues?.stock ?? 0,
      careLevel: initialValues?.careLevel ?? 'easy',
      isAvailable: initialValues?.isAvailable ?? true,
    },
  });

  // New images picked locally (not yet uploaded)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false); // turns true when user drags a file over the upload area
  const fileInputRef = useRef<HTMLInputElement>(null); // lets us open the file picker when user clicks the upload area

  const existingImages = initialValues?.images ?? []; // already uploaded images (empty in create mode)
  const totalCount = existingImages.length + newFiles.length;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const slots = MAX_PLANT_IMAGES - existingImages.length - newFiles.length;
    if (slots <= 0) return;
    const picked = Array.from(fileList).slice(0, slots);
    setNewFiles((prev) => [...prev, ...picked]);
  };

  const removeNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFormSubmit = (data: FormValues) => {
    onSubmit(
      {
        name: data.name.trim(),
        category: data.category.trim(),
        description: data.description.trim(),
        pricePerDay: Number(data.pricePerDay),
        depositAmount: Number(data.depositAmount),
        stock: Number(data.stock),
        careLevel: data.careLevel,
        images: existingImages, // keep existing images as-is
        isAvailable: data.isAvailable,
      },
      newFiles,
    );
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
            placeholder="Monstera Deliciosa"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <input
            className={`${inputClass} ${errors.category ? 'border-red-400' : ''}`}
            placeholder="Tropical"
            {...register('category', { required: 'Category is required' })}
          />
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          className={`${inputClass} ${errors.description ? 'border-red-400' : ''}`}
          rows={3}
          placeholder="A beautiful tropical plant..."
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Price / Day (₹) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`${inputClass} ${errors.pricePerDay ? 'border-red-400' : ''}`}
            placeholder="50"
            {...register('pricePerDay', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be 0 or more' },
              valueAsNumber: true,
            })}
          />
          {errors.pricePerDay && (
            <p className="text-red-500 text-xs mt-1">{errors.pricePerDay.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Deposit (₹) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`${inputClass} ${errors.depositAmount ? 'border-red-400' : ''}`}
            placeholder="200"
            {...register('depositAmount', {
              required: 'Deposit is required',
              min: { value: 0, message: 'Deposit must be 0 or more' },
              valueAsNumber: true,
            })}
          />
          {errors.depositAmount && (
            <p className="text-red-500 text-xs mt-1">{errors.depositAmount.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Stock *</label>
          <input
            type="number"
            min="0"
            step="1"
            className={`${inputClass} ${errors.stock ? 'border-red-400' : ''}`}
            placeholder="10"
            {...register('stock', {
              required: 'Stock is required',
              min: { value: 0, message: 'Stock must be 0 or more' },
              validate: (v) => Number.isInteger(Number(v)) || 'Stock must be a whole number',
              valueAsNumber: true,
            })}
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Care Level</label>
          <select className={inputClass} {...register('careLevel')}>
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
              {...register('isAvailable')}
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
          <span className="text-gray-400 font-normal">({totalCount}/{MAX_PLANT_IMAGES})</span>
        </label>

        {/* Existing images (edit mode) */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {existingImages.map((image) => {
              const url = getOriginalUrl(image);
              return (
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
            )})}
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
        {totalCount < MAX_PLANT_IMAGES && (
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
