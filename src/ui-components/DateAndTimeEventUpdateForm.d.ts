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
export declare type DateAndTimeEventUpdateFormInputValues = {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    name?: string;
    desc?: string;
    username?: string;
};
export declare type DateAndTimeEventUpdateFormValidationValues = {
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    startTime?: ValidationFunction<string>;
    endTime?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    desc?: ValidationFunction<string>;
    username?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DateAndTimeEventUpdateFormOverridesProps = {
    DateAndTimeEventUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    startTime?: PrimitiveOverrideProps<TextFieldProps>;
    endTime?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    desc?: PrimitiveOverrideProps<TextFieldProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DateAndTimeEventUpdateFormProps = React.PropsWithChildren<{
    overrides?: DateAndTimeEventUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    dateAndTimeEvent?: any;
    onSubmit?: (fields: DateAndTimeEventUpdateFormInputValues) => DateAndTimeEventUpdateFormInputValues;
    onSuccess?: (fields: DateAndTimeEventUpdateFormInputValues) => void;
    onError?: (fields: DateAndTimeEventUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DateAndTimeEventUpdateFormInputValues) => DateAndTimeEventUpdateFormInputValues;
    onValidate?: DateAndTimeEventUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DateAndTimeEventUpdateForm(props: DateAndTimeEventUpdateFormProps): React.ReactElement;
