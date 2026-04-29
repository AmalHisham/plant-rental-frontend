import { useRef, useState } from 'react';
import AdminModal from './AdminModal';
import ConfirmDialog from './ConfirmDialog';
import { useUploadPlantImages, useDeletePlantImage } from '../hooks/adminQueries';
import type { Plant } from '../../plants/types';

interface Props {
  plant: Plant;
  onClose: () => void;
}

export default function PlantImagesModal({ plant, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState<string | null>(null);

  const { mutate: upload, isPending: uploading } = useUploadPlantImages();
  const { mutate: removeImage, isPending: removingImage } = useDeletePlantImage();

  const isBusy = uploading || removingImage;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    upload({ id: plant._id, files: arr });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleConfirmDelete = () => {
    if (!confirmUrl) return;
    removeImage(
      { id: plant._id, imageUrl: confirmUrl },
      { onSuccess: () => setConfirmUrl(null) },
    );
  };

  // Backend caps at 10; show how many slots remain
  const remaining = 10 - plant.images.length;

  return (
    <>
      <AdminModal
        open
        title={`Images — ${plant.name}`}
        onClose={onClose}
        isLoading={isBusy}
      >
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isBusy && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-5 select-none ${
            dragOver
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <p className="text-sm text-green-600 font-medium">Uploading…</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">
                Drop images here or <span className="text-green-600 underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WebP · max 5 MB each · up to 5 at a time
              </p>
              {remaining <= 3 && remaining > 0 && (
                <p className="text-xs text-amber-600 mt-1 font-medium">
                  {remaining} slot{remaining !== 1 ? 's' : ''} remaining
                </p>
              )}
              {remaining === 0 && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  Maximum of 10 images reached
                </p>
              )}
            </>
          )}
        </div>

        {/* Image grid */}
        {plant.images.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No images yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {plant.images.map((url) => (
              <div key={url} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setConfirmUrl(url)}
                  disabled={isBusy}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:pointer-events-none"
                  aria-label="Delete image"
                >
                  <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    Delete
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!confirmUrl}
        title="Delete image"
        message="This will permanently remove the image from Cloudinary. This cannot be undone."
        confirmLabel="Delete"
        isLoading={removingImage}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmUrl(null)}
      />
    </>
  );
}
