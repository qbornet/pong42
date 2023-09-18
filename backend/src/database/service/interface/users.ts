import ITwoAuth from './two-auth';
import { UUID } from '../../../utils/types';

export interface IUsers {
  id: UUID;
  email: string;
  username: string;
  password: string;
  apiToken: string;
  twoAuth: ITwoAuth;
}
