import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  X, 
  ExternalLink,
  Award
} from 'lucide-react';
import { AssignmentRecord, UserRole } from '../types';

interface AssignmentsViewProps {
  assignments: AssignmentRecord[];
  onSubmitAssignment: (assignmentId: number, content: string) => void;
  currentUserRole?: UserRole;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  onSubmitAssignment,
  currentUserRole,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentRecord | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    onSubmitAssignment(selectedAssignment.id, submissionText);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setSelectedAssignment(null);
      setSubmissionText('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Assignments & Lab Submissions</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track deadlines, submit deliverables, and view professor grades & commentary
          </p>
        </div>
      </div>

      {/* Assignment cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((assignment) => {
          const isPending = assignment.status === 'pending';
          const isSubmitted = assignment.status === 'submitted';
          const isGraded = assignment.status === 'graded';

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {assignment.courseCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isGraded
                        ? 'bg-purple-100 text-purple-800'
                        : isSubmitted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {assignment.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {assignment.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </span>
                  <span className="font-semibold text-slate-700">Max: {assignment.maxMarks} pts</span>
                </div>

                {isGraded && (
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-purple-900">
                      <span>Score Obtained:</span>
                      <span>{assignment.marksObtained} / {assignment.maxMarks}</span>
                    </div>
                    {assignment.feedback && (
                      <p className="text-[11px] text-purple-700 mt-1 italic">
                        "{assignment.feedback}"
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-1">
                  {isPending ? (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1 transition"
                    >
                      <span>View Submission Details</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-blue-400">
                  {selectedAssignment.courseCode}
                </span>
                <h3 className="font-bold text-base mt-0.5">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successToast ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">Submission Recorded!</h4>
                <p className="text-xs text-slate-500">
                  Your work has been timestamped and pushed to the course instructor.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Problem Requirements:
                  </label>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedAssignment.description}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Solution Link (GitHub / Google Drive / Code snippet):
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="https://github.com/myteam/campusos-assignment OR paste explanation here..."
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Max Marks: {selectedAssignment.maxMarks} pts
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
                  >
                    Confirm Submission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
