import React, { useState, useRef, useEffect } from 'react';
import ProgressCard from '../components/ProgressCard';
import CourseCard from '../components/CourseCard';
import ProgressChart from '../components/ProgressChart';

const Dashboard = () => {

  // Refs for modal input fields --X--X--
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const dueDateRef = useRef(null);


  // State --X--X--
  const [courses, setCourses] = useState(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem('courses');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error reading localStorage:", err);
      return [];
    }
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    dueDate: '',
    checkpoints: [],
    progress: 0,
  });

  const [editCourse, setEditCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // Focus title input when modal opens --X--X--
  useEffect(() => {
    if (showModal && titleRef.current) {
      titleRef.current.focus();
    }
  }, [showModal]);


  // Helper: Calculate overall progress for active courses  --X--X--
  const calculateOverallProgress = () => {
    const activeCourses = courses.filter(c => !c.isCompleted);
    if (activeCourses.length === 0) return 0;

    const totalProgress = activeCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    return Math.round(totalProgress / activeCourses.length);
  };
  const overallProgress = calculateOverallProgress();


  // Helper: Format date as DD/MM/YYYY --X--X--
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  // Load courses from localStorage on mount --X--X--
  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      const parsed = JSON.parse(savedCourses);
      const normalized = parsed.map(course => ({
        id: course.id,
        name: course.name ?? '',
        description: course.description ?? '',
        dueDate: course.dueDate ?? '',
        checkpoints: (course.checkpoints || []).map(cp => ({
          name: cp.name ?? '',
          completed: !!cp.completed,
        })),
        progress: course.progress ?? 0,
        isCompleted: !!course.isCompleted,
        completedDate: course.completedDate ?? null,
      }));
      setCourses(normalized);
    }
  }, []);


  // Persist courses to localStorage on change --X--X--
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);


  // Handlers --X--X--

  // Add new course
  const handleAddCourse = () => {
    if (!newCourse.name) return;

    const courseToAdd = {
      ...newCourse,
      id: Date.now(),
      checkpoints: newCourse.checkpoints.map(cp => ({ name: cp.name ?? '', completed: false })),
      progress: 0,
      isCompleted: false,
    };

    setCourses([...courses, courseToAdd]);
    setNewCourse({ name: '', description: '', dueDate: '', checkpoints: [], progress: 0 });
    setShowModal(false);
  };

  // Edit existing course
  const handleEditCourse = () => {
    if (!editCourse.name) return;

    const updatedCourses = courses.map(c =>
      c.id === editCourse.id
        ? {
            ...editCourse,
            checkpoints: editCourse.checkpoints.map(cp => ({
              name: cp.name ?? '',
              completed: !!cp.completed,
            })),
            progress: editCourse.progress ?? 0,
            isCompleted: !!editCourse.isCompleted,
          }
        : c
    );

    setCourses(updatedCourses);
    setEditCourse(null);
    setShowModal(false);
  };

  // Delete a course
  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // Mark course as completed
  const handleMarkAsDone = (id) => {
    const updatedCourses = courses.map(c =>
      c.id === id
        ? { ...c, progress: 100, isCompleted: true, completedDate: new Date().toISOString() }
        : c
    );
    setCourses(updatedCourses);
  };


  // JSX --X--X--
  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* Dashboard Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Dashboard Overview
      </h1>

      {/* Overall Progress */}
      <div className="mb-8">
        <ProgressCard progress={overallProgress} className="rounded-3xl w-full" />
      </div>

      {/* Progress Chart */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md transform transition-all duration-300 hover:scale-102 hover:shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Progress Chart</h2>
        {courses.filter(c => !c.isCompleted).length > 0 ? (
          <ProgressChart courses={courses.filter(c => !c.isCompleted)} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No courses to display progress yet.
          </p>
        )}
      </div>

      {/* Active Courses */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Active Courses</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {courses.filter(c => !c.isCompleted).length > 0 ? (
          courses.filter(c => !c.isCompleted).map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={() => handleDeleteCourse(course.id)}
              onUpdate={(updatedCourse) => {
                const completed = updatedCourse.checkpoints.filter(cp => cp.completed).length;
                const total = updatedCourse.checkpoints.length;
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
                setCourses(courses.map(c =>
                  c.id === updatedCourse.id ? { ...updatedCourse, progress } : c
                ));
              }}
              onEdit={() => {
                setEditCourse({
                  ...course,
                  checkpoints: course.checkpoints?.map(cp => ({
                    name: cp.name ?? '',
                    completed: cp.completed ?? false
                  })) || []
                });
                setShowModal(true);
              }}
              onMarkAsDone={() => handleMarkAsDone(course.id)}
              isOverdue={course.dueDate ? new Date(course.dueDate) < new Date() && !course.isCompleted : false}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">
            No active courses yet.
          </p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editCourse ? 'Edit Course' : 'Add New Course'}
            </h2>

            {/* Form Inputs */}
            <div className="space-y-4">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  value={editCourse?.name ?? newCourse.name ?? ''}
                  onChange={e => {
                    if (editCourse) setEditCourse({ ...editCourse, name: e.target.value });
                    else setNewCourse({ ...newCourse, name: e.target.value });
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      descRef.current.focus();
                    }
                  }}
                  placeholder="Enter course name"
                  className="mt-1 block w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  ref={descRef}
                  value={editCourse?.description ?? newCourse.description ?? ''}
                  onChange={e => {
                    if (editCourse) setEditCourse({ ...editCourse, description: e.target.value });
                    else setNewCourse({ ...newCourse, description: e.target.value });
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      dueDateRef.current.focus();
                    }
                  }}
                  placeholder="Optional course description"
                  className="mt-1 block w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  ref={dueDateRef}
                  type="date"
                  value={editCourse?.dueDate ?? newCourse.dueDate ?? ''}
                  onChange={e => {
                    if (editCourse) setEditCourse({ ...editCourse, dueDate: e.target.value });
                    else setNewCourse({ ...newCourse, dueDate: e.target.value });
                  }}
                  className="mt-1 block w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>

              {/* Checkpoints */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Checkpoints</label>
                {(editCourse ? editCourse.checkpoints : newCourse.checkpoints).map((cp, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="checkpoint-input grow p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                      value={cp.name ?? ''}
                      onChange={e => {
                        if (editCourse) {
                          const updated = [...editCourse.checkpoints];
                          updated[i].name = e.target.value;
                          setEditCourse({ ...editCourse, checkpoints: updated });
                        } else {
                          const updated = [...newCourse.checkpoints];
                          updated[i].name = e.target.value;
                          setNewCourse({ ...newCourse, checkpoints: updated });
                        }
                      }}
                      placeholder={`Checkpoint ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editCourse) {
                          setEditCourse({ ...editCourse, checkpoints: editCourse.checkpoints.filter((_, idx) => idx !== i) });
                        } else {
                          setNewCourse({ ...newCourse, checkpoints: newCourse.checkpoints.filter((_, idx) => idx !== i) });
                        }
                      }}
                      className="text-red-500 hover:text-red-700 active:scale-95 transition duration-300 ease-in-out transform">
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (editCourse) setEditCourse({ ...editCourse, checkpoints: [...editCourse.checkpoints, { name: '' }] });
                    else setNewCourse({ ...newCourse, checkpoints: [...newCourse.checkpoints, { name: '' }] });
                  }}
                  className="text-indigo-600 hover:text-indigo-800 text-sm mt-1 active:scale-95 transition duration-300 ease-in-out transform">
                  + Add Checkpoint
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={editCourse ? handleEditCourse : handleAddCourse}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition duration-300 ease-in-out transform">
                  {editCourse ? 'Save Changes' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditCourse(null);
                    setNewCourse({ name: '', description: '', dueDate: '', checkpoints: [], progress: 0 });
                  }}
                  className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700 active:scale-95 transition duration-300 ease-in-out transform">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Course Button */}
      <button
        onClick={() => { setShowModal(true); setEditCourse(null); }}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-800 active:scale-95 transition duration-300 ease-in-out transform shadow-xl z-50"
      >
        + Add Course
      </button>

      {/* Recently Completed Courses */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-5">Recently Completed</h2>
      <div className="grid grid-cols-1 gap-4 mb-8 w-full">
        {courses.filter(c => c.isCompleted).length > 0 ? (
          courses
            .filter(c => c.isCompleted)
            .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
            .slice(0, 5)
            .map(course => (
              <div key={course.id} className="relative bg-green-200 dark:bg-green-900 p-5 rounded-3xl shadow-md w-full z-0 overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-xl">
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-300 font-bold text-xl">
                  ×
                </button>

                <h3 className="text-lg font-bold text-green-700 dark:text-green-200 truncate line-clamp-2 cursor-pointer" title={course.name}>
                  {course.name}
                </h3>
                {course.description && <p className="text-gray-700 dark:text-gray-300 mt-1 break-all max-h-16 overflow-y-scroll">{course.description}</p>}
                {course.completedDate && <p className="text-sm text-green-600 dark:text-green-300 mt-1">Completed: {formatDate(course.completedDate)}</p>}
                {course.dueDate && <p className="text-sm text-green-600 dark:text-green-300 mt-1">Due: {formatDate(course.dueDate)}</p>}
              </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">
            No recently completed courses yet.
          </p>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
