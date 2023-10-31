import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

function MatchHistory() {
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const jwt = localStorage.getItem('jwt');
  const decodedToken: DecodedToken = jwt_decode(jwt!);

  function formatUtcPlus1Date(timestamp: Date) {
    const date = new Date(timestamp);
    date.setHours(date.getHours()); // Add 1 hour for UTC+1
    const formattedDate = `
${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}
    ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }
  const { username } = useParams();

  useEffect(() => {
    const url = `${CONST_BACKEND_URL}/user/match-history/${
      !username ? decodedToken.username : username
    }`;

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    axios
      .get(url, config)
      .then((data: any) => {
        setMatchHistory(data.data);
        setLoading(false);
      })
      .catch(() => {});
  }, [username, jwt, decodedToken]);

  if (loading) {
    return <div>Loading match history...</div>;
  }

  return (
    <div className="mt-10 flex text-pong-white">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Status</th>
            <th>Mode</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {matchHistory.map((match: any) => {
            const winOrLoose = () => {
              const name = !username ? decodedToken.username : username;
              if (name === match.playerWin) {
                return 'win';
              }
              return 'loose';
            };

            return (
              <tr key={match.id}>
                <td className="border border-gray-400 p-2">
                  {`${match.playerWin} vs ${match.playerLoose}`}
                </td>
                <td className="border border-gray-400 p-2">{winOrLoose()}</td>
                <td className="border border-gray-400 p-2">{match.mode}</td>
                <td className="border border-gray-400 p-2">
                  {`${match.winnerScore}/${match.looserScore}`}
                </td>
                <td className="border border-gray-400 p-2">
                  {formatUtcPlus1Date(match.timestamp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MatchHistory;
