import { Loader } from "lucide-react";

const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader size={20} className="animate-spin text-green-700" />
    </div>
  );
};

export default loading;
