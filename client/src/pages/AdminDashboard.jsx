import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, 
  Trash2, 
  Plus, 
  FilePlus, 
  PlayCircle, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
      console.error(error);
      toast.error('Failed to load materials');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      await API.post('/api/materials', formData, config);
      toast.success('Material uploaded successfully!');
      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await API.delete(`/api/materials/${id}`);
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('file');
    setYoutubeUrl('');
    setFile(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500">Manage study materials and resources</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Upload Material</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Material</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date Added</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map((m) => (
              <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{m.title}</div>
                  <div className="text-xs text-slate-400 line-clamp-1">{m.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    m.type === 'file' ? 'bg-primary-100 text-primary-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {m.type === 'file' ? (m.fileType || 'File') : 'YouTube'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                  No materials uploaded yet. Click "Upload Material" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Upload New Material</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType('file')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      type === 'file' 
                        ? 'border-primary-600 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <FilePlus className="h-5 w-5" />
                    <span className="font-medium">File (PDF, DOC, PPT)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('youtube')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      type === 'youtube' 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span className="font-medium">YouTube Video</span>
                  </button>
                </div>
              </div>

              {type === 'file' ? (
                <div>
                  <label className="block text-sm font-semibold mb-1">Upload File</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                      <p className="text-sm text-slate-600">
                        {file ? file.name : 'Click to select file'}
                      </p>
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-1">YouTube Video URL</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Upload Material
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;