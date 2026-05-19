import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

type SortBy = 'name' | 'pricePerDay' | 'depositAmount' | 'stock' | 'createdAt';
type SortOrder = 'asc' | 'desc';

// Default sort direction when first clicking a column.
// Numeric columns show highest-first by default; name sorts A→Z.
const DEFAULT_SORT_ORDER: Record<SortBy, SortOrder> = {
  name:          'asc',
  pricePerDay:   'desc',
  depositAmount: 'desc',
  stock:         'desc',
  createdAt:     'desc',
};

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  return (
    <span className="ml-1 inline-flex items-center">
      {!active && (
        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="2" y1="4"  x2="11" y2="4"  />
          <line x1="2" y1="8"  x2="8"  y2="8"  />
          <line x1="2" y1="12" x2="5"  y2="12" />
        </svg>
      )}
      {active && order === 'desc' && (
        <svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="4"  x2="9"  y2="4"  />
          <line x1="2" y1="8"  x2="7"  y2="8"  />
          <line x1="2" y1="12" x2="5"  y2="12" />
          <line x1="13" y1="3" x2="13" y2="13" />
          <polyline points="10,10 13,13 16,10" />
        </svg>
      )}
      {active && order === 'asc' && (
        <svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="4"  x2="9"  y2="4"  />
          <line x1="2" y1="8"  x2="7"  y2="8"  />
          <line x1="2" y1="12" x2="5"  y2="12" />
          <line x1="13" y1="3" x2="13" y2="13" />
          <polyline points="10,6 13,3 16,6" />
        </svg>
      )}
    </span>
  );
}

export default function AdminPlantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 400); // wait 400ms after typing before searching

  const sortBy = (searchParams.get('sortBy') as SortBy) || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => { const next = new URLSearchParams(prev); if (value) { next.set(key, value); } else { next.delete(key); } return next; }, { replace: true });
  };

  const setPage = (p: number) => updateParam('page', String(p));

  const handleSort = (col: SortBy) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (prev.get('sortBy') === col) {
        // same column — toggle direction
        next.set('sortOrder', prev.get('sortOrder') === 'asc' ? 'desc' : 'asc');
      } else {
        // new column — use its natural default direction
        next.set('sortBy', col);
        next.set('sortOrder', DEFAULT_SORT_ORDER[col]);
      }
      next.delete('page');
      return next;
    }, { replace: true });
  };

  const [modalOpen, setModalOpen] = useState(false);          // controls plant form modal
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null); // null = create mode, plant = edit mode

  const [confirmOpen, setConfirmOpen] = useState(false);      // controls delete confirm dialog
  const [deletingId, setDeletingId] = useState<string | null>(null); // id of plant to delete

  const { data, isLoading, isError } = useAdminPlants({
    search: debouncedSearch || undefined,
    page,
    limit: 10,
    sortBy,
    sortOrder,
  });

  const { mutate: create, isPending: creating } = useCreatePlant();
  const { mutate: update, isPending: updating } = useUpdatePlant();
  const { mutate: remove, isPending: deleting } = useDeletePlant();
  const { mutate: uploadImages, isPending: uploading } = useUploadPlantImages();
  const { mutate: deleteImage, isPending: deletingImage } = useDeletePlantImage();

  const isMutating = creating || updating || uploading || deletingImage; // true while any write operation is in progress

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) { next.set('search', value); } else { next.delete('search'); }
      next.delete('page'); // reset to page 1 on new search
      return next;
    }, { replace: true });
  };

  const openCreate = () => {
    setEditingPlant(null);  // no plant = create mode
    setModalOpen(true);
  };

  const openEdit = (plant: Plant) => {
    setEditingPlant(plant); // pass plant = edit mode
    setModalOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);      // store which plant to delete
    setConfirmOpen(true);   // show confirm dialog
  };

  const handlePlantSubmit = (formData: CreatePlantRequest, newFiles: File[]) => {
    if (editingPlant) {
      // edit mode: update plant fields first, then upload new images if any
      update(
        { id: editingPlant._id, body: formData },
        {
          onSuccess: () => {
            if (newFiles.length > 0) {
              uploadImages(
                { id: editingPlant._id, files: newFiles },
                { onSuccess: () => setModalOpen(false) }, // close modal after images uploaded
              );
            } else {
              setModalOpen(false); // no new images, close immediately
            }
          },
        },
      );
    } else {
      // create mode: create plant first, then upload images using the new plant's id
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
    deleteImage(
      { id: editingPlant._id, imageUrl: url },
      { onSuccess: (res) => setEditingPlant(res.data) }, // keep editingPlant in sync so stale image doesn't reappear
    );
  };

  const handleAvailabilityToggle = (plant: Plant) => {
    update({ id: plant._id, body: { isAvailable: !plant.isAvailable } }); // flip availability
  };

  const handleDelete = () => {
    if (!deletingId) return;
    remove(deletingId, {
      onSuccess: () => {
        setConfirmOpen(false);
        setDeletingId(null); // clear after deletion
      },
    });
  };

  const plants = data?.data.plants ?? [];                          // list of plants or empty array while loading
  const totalPages = data?.data.pagination.totalPages ?? 1;        // total pages for pagination

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
                      {(
                        [
                          { label: 'Name',      col: 'name'          },
                          { label: 'Category',  col: null            },
                          { label: '₹/Day',     col: 'pricePerDay'   },
                          { label: 'Deposit',   col: 'depositAmount' },
                          { label: 'Stock',     col: 'stock'         },
                          { label: 'Care',      col: null            },
                          { label: 'Available', col: null            },
                          { label: 'Actions',   col: null            },
                        ] as { label: string; col: SortBy | null }[]
                      ).map(({ label, col }) => {
                        const isActive = col !== null && sortBy === col;
                        return col ? (
                          <th key={label} className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => handleSort(col)}
                              className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide rounded-md px-2 py-1 transition-colors ${
                                isActive
                                  ? 'text-green-700 bg-green-50'
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {label}
                              <SortIcon active={isActive} order={sortOrder} />
                            </button>
                          </th>
                        ) : (
                          <th
                            key={label}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {label}
                          </th>
                        );
                      })}
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
                              {getThumbUrl(plant.images[0]) ? (
                                <img
                                  src={getThumbUrl(plant.images[0])}
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
                                plant.stock <= 5 ? 'text-red-600' : 'text-gray-800' // red when stock is low
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
  const getThumbUrl = (image: Plant['images'][number] | undefined) =>
    typeof image === 'string' ? image : image?.thumb;
