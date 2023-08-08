export default abstract class SessionStore<IdType = any, SessionType = any> {
  abstract findSession(id: IdType): any;

  abstract saveSession(id: IdType, session: SessionType): any;
  abstract findAllSession(): any;
}
