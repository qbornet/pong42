import {
  redirect,
  useRouteError,
  isRouteErrorResponse
} from 'react-router-dom';
import { useRef, useState } from 'react';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import IMAGES from '@img';
import { CONST_BACKEND_URL } from '@constant';
import ErrorCreatePage from './ErrorCreatePage';
import Header from './Header';

// I dont use action for this one because i couldn't find a way to handle file upload with action.
// It probably work i didn't find it, so i tried vanilla react.
export default function UploadImg() {
  const error = useRouteError();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    const jwt = localStorage.getItem('jwt') as string;
    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt}` }
    };

    const result = await axios
      .post(`${CONST_BACKEND_URL}/img/upload`, formData, config)
      .then((response: AxiosResponse) => response.data)
      .catch((axiosError: AxiosError) => {
        if (axiosError.response) {
          const { message } = axiosError.response?.data as { message: string };
          setErrorMsg(message);
          setTimeout(() => {
            setErrorMsg(null);
          }, 5000);
        }
      });

    if (result) redirect('/home');
  };

  if (isRouteErrorResponse(error)) {
    return <ErrorCreatePage />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <div className="flex w-[350px] flex-col items-center justify-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-4 py-10">
        <Header name="Profile Picture" />
        {errorMsg && (
          <div className="mb-2 h-[40px] w-full rounded-[15px] border-none bg-blue-pong-3 p-2">
            <p className="text-center font-roboto text-[14px] font-bold text-red-500">
              {errorMsg}
            </p>
          </div>
        )}
        <label htmlFor="profile-upload">
          <div className="mb-2 mt-4">
            <button type="button" onClick={handleButtonClick}>
              {!image && !imagePreview && (
                <img
                  className="h-32 w-32 overflow-hidden rounded-full border-[1px] border-blue-pong-1 object-cover"
                  id="profile-upload"
                  src={IMAGES.upload}
                  alt="Upload"
                />
              )}
              {image && imagePreview && (
                <img
                  className="h-32 w-32 overflow-hidden rounded-full border-[1px] border-blue-pong-1 object-cover"
                  id="profile-preview"
                  src={imagePreview}
                  alt="ImagePreview"
                />
              )}
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className="hidden"
              ref={fileInputRef}
              id="profile-upload"
              type="file"
              name="image"
              onChange={handleUpload}
            />
            <button
              className="mt-2 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white"
              type="submit"
            >
              Submit
            </button>
          </form>
        </label>
      </div>
    </div>
  );
}
