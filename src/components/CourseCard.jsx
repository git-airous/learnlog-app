
const CourseCard = ({ course, onUpdate, onDelete, onEdit, onMarkAsDone }) => {
  // Local state to track checkpoints for visual progress
  const checkpoints = course.checkpoints || [];

  // Compute visual progress percent based on checked checkpoints
  const completedCount = checkpoints.filter(cp => cp.completed).length;
  const totalCount = checkpoints.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Handle individual checkpoint toggle
  const toggleCheckpoint = (index) => {
    const updated = checkpoints.map((cp, i) =>
      i === index ? { ...cp, completed: !cp.completed } : cp
    );
    onUpdate({ ...course, checkpoints: updated });
  };

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Determine card background based on due date
  const today = new Date();
  const dueDateObj = course.dueDate ? new Date(course.dueDate) : null;

  let cardBgClass = 'bg-white dark:bg-gray-800';
  if (dueDateObj) {
    const isToday = dueDateObj.toDateString() === today.toDateString();
    const isPast = dueDateObj < today;

    if (isToday) cardBgClass = 'bg-yellow-200 dark:bg-yellow-700';
    else if (isPast) cardBgClass = 'bg-red-200 dark:bg-red-900';
  }


  return (
    <div
      className={`p-6 rounded-3xl shadow-md transform transition-all duration-300 hover:scale-102 hover:shadow-xl ${cardBgClass}`}
    >

    {/* Title */}
    <h3
      className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 truncate line-clamp-2 cursor-pointer"
      title={course.name}>
      {course.name}
    </h3>

    {/* Description */}
    {course.description && (
      <div
        className="text-gray-500 dark:text-gray-400 mb-2 break-all max-h-16 overflow-y-scroll"
      >
        {course.description}
      </div>
    )}


    {/* Date */}
    {course.dueDate && (
      (() => {
        const today = new Date();
        const dueDateObj = new Date(course.dueDate);

        let dateTextClass = 'text-green-600 dark:text-green-300';
        if (dueDateObj.toDateString() === today.toDateString()) dateTextClass = 'text-yellow-700 dark:text-yellow-500';
        else if (dueDateObj < today) dateTextClass = 'text-red-700 dark:text-red-300';

        return (
          <p className={`text-sm mb-2 ${dateTextClass}`}>
            Due: {formatDate(course.dueDate)}
          </p>
        );
      })()
    )}

    {/* Checkpoints */}
    {checkpoints.length > 0 && (
      <div className="mb-3 max-h-24 overflow-auto">
        {checkpoints.map((cp, idx) => (
          <div key={idx} className="flex items-center mb-1 wrap-break-words">
            <input
              type="checkbox"
              checked={!!cp.completed}
              onChange={() => toggleCheckpoint(idx)}
              className="mr-2"
            />
            <span className={cp.completed ? 'line-through text-gray-400 wrap-break-word' : 'wrap-break-word'}>
              {cp.name}
            </span>
          </div>
        ))}
      </div>
    )}

    {/* Visual Progress Bar */}
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-3">
      <div
        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Progress: {progressPercent}%</p>

    {/* Action Buttons */}
    <div className="flex justify-between items-center">
      <div className="space-x-2">
        <button
          onClick={() => onEdit(course)}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 active:scale-95 transition duration-300 ease-in-out transform"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 active:scale-95 transition duration-300 ease-in-out transform">
          Delete
        </button>
      </div>

      <button
        onClick={() => onMarkAsDone(course.id)}
        className={`px-3 py-1 rounded-lg text-white transition ${
          progressPercent === 100 || checkpoints.length === 0
            ? 'bg-green-600 hover:bg-green-700 active:scale-95 transition duration-300 ease-in-out transform'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!(progressPercent === 100 || checkpoints.length === 0)}
      >
        Mark as Done
      </button>
    </div>
  </div>
  );
};

export default CourseCard;
