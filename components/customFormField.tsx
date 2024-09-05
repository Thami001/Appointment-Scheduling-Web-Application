import React from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Control} from "react-hook-form";
import {FormFieldType} from "@/components/forms/clientForm";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import 'react-datepicker/dist/react-datepicker.css'
import {E164Number} from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";


interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string
    showTimeSelect?:boolean
    children?: React.ReactNode
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({field, props} : {field: any; props : CustomProps}) => {
    const {fieldType, iconAlt, iconSrc, placeholder, showTimeSelect, dateFormat, renderSkeleton} = props;

   switch(fieldType){
       case FormFieldType.INPUT:
           return (
               <div className={"flex rounded-md border-dark-500 bg-dark-400"}>
                   {iconSrc && (
                       <Image src={iconSrc} alt={iconAlt || 'icon'} height={24} width={24} className={"ml-2"}/>
                   )}
                   <FormControl>
                       <Input placeholder={placeholder} className={"shad-input border-0"} {...field}/>
                   </FormControl>
               </div>
           )
       case FormFieldType.TEXTAREA:
           return (
               <FormControl>
                   <Textarea placeholder={placeholder} {...field} className={"shad-textArea"} disabled={props.disabled}>

                   </Textarea>
               </FormControl>
           )
       case FormFieldType.PHONE_INPUT:
           return (
               <FormControl>
                   <PhoneInput className={"input-phone"} placeholder={placeholder} onChange={field.onChange} defaultCountry={"ZA"} international withCountryCallingCode value={field.value as E164Number | undefined}/>
               </FormControl>
           )
       case FormFieldType.DATE_PICKER:
           return (
               <div className={"flex rounded-md border border-dark-500 bg-dark-400"}>
                   <Image src={"/assets/icons/calendar.svg"} alt={"Calendar"} height={24} width={24} className={"ml-2"}/>
                   <FormControl>
                       <DatePicker wrapperClassName={"date-picker"} selected={field.value} onChange={(date) => field.onChange(date)} dateFormat={dateFormat ?? 'dd/MM/yyyy'} showTimeSelect={showTimeSelect ?? false} timeInputLabel={"Time:"}/>
                   </FormControl>
               </div>
           )
       case FormFieldType.SKELETON:
           return (
               renderSkeleton ? renderSkeleton(field) : null
           )
       case FormFieldType.SELECT:
           return (
               <FormControl>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                           <SelectTrigger className={"shad-select-trigger"}>
                               <SelectValue placeholder={placeholder}/>
                           </SelectTrigger>
                       </FormControl>
                       <SelectContent className={"shad-select-content"}>
                           {props.children}
                       </SelectContent>
                   </Select>
               </FormControl>
           )
       case FormFieldType.CHECKBOX:
           return (
               <FormControl>
                   <div className={"flex items-center gap-4"}>
                       <Checkbox id={props.name} checked={field.value} onCheckedChange={field.onChange}/>
                       <Label htmlFor={props.name} className={"checkbox-label"}>
                           {props.label}
                       </Label>
                   </div>
               </FormControl>
           )

       default:
           break
   }

}

const CustomFormField = (props: CustomProps) => {
    const {control, fieldType, name, label} = props

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={"flex-1"}>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}

                    <RenderField field={field} props={props} />
                    <FormMessage className={"shad-error"}/>
                </FormItem>
            )}
        />
    );
};

export default CustomFormField;