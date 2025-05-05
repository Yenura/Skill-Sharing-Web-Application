export default function LoadingSpinner() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500" />
    </div>
  );
}
