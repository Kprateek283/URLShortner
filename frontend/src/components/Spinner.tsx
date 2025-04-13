const Spinner = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-100 bg-opacity-20">
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
