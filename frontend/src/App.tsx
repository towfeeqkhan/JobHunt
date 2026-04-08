import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { KanbanBoard } from "./components/board/KanbanBoard";
import { AddJobModal } from "./components/modals/AddJobModal";
import { JobDetailView } from "./components/views/JobDetailView";
import { LoginView } from "./components/views/LoginView";
import { RegisterView } from "./components/views/RegisterView";
import { useAuth } from "./context/AuthContext";
import { getApplications } from "./api/application";
import api from "./api/axios";
import type { Job, JobFormData } from "./types";

interface ApplicationRecord {
  _id: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  salaryRange?: string;
  jobDescriptionRaw?: string;
  jobDescriptionSummary?: string;
  resumeBulletSuggestions?: string[];
  status: string;
  createdAt: string;
}

interface ApiErrorData {
  message?: string;
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: applicationsResponse, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
    enabled: !!user,
  });

  const jobs: Job[] =
    applicationsResponse?.applications?.map((app: ApplicationRecord) => ({
      id: app._id,
      jobTitle: app.jobTitle || "Unspecified",
      company: app.company || "Unspecified",
      location: app.location || "Not specified",
      salaryRange: app.salaryRange || "Not disclosed",
      jobDescriptionRaw: app.jobDescriptionRaw || "",
      jobDescriptionSummary: app.jobDescriptionSummary || "",
      resumeBulletSuggestions: app.resumeBulletSuggestions || [],
      column: app.status,
      dateAdded: new Date(app.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    })) || [];

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ApplicationRecord>;
    }) => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/applications/${id}`;
      const response = await api.put(url, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application updated successfully!");
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      toast.error(
        error.response?.data?.message || "Failed to update application",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/applications/${id}`;
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application deleted successfully!");
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete application",
      );
    },
  });

  if (isLoading || (isLoadingJobs && user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";
  const shouldShowAppShell = !isAuthRoute && !!user;

  const handleSaveJob = (newJob: JobFormData) => {
    if (editingJobId) {
      updateMutation.mutate({
        id: editingJobId,
        data: newJob,
      });
      setEditingJobId(null);
    }
    setIsAddModalOpen(false);
  };

  const handleMoveJob = (jobId: string, newColumn: string) => {
    updateMutation.mutate({
      id: jobId,
      data: { status: newColumn },
    });
  };

  const handleJobClick = (job: Job) => {
    navigate(`/job/${job.id}`);
  };

  const handleEditJob = (jobId: string) => {
    setEditingJobId(jobId);
    setIsAddModalOpen(true);
  };

  const handleDeleteJob = (jobId: string) => {
    deleteMutation.mutate(jobId);
    navigate("/");
  };

  const JobDetailRoute = () => {
    const { id } = useParams();
    const job = jobs.find((j) => j.id === id);
    if (!job)
      return (
        <div className="p-8 font-body font-bold text-on-surface">
          Job not found
        </div>
      );
    return (
      <JobDetailView
        job={job}
        onBack={() => navigate("/")}
        onEdit={() => handleEditJob(job.id)}
        onDelete={() => handleDeleteJob(job.id)}
        onUpdateStatus={(newStatus) => handleMoveJob(job.id, newStatus)}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && shouldShowAppShell && (
        <div
          className="fixed inset-0 bg-[#08060d]/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar wrapper */}
      {shouldShowAppShell && (
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <Sidebar
            onAddClick={() => {
              setEditingJobId(null);
              setIsAddModalOpen(true);
            }}
            onNavigateHome={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <main className={`flex-1 flex flex-col overflow-hidden w-full lg:w-auto`}>
        {shouldShowAppShell && (
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginView />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterView />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div className="flex-1 p-4 lg:p-6 lg:px-12 overflow-hidden flex flex-col pt-2 bg-surface">
                  <KanbanBoard
                    jobs={jobs}
                    onMoveJob={handleMoveJob}
                    onJobClick={handleJobClick}
                  />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/job/:id"
            element={
              <PrivateRoute>
                <JobDetailRoute />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {isAddModalOpen && (
        <AddJobModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingJobId(null);
          }}
          onSave={handleSaveJob}
          initialJob={
            editingJobId ? jobs.find((j) => j.id === editingJobId) : undefined
          }
        />
      )}
    </div>
  );
};

export default App;
