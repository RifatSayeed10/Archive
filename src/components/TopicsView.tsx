import React from "react";
import { Hash, Tag, BookOpen, Plus, Trash2, Edit3, HelpCircle, FileText, LayoutGrid } from "lucide-react";
import { Topic, Paper, User } from "../types";
import { api } from "../lib/api";
import { getTaxonomyColor } from "../lib/taxonomyColors";

interface TopicsViewProps {
  topics: Topic[];
  papers: Paper[];
  currentUser: User | null;
  onRefreshData: () => void;
  onSelectTopic: (topicName: string) => void;
}

export default function TopicsView({
  topics,
  papers,
  currentUser,
  onRefreshData,
  onSelectTopic
}: TopicsViewProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const isAdmin = currentUser && currentUser.role === "admin";

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await api.createTopic({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setSuccessMsg("Taxonomy category added successfully!");
      onRefreshData();
      setTimeout(() => setSuccessMsg(""), 1600);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to catalog tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this taxonomy category?")) return;
    try {
      await api.deleteTopic(id);
      onRefreshData();
    } catch (err: any) {
      alert("Error removing topic");
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Title block */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Research Areas & Topics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Explore research tracks and browse corresponding theses, dissertations, and conference publications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Topic lists bento grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              {topics.length} Research Tracks Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" id="topics-list-bento">
            {topics.map((topic) => {
              const count = papers.filter(p => p.categories?.includes(topic.name)).length;

              return (
                <div
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.name)}
                  className="group relative rounded-2xl border bg-white dark:bg-zinc-900 p-6 cursor-pointer shadow-xs transition-all flex flex-col justify-between border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                        <Tag className="h-5 w-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {count} papers
                        </span>
                        
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDeleteTopic(topic.id, e)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-4 transition-colors">
                      {topic.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-end">
                    <span className="flex items-center gap-1 font-sans text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline transition-all">
                      Browse Manuscripts →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Admin controls bar */}
        <div className="lg:col-span-1">
          {isAdmin ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-md space-y-4" id="admin-create-topic-form">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <Plus className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-white">
                  Add Research Track
                </h3>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Track Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cybersecurity & Cryptography"
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Description & Scope *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of computational problems, topics, and application domains..."
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 transition-all resize-none leading-relaxed font-sans"
                  ></textarea>
                </div>

                {errorMsg && <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200">{errorMsg}</p>}
                {successMsg && <p className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200">{successMsg}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 py-2.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  {loading ? "Adding Track..." : "Add Research Track"}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3.5">
              <h4 className="font-serif text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                About Research Tracks
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Research tracks categorize thesis works and publications across PUST CSE. Clicking a card filters the main archive index to show publications in that specific domain.
              </p>
              <p className="text-xs text-zinc-400 font-sans">
                For administrative changes or new tracks, contact the CSE department archive coordinator.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
