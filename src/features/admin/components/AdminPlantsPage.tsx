import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminModal from './AdminModal';
import ConfirmDialog from './ConfirmDialog';
import PlantForm from './PlantForm';
import TableSkeleton from './TableSkeleton';
import Pagination from './Pagination';
import CareLevelBadge from '../../plants/components/CareLevelBadge';
import {
  useAdminPlants,
  useCreatePlant,
  useUpdatePlant,
  useDeletePlant,
  useUploadPlantImages,
  useDeletePlantImage,
} from '../hooks/adminQueries';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Plant } from '../../plants/types';
import type { CreatePlantRequest } from '../types';

export default function AdminPlantsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAdminPlants({
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  const { mutate: create, isPending: creating } = useCreatePlant();
  const { mutate: update, isPending: updating } = useUpdatePlant();
  const { mutate: remove, isPending: deleting } = useDeletePlant();
  const { mutate: uploadImages, isPending: uploading } = useUploadPlantImages();
  const { mutate: deleteImage } = useDeletePlantImage();

  const isMutating = creating || updating || uploading;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openCreate = () => {
    setEditingPlant(null);
    setModalOpen(true);
  };

  const openEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setModalOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handlePlantSubmit = (formData: CreatePlantRequest, newFiles: File[]) => {
    if (editingPlant) {
      update(
        { id: editingPlant._id, body: formData },
        {
          onSuccess: () => {
            if (newFiles.length > 0) {
              uploadImages(
                { id: editingPlant._id, files: newFiles },
                { onSuccess: () => setModalOpen(false) },
              );
            } else {
              setModalOpen(false);
            }
          },
        },
      );
    } else {
      create(formData, {
        onSuccess: (res) => {
          const plantId = res.data._id;
          if (newFiles.length > 0) {
            uploadImages(
              { id: plantId, files: newFiles },
              { onSuccess: () => setModalOpen(false) },
            );
          } else {
            setModalOpen(false);
          }
        },
      });
    }
  };

  const handleDeleteImage = (url: string) => {
    if (!editingPlant) return;
    deleteImage({ id: editingPlant._id, imageUrl: url });
  };

  const handleAvailabilityToggle = (plant: Plant) => {
    update({ id: plant._id, body: { isAvailable: !plant.isAvailable } });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    remove(deletingId, {
      onSuccess: () => {
        setConfirmOpen(false);
        setDeletingId(null);
      },
    });
  };

  const plants = data?.data.plants ?? [];
  const totalPages = data?.data.pagination.totalPages ?? 1;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plants</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-0.5">
                {data.data.pagination.total} plant{data.data.pagination.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search plants..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-52"
            />
            <button
              onClick={openCreate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Plant
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading && <TableSkeleton rows={10} cols={7} />}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            Failed to load plants. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Name', 'Category', '₹/Day', 'Deposit', 'Stock', 'Care', 'Available', 'Actions'].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {plants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 22V12m0 0C12 6 7 4 3 6c0 5 3 8 9 6zm0 0c0-6 5-8 9-6-1 5-4 8-9 6z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-400 font-medium">No plants found.</p>
                            {search && <p className="text-xs text-gray-300">Try a different search term.</p>}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      plants.map((plant) => (
                        <tr
                          key={plant._id}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {plant.images[0] ? (
                                <img
                                  src={plant.images[0]}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover shrink-0 bg-green-50"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                  <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 22V12m0 0C12 6 7 4 3 6c0 5 3 8 9 6zm0 0c0-6 5-8 9-6-1 5-4 8-9 6z" />
                                  </svg>
                                </div>
                              )}
                              <span className="font-medium text-gray-800 truncate max-w-[140px]">
                                {plant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{plant.category}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">₹{plant.pricePerDay}</td>
                          <td className="px-4 py-3 text-gray-600">₹{plant.depositAmount}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-semibold ${
                                plant.stock <= 5 ? 'text-red-600' : 'text-gray-800'
                              }`}
                            >
                              {plant.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <CareLevelBadge level={plant.careLevel} />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleAvailabilityToggle(plant)}
                              disabled={updating}
                              role="switch"
                              aria-checked={plant.isAvailable}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                plant.isAvailable ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                  plant.isAvailable ? 'translate-x-[18px]' : 'translate-x-[2px]'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(plant)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDelete(plant._id)}
                                className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Plant form modal */}
      <AdminModal
        open={modalOpen}
        title={editingPlant ? 'Edit Plant' : 'Add Plant'}
        onClose={() => setModalOpen(false)}
        isLoading={isMutating}
      >
        <PlantForm
          key={editingPlant?._id ?? 'new'}
          initialValues={editingPlant ?? undefined}
          onSubmit={handlePlantSubmit}
          onDeleteImage={editingPlant ? handleDeleteImage : undefined}
          isLoading={isMutating}
        />
      </AdminModal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Plant"
        message="This plant will be soft-deleted and no longer visible to users. This action cannot be undone."
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingId(null);
        }}
      />
    </AdminLayout>
  );
}
