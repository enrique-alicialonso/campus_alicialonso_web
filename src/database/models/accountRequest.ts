import {
  FirestoreDocument,
  ACCOUNT_REQUEST_STATE,
  DEPARTMENT_VALUES,
  PROGRAM_VALUES,
  SharedDocumentValidator,
} from '../common';

export interface AccountRequestModel extends FirestoreDocument {
  /** ID of the department the user belongs to */
  department: keyof typeof DEPARTMENT_VALUES;
  /** Generated institutional email address for the user */
  generatedEmail: string;
  /** Personal email address of the user */
  personalEmail?: string;
  /** Name of the user */
  name: string;
  /** Surnames of the user */
  familyName: string;
  /** National ID of the user */
  nationalId?: string;
  /** Academic program the user is enrolled in */
  program: keyof typeof PROGRAM_VALUES;
  /** Current state of the account request */
  state: keyof typeof ACCOUNT_REQUEST_STATE;
}

export class AccountRequestValidator extends SharedDocumentValidator<AccountRequestModel> {
  validateModel(data: unknown): data is AccountRequestModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: AccountRequestModel) {
    // TODO: Implement validation for create logic
    return data ? { isValid: true, errors: [] } : { isValid: false, errors: ['Invalid data'] };
  }

  protected validateUpdateImpl(data: Partial<AccountRequestModel>) {
    // TODO: Implement validation for update logic
    return data ? { isValid: true, errors: [] } : { isValid: false, errors: ['Invalid data'] };
  }
}

export const accountRequestValidator = new AccountRequestValidator();
