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
export declare type DateEventUpdateFormInputValues = {
    startDateTime?: string;
    endDateTime?: string;
    name?: string;
    desc?: string;
    username?: string;
};
export declare type DateEventUpdateFormValidationValues = {
    startDateTime?: ValidationFunction<string>;
    endDateTime?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    desc?: ValidationFunction<string>;
    username?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DateEventUpdateFormOverridesProps = {
    DateEventUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    startDateTime?: PrimitiveOverrideProps<TextFieldProps>;
    endDateTime?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    desc?: PrimitiveOverrideProps<TextFieldProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DateEventUpdateFormProps = React.PropsWithChildren<{
    overrides?: DateEventUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    dateEvent?: any;
    onSubmit?: (fields: DateEventUpdateFormInputValues) => DateEventUpdateFormInputValues;
    onSuccess?: (fields: DateEventUpdateFormInputValues) => void;
    onError?: (fields: DateEventUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DateEventUpdateFormInputValues) => DateEventUpdateFormInputValues;
    onValidate?: DateEventUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DateEventUpdateForm(props: DateEventUpdateFormProps): React.ReactElement;
