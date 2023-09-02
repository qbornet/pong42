export class ValidationException extends Error {
  constructor(public validationErrors: string[]) {
    super();
  }
}

export default {};
