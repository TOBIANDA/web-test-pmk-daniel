export type FormFieldType = 
  | "text" 
  | "textarea" 
  | "radio" 
  | "checkbox" 
  | "select" 
  | "file" 
  | "date";

export type ValidationRuleType =
  | "number"
  | "email"
  | "url"
  | "phone"
  | "min_length"
  | "max_length"
  | "min_value"
  | "max_value"
  | "regex"
  | "min_checked"
  | "max_checked"
  | "min_date"
  | "max_date";

export interface FieldValidation {
  type: ValidationRuleType;
  value?: string;        // threshold value (e.g. "8" for min_length:8)
  errorMessage?: string; // custom error message shown to respondent
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  helpText?: string;
  validation?: FieldValidation; // NEW: optional validation rule
}

export interface DynamicForm {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fields_schema: FormField[];
  is_active: number;
  submission_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DynamicFormCreateInput {
  title: string;
  slug?: string;
  description?: string;
  fields_schema: FormField[];
  is_active?: number;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  answers: Record<string, any>;
  submitted_at: string;
}

export interface FormSubmissionPayload {
  answers: Record<string, any>;
}
