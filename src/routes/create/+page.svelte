<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { supabase } from '$lib/supabase';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let isCreated = false;

	const newDriver = {
		id: Date.now(),
		vu: '',
		name: '',
		driver_address: '',
		date_of_issue: '',
		validity_period: '',
		categoryes: '',
		restrictions: false,
		violations: false,
		search: false,
		picture: ''
	};

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				(newDriver.picture as any) = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCreate = async () => {
		if (
			newDriver.vu &&
			newDriver.name &&
			newDriver.driver_address &&
			newDriver.date_of_issue &&
			newDriver.categoryes &&
			newDriver.validity_period &&
			newDriver.picture
		) {
			isCreated = true;
			try {
				const { error } = await supabase
					.from('drivers') // Имя таблицы
					.insert([newDriver]);
				if (error) {
					throw new Error(error as any);
				}
				toast.success('Успешно!', {
					description: 'Данные успешно создались.'
				});
			} catch (error: any) {
				toast.error('Ошибка при созданий данных', {
					description: JSON.stringify(error)
				});
			} finally {
				isCreated = false;
			}
		} else {
			alert('Заполните все поля!');
		}
	};
</script>

<div class="flex h-screen w-full justify-center">
	<div class="mx-auto mt-4 w-[50%]">
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Создания данных</h3>
		<div class=" mt-4 flex w-[550px] flex-col gap-3">
			<div class="flex flex-col gap-2">
				<Label class="text-left">ФИО</Label>
				<Input
					class="col-span-3"
					bind:value={newDriver.name}
					placeholder="Архипов Василий Максимович"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<Label class="text-left">ВУ</Label>
				<Input class="col-span-3" bind:value={newDriver.vu} placeholder="88 88 888888" />
			</div>
			<div class="flex flex-col gap-2">
				<Label class="text-left">Дата рождения и адрес</Label>
				<Input
					class="col-span-3"
					bind:value={newDriver.driver_address}
					placeholder="12.12.1997, 2987, Калининград"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<Label class="text-left">Дата выдачи</Label>
				<Input class="col-span-3" bind:value={newDriver.date_of_issue} placeholder="12.12.202" />
			</div>
			<div class="flex flex-col gap-2">
				<Label class="text-left">Срок действия</Label>
				<Input class="col-span-3" bind:value={newDriver.validity_period} placeholder="12.12.2028" />
			</div>
			<div class="flex flex-col gap-2">
				<Label class="text-left">Котегория</Label>
				<Input class="col-span-3" bind:value={newDriver.categoryes} placeholder="A, B, C, D8" />
			</div>
			<div class="flex gap-3">
				<Checkbox bind:checked={newDriver.restrictions} />
				<Label class="text-left">Ограничения</Label>
			</div>
			<div class="flex gap-3">
				<Checkbox bind:checked={newDriver.violations} />
				<Label class="text-left">Нарушения</Label>
			</div>
			<div class="flex gap-3">
				<Checkbox bind:checked={newDriver.search} />
				<Label class="text-left">Розыск</Label>
			</div>
			<div class="flex w-full max-w-sm cursor-pointer items-center">
				<Label for="picture">Фото</Label>
				<Input id="picture" type="file" on:change={handleFileChange} />
			</div>
			<Button
				variant="outline"
				class="flex items-center gap-2"
				disabled={isCreated}
				on:click={handleCreate}
			>
				{#if isCreated}
					<LoaderCircle class="animate-spin" />
					Сохранение...
				{:else}
					Сохранить
				{/if}
			</Button>
			<a class="rounded-sm border px-2 py-1 text-center" href="/">Назад</a>
		</div>
	</div>
</div>
<Toaster />
