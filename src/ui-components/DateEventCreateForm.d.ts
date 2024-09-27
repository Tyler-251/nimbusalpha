/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type DateEventCreateFormInputValues = {
    startDate?: string;
    endDate?: string;
    name?: string;
    desc?: string;
    username?: string;
};
export declare type DateEventCreateFormValidationValues = {
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    desc?: ValidationFunction<string>;
    username?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DateEventCreateFormOverridesProps = {
    DateEventCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    desc?: PrimitiveOverrideProps<TextFieldProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DateEventCreateFormProps = React.PropsWithChildren<{
    overrides?: DateEventCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: DateEventCreateFormInputValues) => DateEventCreateFormInputValues;
    onSuccess?: (fields: DateEventCreateFormInputValues) => void;
    onError?: (fields: DateEventCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DateEventCreateFormInputValues) => DateEventCreateFormInputValues;
    onValidate?: DateEventCreateFormValidationValues;
} & React.CSSProperties>;
export default function DateEventCreateForm(props: DateEventCreateFormProps): React.ReactElement;
