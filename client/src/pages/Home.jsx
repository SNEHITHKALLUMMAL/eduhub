import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  FileText, 
  PlayCircle, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchMaterials();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMaterials = async (searchTerm = '') => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/materials', {
        params: { search: searchTerm }
      });
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch materials error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to load materials');
      }
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMaterials(search);
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Resources</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Explore our collection of files and video materials to enhance your learning experience.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 text-base"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="h-5 w-5" />
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <FileText className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <p className="text-slate-500 text-xl font-medium">No materials found</p>
          <p className="text-slate-400 mt-2">Login as Admin and upload some materials</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((material) => (
            <div 
              key={material._id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    material.type === 'file' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {material.type === 'file' ? 
                      <FileText className="h-6 w-6" /> : 
                      <PlayCircle className="h-6 w-6" />
                    }
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {material.type === 'file' ? (material.fileType || 'File') : 'YouTube'}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{material.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                  {material.description || 'No description provided'}
                </p>

                {material.type === 'youtube' && material.youtubeUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 shadow-inner bg-black">
                    <iframe
                      src={getYoutubeEmbedUrl(material.youtubeUrl)}
                      className="w-full h-full"
                      title={material.title}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                )}
              </div>
              
              <div className="p-6 pt-0 mt-auto border-t border-slate-100">
                {material.type === 'file' ? (
                  <a
                    href={`${API.defaults.baseURL}${material.fileUrl}`}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Download File
                  </a>
                ) : (
                  <a
                    href={material.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-600 font-semibold py-3 px-6 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Watch on YouTube
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;