import RepoInfoForm from "./components/repo-info-form";
import { useGlobalContext } from "./context/context";

function App() {
  const { errorMessage } = useGlobalContext();
  return (
    <div className="w-[300px] h-[400px] flex justify-center p-6 items-center flex-col">
      <div className="flex gap-2 items-center mb-5">
        <img src="/images/icon128.png" className="w-16 mb-2" alt="logo" />
        <h1 className="text-lg w-[150px] -translate-y-2 font-semibold text-center">
          Automate Github Repo Creation
        </h1>
      </div>
      <RepoInfoForm />
      {errorMessage && (
        <p className="text-red-500 -translate-y-2 text-[10px]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default App;
