import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Upload,
  Trash2,
  Plus,
  X,
  Pencil,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Users state
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const { user } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('file');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user?.token) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      const { data } = await API.get('/api/materials');
      setMaterials(data);
    } catch (error) {
      toast.error('Failed to load materials');
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await API.get('/api/auth/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('file');
    setYoutubeUrl('');
    setFile(null);
    setEditingId(null);
  };

  const handleEdit = (material) => {
    setTitle(material.title);
    setDescription(material.description);
    setType(material.type);
    setYoutubeUrl(material.youtubeUrl || '');
    setEditingId(material._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // UPDATE MATERIAL
      if (editingId) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);

        if (type === 'file') {
          if (file) {
            formData.append('file', file);
          }
        } else {
          if (!youtubeUrl) {
            toast.error('Please enter YouTube URL');
            setLoading(false);
            return;
          }
          formData.append('youtubeUrl', youtubeUrl);
        }

        await API.put(`/api/materials/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success('Material updated successfully!');
        setShowModal(false);
        resetForm();
        fetchMaterials();
        return;
      }

      // CREATE NEW MATERIAL
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);

      if (type === 'file') {
        if (!file) {
          toast.error('Please select a file');
          setLoading(false);
          return;
        }

        formData.append('file', file);
      } else {
        if (!youtubeUrl) {
          toast.error('Please enter YouTube URL');
          setLoading(false);
          return;
        }

        formData.append('youtubeUrl', youtubeUrl);
      }

      await API.post('/api/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Material uploaded successfully!');
      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Operation failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      await API.delete(`/api/materials/${id}`);
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500">
            Manage study materials and resources
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              fetchUsers();
              setShowUsersModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-sm"
          >
            <Users className="h-5 w-5 text-slate-500" />
            View Users
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Upload Material
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4">Material</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {materials.map((m) => (
              <tr key={m._id} className="border-b">
                <td className="px-6 py-4">
                  <div className="font-medium">{m.title}</div>
                  <div className="text-sm text-slate-500">
                    {m.description}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {m.type === 'file'
                    ? m.fileType || 'File'
                    : 'YouTube'}
                </td>

                <td className="px-6 py-4">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 flex justify-end gap-2">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleEdit(m)}
                    className="p-2 hover:bg-blue-50 rounded"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(m._id)}
                    className="p-2 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}

            {materials.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  No materials uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Material' : 'Upload Material'}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">
                  Description
                </label>
                <textarea
                  className="input-field w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Type and File/URL inputs (Always visible) */}
              <div>
                <label className="block mb-1 font-medium">
                  Type
                </label>

                <select
                  className="input-field w-full"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="file">File</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              {type === 'file' ? (
                <div>
                  <label className="block mb-1 font-medium">
                    {editingId ? 'Replace File (Optional)' : 'Upload File'}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-1 font-medium">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    className="input-field w-full"
                    value={youtubeUrl}
                    onChange={(e) =>
                      setYoutubeUrl(e.target.value)
                    }
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 border rounded-xl py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary py-3"
                >
                  {loading
                    ? 'Please wait...'
                    : editingId
                    ? 'Update Material'
                    : 'Upload Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Users Directory</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  View registered users in the system
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {usersLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-slate-500 font-medium">Fetching users list...</p>
                </div>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                          <td className="px-6 py-4 text-slate-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              u.role === 'admin' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-12 text-slate-400">
                            No registered users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className="px-6 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;