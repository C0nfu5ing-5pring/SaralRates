import { PuffLoader } from "react-spinners";

export default function LoadingState() {
  return (
    <div className="flex flex-col justify-center h-[80vh] items-center">
      <PuffLoader color="gray" size={120} />
      <p className="text-[var(--text)] animate-pulse">
        Fetching mandi prices...
      </p>
      <p className="animate-pulse text-[var(--text)]">
        This might take a while
      </p>
    </div>
  );
}
