import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type DataUser = { img: string; username: string; uuid: string };

interface ProfilePictureProps {
  imagePreview: string | null;
}

export function ProfilePicture({ imagePreview }: ProfilePictureProps) {
  const [data, setData] = useState<DataUser | null>(null);

  useEffect(() => {
    if (!data) {
      const jwt = localStorage.getItem('jwt');

      const fetchData = async () => {
        const config: AxiosRequestConfig = {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwt}` }
        };
        const dataUser: DataUser = await axios
          .get(`${CONST_BACKEND_URL}/img/download`, config)
          .then((res: AxiosResponse) => res.data);

        setData(dataUser);
      };

      fetchData();
    }
  }, [data]);
  return (
    <div className="z-[2]">
      <img
        className="h-16 w-16 rounded-full border-[2px] border-profile-purple md:h-24 md:w-24 md:border-[3px]"
        src={!imagePreview ? data?.img : imagePreview}
        alt="pp"
      />
    </div>
  );
}
