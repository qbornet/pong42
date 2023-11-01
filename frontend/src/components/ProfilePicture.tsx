import { useParams } from 'react-router-dom';
import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useJwtContext } from '../contexts/jwt';

type DataUser = { img: string; username: string; uuid: string };

interface ProfilePictureProps {
  imagePreview: string | null;
}

export function ProfilePicture({ imagePreview }: ProfilePictureProps) {
  const [data, setData] = useState<DataUser | null>(null);
  const { jwt, decodedToken } = useJwtContext();
  const { username } = useParams();

  useEffect(() => {
    const fetchData = () => {
      const config: AxiosRequestConfig = {
        withCredentials: true,
        headers: { Authorization: `Bearer ${jwt}` }
      };
      const url = `${CONST_BACKEND_URL}/img/download/${
        !username ? decodedToken.username : username
      }`;
      axios.get(url, config).then((res: AxiosResponse) => setData(res.data));
    };
    fetchData();
  }, [username, data, jwt, decodedToken]);
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
