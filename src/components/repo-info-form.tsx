import { useState } from "react";
import { FiUnlock, FiLock } from "react-icons/fi";
import automateScript, { type FormDataType } from "../lib/automate-script";
import LoadingSpinner from "../lib/loading-spinner";
import { useGlobalContext } from "../context/context";
import { MdOutlineContentCopy } from "react-icons/md";

const RepoInfoForm = () => {
  const [repoName, setRepoName] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setErrorMessage } = useGlobalContext();
  const [remoteUrl, setRemoteUrl] = useState("");
  const [visibility, setVisibility] = useState("private");

  const repoNameHandler = (value: string) => {
    const regex = /^[A-Za-z0-9._-]+$/;
    setRepoName(value);

    if (!regex.test(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      const remoteUrl = await automateScript({
        formData: data as FormDataType,
      });
      if (remoteUrl) {
        setRemoteUrl(remoteUrl);
        setRepoName("");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {remoteUrl ? (
        <div className="flex flex-col items-center w-full">
          <p className="text-green-500">Repository created successfully</p>
          <p className="whitespace-normal flex gap-3 items-center">
            {`${remoteUrl}.git`}{" "}
            <MdOutlineContentCopy
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(`${remoteUrl}.git`)}
            />
          </p>
          <span className="text-[10px] my-2 text-center">(remote url)</span>
          <button
            onClick={() => setRemoteUrl("")}
            className="my-2 p-2 w-full bg-black flex justify-center text-white rounded-md outline-none"
          >
            Create new repository
          </button>
        </div>
      ) : (
        <form onSubmit={submitHandler} className="flex flex-col w-full">
          <input
            placeholder="Repository Name"
            value={repoName}
            name="repo-name"
            autoComplete="off"
            onChange={(e) => repoNameHandler(e.target.value)}
            className="border border-slate-300 w-full rounded-md py-2 px-3 outline-none"
          />
          {error && (
            <p className="text-red-500 text-[10px]">
              ASCII letters, digits, and characters ., -, _ allowed
            </p>
          )}
          <span className="text-xs mt-5">Repository visibility</span>
          <div className="flex gap-5 ml-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="private"
                name="visibility"
                checked={visibility === "private"}
                onChange={() => setVisibility("private")}
                className="accent-black peer"
                value="private"
              />
              <label
                htmlFor="private"
                className="text-slate-400 peer-checked:text-black cursor-pointer flex items-center gap-1"
              >
                <FiLock /> Private
              </label>
            </div>

            <div className="flex items-center gap-3 my-2">
              <input
                type="radio"
                id="public"
                name="visibility"
                className="accent-black peer"
                checked={visibility === "public"}
                onChange={() => setVisibility("public")}
                value="public"
              />
              <label
                htmlFor="public"
                className="flex items-center peer-checked:text-black cursor-pointer gap-1 text-slate-400"
              >
                <FiUnlock className="text-lg" /> Public
              </label>
            </div>
          </div>
          <button
            disabled={error || !repoName || loading}
            className="my-5 p-2 w-full bg-black disabled:cursor-not-allowed flex justify-center disabled:bg-black/30 text-white rounded-md outline-none"
          >
            {loading ? <LoadingSpinner /> : "create"}
          </button>
        </form>
      )}
    </>
  );
};

export default RepoInfoForm;
