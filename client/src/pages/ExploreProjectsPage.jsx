import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectService } from '../services/api';
import { Compass, Sparkles, FolderSearch } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import ProjectFilters from '../components/ProjectFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ExploreProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [collaborationType, setCollaborationType] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (collaborationType && collaborationType !== 'All') params.collaborationType = collaborationType;
      if (status && status !== 'All') params.status = status;
      if (sort) params.sort = sort;

      const res = await projectService.getProjects(params);
      setProjects(res.data?.projects || []);
    } catch (err) {
      console.error('Failed to load projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, collaborationType, status, sort]);

  // Handle Search Input submit / debounce
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchProjects();
  };

  const handleClearSearch = () => {
    setSearch('');
    // Trigger fetch without search
    projectService.getProjects({
      category: category !== 'All' ? category : undefined,
      collaborationType: collaborationType !== 'All' ? collaborationType : undefined,
      status: status !== 'All' ? status : undefined,
      sort,
    }).then((res) => setProjects(res.data?.projects || []));
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCollaborationType('All');
    setStatus('All');
    setSort('newest');
    setSearchParams({});
    projectService.getProjects().then((res) => setProjects(res.data?.projects || []));
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>
            <Compass size={18} />
            <span>PROJECT DISCOVERY DIRECTORY</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Explore Student Projects
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '680px', marginTop: '0.35rem' }}>
            Discover active campus initiatives seeking passionate teammates. Search by tech stack, project category, or collaboration mode.
          </p>
        </div>

        {/* Search Bar Row */}
        <div style={{ marginBottom: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={handleClearSearch}
              placeholder="Search by title, description, or skill (e.g. React, Python, IoT, Machine Learning)..."
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', height: '48px' }}>
              Search
            </button>
          </form>
        </div>

        {/* Filter Controls */}
        <ProjectFilters
          category={category}
          setCategory={setCategory}
          collaborationType={collaborationType}
          setCollaborationType={setCollaborationType}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
          onReset={handleResetFilters}
        />

        {/* Results Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          <span>
            Showing <strong>{projects.length}</strong> {projects.length === 1 ? 'project' : 'projects'}
          </span>
          {(category !== 'All' || collaborationType !== 'All' || status !== 'All' || search) && (
            <span style={{ color: '#2563eb', fontWeight: 500 }}>
              Filtered results
            </span>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <LoadingSpinner text="Searching and loading projects..." />
        ) : projects.length > 0 ? (
          <div className="grid-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FolderSearch}
            title="No projects match your criteria"
            message="We couldn't find any projects matching your search or filters. Try adjusting keywords or resetting filters to see more opportunities."
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        )}

      </div>
    </div>
  );
};

export default ExploreProjectsPage;
