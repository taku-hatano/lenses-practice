"use client";
import {
	Control,
	FieldPath,
	FieldValues,
	Path,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { Lens, useLens } from "@hookform/lenses";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface FormSchema {
	firstName: string;
	lastName: string;
	children: {
		name: string;
		surname: string;
	}[];
}

function FormComponent() {
	const form = useForm<FormSchema>({
		defaultValues: {
			firstName: "",
			lastName: "",
			children: [
				{
					name: "",
					surname: "",
				},
				{
					name: "",
					surname: "",
				},
			],
		},
	});

	function onSubmit(data: unknown) {
		toast(
			<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
				<code className="text-white">{JSON.stringify(data, null, 2)}</code>
			</pre>,
		);
	}

	const { fields: childrenFields } = useFieldArray({
		control: form.control,
		name: "children",
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
				<div>
					<TypographyH3>Person</TypographyH3>
					<PersonForm
						control={form.control}
						names={{
							name: "firstName",
							surname: "lastName",
						}}
					/>
				</div>

				{childrenFields.map((field, index) => (
					<div key={field.id}>
						<TypographyH3>Child {index + 1}</TypographyH3>
						<PersonForm
							control={form.control}
							names={{
								name: `children.${index}.name`,
								surname: `children.${index}.surname`,
							}}
						/>
					</div>
				))}

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

function PersonForm<FormSchema extends FieldValues>({
	control,
	names,
}: {
	control: Control<FormSchema>;
	names: {
		name: FieldPath<FormSchema>;
		surname: FieldPath<FormSchema>;
	};
}) {
	return (
		<>
			<StringInput control={control} name={names.name} label="Name" />
			<StringInput control={control} name={names.surname} label="SurName" />
		</>
	);
}

function StringInput<FormSchema extends FieldValues>({
	control,
	name,
	label,
}: {
	control: Control<FormSchema>;
	name: FieldPath<FormSchema>;
	label?: ReactNode;
}) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Input placeholder="shadcn" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function TypographyH3({ children }: { children?: ReactNode }) {
	return (
		<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
			{children}
		</h3>
	);
}

export default FormComponent;
