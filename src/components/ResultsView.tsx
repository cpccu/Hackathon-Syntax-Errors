import React from 'react';
import { 
  Award, 
  TrendingUp, 
  BookOpen, 
  Printer, 
  Download, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { ResultRecord, User } from '../types';

interface ResultsViewProps {
  results: ResultRecord[];
  currentUser: User | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  currentUser,
}) => {
  // Compute CGPA
  const totalCredits = results.reduce((acc, r) => acc + r.creditHours, 0);
  const weightedPoints = results.reduce((acc, r) => acc + r.creditHours * r.gradePoint, 0);
  const computedGpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '3.85';

  const gradingScale = [
    { range: '80% and above', letter: 'A+', point: '4.00' },
    { range: '75% to 79%', letter: 'A', point: '3.75' },
    { range: '70% to 74%', letter: 'A-', point: '3.50' },
    { range: '65% to 69%', letter: 'B+', point: '3.25' },
    { range: '60% to 64%', letter: 'B', point: '3.00' },
    { range: '55% to 59%', letter: 'B-', point: '2.75' },
    { range: 'Below 40%', letter: 'F', point: '0.00' },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Academic Results & Grade Sheet</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official semester transcript with Midterm, Final, and Continuous Assessment breakdown
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Grade Sheet</span>
        </button>
      </div>

      {/* GPA Highlights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider">
              Cumulative Grade Point (CGPA)
            </span>
            <div className="text-4xl font-black mt-2">{computedGpa}</div>
            <p className="text-xs text-blue-200 mt-1">Scale of 4.00 • First Class Honors</p>
          </div>
          <div className="pt-4 mt-2 border-t border-blue-800/80 flex items-center justify-between text-xs">
            <span>Student: {currentUser?.fullName || 'Rafid Ahmed'}</span>
            <span className="font-mono">{currentUser?.studentId || 'CU-2023-CSE-042'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Earned Credits this Semester
            </span>
            <div className="text-4xl font-black text-slate-800 mt-2">
              {totalCredits}.0
            </div>
            <p className="text-xs text-slate-500 mt-1">3 Completed Core Computer Science Courses</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center text-xs text-emerald-600 font-semibold space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>All Prerequisites Satisfied</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Academic Standing
            </span>
            <div className="text-3xl font-black text-emerald-600 mt-2">
              Dean's Honor List
            </div>
            <p className="text-xs text-slate-500 mt-1">Eligible for Merit Scholarship Waiver</p>
          </div>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Fall 2026 Examination Session
          </div>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800">
            Course Performance Breakdown
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Semester 5 • Computer Science & Engineering
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5 text-center">Credit</th>
                <th className="p-3.5 text-center">Mid (30)</th>
                <th className="p-3.5 text-center">Final (50)</th>
                <th className="p-3.5 text-center">Assign (10)</th>
                <th className="p-3.5 text-center">Att (10)</th>
                <th className="p-3.5 text-center font-bold">Total</th>
                <th className="p-3.5 text-center">Grade</th>
                <th className="p-3.5 text-center">Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {results.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-mono font-bold text-blue-600">
                    {res.courseCode}
                  </td>
                  <td className="p-3.5 text-slate-800 font-semibold">
                    {res.courseTitle}
                  </td>
                  <td className="p-3.5 text-center text-slate-600">{res.creditHours}</td>
                  <td className="p-3.5 text-center text-slate-700">{res.midtermMarks}</td>
                  <td className="p-3.5 text-center text-slate-700">{res.finalMarks}</td>
                  <td className="p-3.5 text-center text-slate-700">{res.assignmentMarks}</td>
                  <td className="p-3.5 text-center text-slate-700">{res.attendanceMarks}</td>
                  <td className="p-3.5 text-center font-black text-slate-900">{res.totalMarks}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-black text-xs">
                      {res.grade}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                    {res.gradePoint.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Grading Matrix Reference */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
        <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>City University Grading Standard (UGC Benchmark)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[11px]">
          {gradingScale.map((item) => (
            <div key={item.letter} className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-sm text-slate-800 block">{item.letter}</span>
              <span className="text-slate-500 block text-[10px]">{item.point} GP</span>
              <span className="text-[9px] text-slate-400 block">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
