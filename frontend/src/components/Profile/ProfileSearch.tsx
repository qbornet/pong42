import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, Outlet } from 'react-router-dom';
import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig } from 'axios';
import MatchHistory from './MatchHistory';
import { Background } from '../Background';
import { MainContainer } from '../MainContainer';
import { BannerImage } from '../BannerImage';
import { ProfilePicture } from '../ProfilePicture';
import { BannerInfo } from '../BannerInfo';
import { LeftBlock } from '../LeftBlock';
import { CenterBlock } from '../CenterBlock';
import { RightBlockInvite } from '../RightBlockInvite';

export default function ProfileSearch() {
  const [isFriend, setIsFriend] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const data = useLoaderData() as {
    img: string;
    username: string;
    tofind_uuid: string;
    userFriendList: string[];
  };
  useEffect(() => {
    if (data.userFriendList) {
      const findFriend = data.userFriendList.find(
        (value) => value === data.tofind_uuid
      );
      setIsFriend(findFriend);
    }
  }, [data.tofind_uuid, data.userFriendList]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let newFriendList: string[] = [];
    const jwt = localStorage.getItem('jwt');
    if (!jwt) navigate('/');

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    if (isFriend) {
      newFriendList = data.userFriendList.filter(
        (value) => value !== data.tofind_uuid
      );
      setIsFriend(undefined);
    } else {
      if (data.userFriendList) {
        newFriendList = [
          ...data.userFriendList.filter((value) => value !== data.tofind_uuid),
          data.tofind_uuid
        ];
      } else {
        newFriendList = [data.tofind_uuid];
      }
      setIsFriend(data.tofind_uuid);
    }

    await axios.put(
      `${CONST_BACKEND_URL}/user/update`,
      { friendList: newFriendList },
      config
    );
  };

  return (
    <>
      <Background>
        <MainContainer>
          <BannerImage>
            <ProfilePicture imagePreview={null} />
          </BannerImage>
          <BannerInfo>
            <LeftBlock />
            <CenterBlock />
            <RightBlockInvite
              isFriend={isFriend !== undefined}
              handleClickOption={handleClick}
            />
          </BannerInfo>
          <MatchHistory />
        </MainContainer>
      </Background>
      <Outlet />
    </>
  );
}
