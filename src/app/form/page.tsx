"use client";
import { useFieldArray, useForm } from "react-hook-form";
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

	const lens = useLens({ control: form.control });
	const children = lens.focus("children");
	const { fields: childrenFields } = useFieldArray(children.interop());

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
				<div>
					<TypographyH3>Person</TypographyH3>
					<PersonForm
						lens={lens.reflect((l) => ({
							name: l.focus("firstName"),
							surname: l.focus("lastName"),
						}))}
					/>
				</div>

				{children.map(childrenFields, (l, key, index) => (
					<div key={key}>
						<TypographyH3>Child {index + 1}</TypographyH3>
						<PersonForm lens={l} />
					</div>
				))}

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

function PersonForm({
	lens,
}: {
	lens: Lens<{ name: string; surname: string }>;
}) {
	return (
		<>
			<StringInput lens={lens.focus("name")} label="Name" />
			<StringInput lens={lens.focus("surname")} label="SurName" />
		</>
	);
}

function StringInput({
	lens,
	label,
}: {
	lens: Lens<string>;
	label?: ReactNode;
}) {
	const { control, name } = lens.interop((ctrl, name) => ({
		control: ctrl,
		name,
	}));
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
