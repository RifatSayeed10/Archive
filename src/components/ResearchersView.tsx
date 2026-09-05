import React from "react";
import { Users, Mail, Globe, MapPin, Briefcase, Plus, BookOpen, ChevronRight, X, ArrowUpRight, Award, Trash2 } from "lucide-react";
import { Researcher, Paper, User } from "../types";
import { api } from "../lib/api";
import { getTaxonomyColor, getResearcherColor } from "../lib/taxonomyColors";

interface ResearchersViewProps {
  researchers: Researcher[];
  papers: Paper[];
  currentUser: User | null;
  selectedResearcherId?: string;
  onRefreshData: () => void;
  onSelectPaper: (paper: Paper) => void;
}

export default function ResearchersView({
  researchers,
  papers,
  currentUser,
  selectedResearcherId,
  onRefreshData,
  onSelectPaper
}: ResearchersViewProps) {
  const [selectedRes, setSelectedRes] = React.useState<Researcher | null>(null);

  // Form State
  const [formOpen, setFormOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const isAdmin = currentUser && currentUser.role === "admin";

  // Pre-load researcher detail if passed down
  React.useEffect(() => {
    if (selectedResearcherId) {
      const match = researchers.find(r => r.id === selectedResearcherId);
      if (match) setSelectedRes(match);
    }
  }, [selectedResearcherId, researchers]);

  const handleCreateResearcher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !affiliation) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const fallbackPhoto = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    try {
      await api.createResearcher({
        name,
        affiliation,
        position: position || "Fellow Investigator",
        bio,
        email,
        website,
        profilePhoto: photoUrl.trim() || fallbackPhoto
      });

      setName("");
      setAffiliation("");
      setPosition("");
      setBio("");
      setEmail("");
      setWebsite("");
      setPhotoUrl("");
      setSuccessMsg("Scholar profile successfully cataloged!");
      onRefreshData();
      setTimeout(() => {
        setFormOpen(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to catalog investigator");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResearcher = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this researcher's profile?")) return;
    try {
      await api.deleteResearcher(id);
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes(null);
      }
      onRefreshData();
    } catch (err: any) {
      alert("Error removing scholar profile");
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Faculty & Research Investigators
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Browse profile directories, supervisor portfolios, and academic publications from PUST CSE faculty & researchers.
          </p>
        </div>

        {currentUser && (
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 px-4 py-2 font-sans text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Faculty Profile
          </button>
        )}
      </div>

      {/* Integrate Profile Drawer form */}
      {formOpen && currentUser && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-md space-y-5" id="integrate-res-form">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
              Add Scholar / Faculty Profile
            </h3>
            <button onClick={() => setFormOpen(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateResearcher} className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Md. Abdur Rahim"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Department / Institution *
              </label>
              <input
                type="text"
                required
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="Dept. of CSE, PUST"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Academic Position / Title
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Associate Professor"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahim@pust.ac.bd"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 font-sans transition-all"
              />
            </div>

             <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Website / Google Scholar URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://scholar.google.com/citations?user=..."
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Portrait Photo JPG URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="e.g. Unsplash or university profile image URL"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 font-sans transition-all"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Academic Bio & Research Interests
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Detail research interests, supervised domains, achievements, and lab focus areas..."
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 resize-none font-sans leading-relaxed transition-all"
              ></textarea>
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-3 pt-2">
              {errorMsg && <span className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200 mr-auto leading-tight">{errorMsg}</span>}
              {successMsg && <span className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 mr-auto leading-tight">{successMsg}</span>}
              
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 px-6 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {loading ? "Saving..." : "Publish Profile Card"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Workspace Layout (Left Grid list - Right Details Inspect) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Scholar list grid */}
        <div className={`${selectedRes ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3" id="researchers-grid-layout">
            {researchers.map((res) => {
              const isInspected = selectedRes && selectedRes.id === res.id;
              const researcherPapers = papers.filter(p => p.researcherId === res.id || p.authors.some(a => a.includes(res.name)) || p.supervisor?.includes(res.name));
              const resCategories = Array.from(new Set(researcherPapers.flatMap(p => p.categories || []))).slice(0, 2);

              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedRes(res)}
                  className={`group relative rounded-2xl border p-5 sm:p-6 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between ${
                    isInspected
                      ? "bg-zinc-100/80 dark:bg-zinc-800/80 border-zinc-400 dark:border-zinc-500 shadow-xs"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top avatar and badge details */}
                    <div className="flex items-center justify-between">
                      <div className="relative inline-block pb-1">
                        <img
                          src={res.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
                          alt={res.name}
                          referrerPolicy="no-referrer"
                          className="h-16 w-16 rounded-xl object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-xs bg-zinc-50"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full">
                        {researcherPapers.length} works
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white transition-colors line-clamp-1">
                        {res.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        <Award className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400 shrink-0" />
                        <span className="truncate">{res.position}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate" title={res.affiliation}>{res.affiliation}</span>
                      </div>
                    </div>

                    {/* Show categories they publish in */}
                    {resCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 justify-start">
                        {resCategories.map((cat, ci) => (
                          <span
                            key={ci}
                            className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[11px] text-zinc-400 font-medium">PUST CSE Faculty</span>
                    
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDeleteResearcher(res.id, e)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete researcher profile"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <span className="font-sans font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:underline flex items-center gap-0.5">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Profiler Investigator dossier inspection details */}
        {selectedRes && (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-md space-y-5 lg:col-span-1" id="profile-inspect-panel">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 select-none">
                Faculty Profile
              </span>
              <button
                onClick={() => setSelectedRes(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 transition cursor-pointer"
                title="Collapse Panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile banner */}
            <div className="flex items-start gap-4">
              <img
                src={selectedRes.profilePhoto}
                alt={selectedRes.name}
                referrerPolicy="no-referrer"
                className="h-16 w-16 rounded-xl object-cover shrink-0 border-2 border-zinc-200 dark:border-zinc-700 shadow-xs"
              />
              <div className="min-w-0">
                <h3 className="font-sans text-base font-bold text-zinc-900 dark:text-white leading-tight">
                  {selectedRes.name}
                </h3>
                <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                  {selectedRes.position}
                </span>
                <span className="block text-xs text-zinc-500 font-sans flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {selectedRes.affiliation}
                </span>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="block font-sans text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider select-none">
                Research Profile & Biography
              </span>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                {selectedRes.bio || "Faculty member and research supervisor at Pabna University of Science and Technology."}
              </p>
            </div>

            {/* Contact links and buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {selectedRes.email && (
                <a
                  href={`mailto:${selectedRes.email}`}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                  Send Email
                </a>
              )}
              {selectedRes.website && (
                <a
                  href={selectedRes.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <Globe className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                  Website
                  <ArrowUpRight className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                </a>
              )}
            </div>

            {/* Papers List by this Investigator */}
            <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <h4 className="font-sans text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                Authored & Supervised Works ({papers.filter(p => p.researcherId === selectedRes.id || p.authors.some(a => a.includes(selectedRes.name)) || p.supervisor?.includes(selectedRes.name)).length})
              </h4>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {papers
                  .filter(p => p.researcherId === selectedRes.id || p.authors.some(a => a.includes(selectedRes.name)) || p.supervisor?.includes(selectedRes.name))
                  .map(p => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPaper(p)}
                      className="group flex w-full flex-col justify-start gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 transition-all border border-zinc-200 dark:border-zinc-800 text-left cursor-pointer"
                    >
                      <span className="block font-sans text-xs font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug transition-colors">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {p.year} • {p.publicationType || "Thesis"}
                      </span>
                    </button>
                  ))}
                {papers.filter(p => p.researcherId === selectedRes.id || p.authors.some(a => a.includes(selectedRes.name)) || p.supervisor?.includes(selectedRes.name)).length === 0 && (
                  <p className="text-xs text-zinc-400 font-sans p-2">No publications connected to this faculty profile yet.</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
