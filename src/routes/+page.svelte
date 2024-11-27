<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { LoaderCircle, Pencil, PictureInPicture2, Trash2 } from 'lucide-svelte';
	import UserPlus from 'lucide-svelte/icons/user-plus';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { toast } from 'svelte-sonner';
	import { supabase } from '$lib/supabase.js';
	import { onMount } from 'svelte';
	export let data;

	let driverObjects: any = {
		id: { label: 'ID', placeholder: '1' },
		vu: { label: 'ВУ', placeholder: '88 88 888888' },
		name: { label: 'ФИО', placeholder: 'Архипов Василий Максимович' },
		driver_address: {
			label: 'Дата рождения и адрес',
			placeholder: '12.12.1997, 2987, Калининград'
		},
		date_of_issue: {
			label: 'Дата выдачи',
			placeholder: '12.12.2022'
		},
		validity_period: {
			label: 'Срок действия',
			placeholder: '12.12.2028'
		},
		categoryes: {
			label: 'Котегория',
			placeholder: 'A, B, C, D'
		},
		restrictions: {
			label: 'Ограничения',
			placeholder: ''
		},
		violations: {
			label: 'Нарушения',
			placeholder: ''
		},
		search: {
			label: 'Розыск',
			placeholder: ''
		}
	};

	let currentDriver: DriverType | any = null;

	async function openChangeDriver(id: number) {
		const driver = data.supabase.find((el) => el.id == id);

		currentDriver = { ...(driver as any) };
	}

	let isSaving = false;
	let closeButton: any = null;
	let isDialog = false;
	let employee = '';

	onMount(() => {
		employee = JSON.parse(localStorage.getItem('employee') || '');
	});

	async function handleSave() {
		isSaving = true;

		try {
			const { error } = await supabase
				.from('drivers')
				.update(currentDriver)
				.eq('id', currentDriver.id);
			if (error) {
				throw new Error(JSON.stringify(error));
			}
			closeButton.click();
			data.supabase = data.supabase.map((item) =>
				item.id == currentDriver.id ? currentDriver : item
			);

			toast.success('Успешно!', {
				description: 'Данные успешно сохранились.'
			});
		} catch (error: any) {
			toast.error('Ошибка при обновлений данных', {
				description: JSON.stringify(error)
			});
		} finally {
			isSaving = false;
		}
	}

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				currentDriver.picture = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDeleteDriver = async () => {
		try {
			const { error } = await supabase.from('drivers').delete().eq('id', currentDriver.id);
			if (error) {
				throw new Error(JSON.stringify(error));
			}
			data.supabase = data.supabase.filter((item) => item.id !== currentDriver.id);
			toast.success('Успешно удален', {
				description: ''
			});
		} catch (error) {
			toast.error('Ошибка при удалении водителя', {
				description: JSON.stringify(error)
			});
		}
	};

	const handleEmployee = () => {
		localStorage.setItem('employee', JSON.stringify(employee));
	};
</script>

<Dialog.Dialog open={isDialog} onOpenChange={(state) => (isDialog = state)}>
	<AlertDialog.Root>
		<Sheet.Sheet>
			<div class=" flex h-screen w-full flex-col items-center">
				<div class="mx-auto flex w-[90%] justify-center">
					<div class="flex w-[550px] flex-col gap-1">
						<h3 class="scroll-m-20 text-center text-2xl font-semibold tracking-tight">
							Лист водителей
						</h3>
						<a
							href="/create"
							class="mx-auto mt-1 flex w-full justify-center gap-1 rounded-md border px-2 py-1"
							><UserPlus />
							<p>Создать новый</p></a
						>

						{#if data.supabase.length == 0}
							<p class="text-sm font-medium leading-none">Нет данных</p>
						{:else}
							{#each data.supabase as HomeDriverType[] as driver}
								<div
									class="flex min-h-[40px] w-full cursor-pointer items-center justify-between rounded-sm border px-2 py-1"
								>
									<div class="title">
										<small class="text-sm font-medium leading-none">ВУ: {driver.vu}</small>
										<div class="flex items-center gap-1">
											<p class="text-sm text-muted-foreground">ФИО:</p>
											<p class="text-sm font-medium leading-none">{driver.name}</p>
										</div>
									</div>
									<div>
										<Button
											variant="ghost"
											size="icon"
											title="открыть как модальный окно"
											on:click={() => {
												openChangeDriver(driver.id);
												isDialog = true;
											}}
											><PictureInPicture2 />
										</Button>

										<Sheet.Trigger>
											<Button
												on:click={() => openChangeDriver(driver.id)}
												title="изменить данные"
												size="icon"
												variant="ghost"><Pencil /></Button
											>
										</Sheet.Trigger>
										<AlertDialog.Trigger>
											<Button
												on:click={() => openChangeDriver(driver.id)}
												title="удалить"
												size="icon"
												variant="ghost"><Trash2 color="#e00000" /></Button
											>
										</AlertDialog.Trigger>
									</div>
								</div>
							{/each}
						{/if}

						<div class="mt-4 flex flex-col gap-2">
							<Label for="employee" class="text-left">Сотрудник</Label>
							<Input
								id="employee"
								class="col-span-3"
								placeholder="Полковник ДПС Архипов Б В"
								bind:value={employee}
							/>
							<Button on:click={handleEmployee} variant="outline">Сохранить</Button>
						</div>
						<a href="/interface" class="mx-auto mt-1 w-full rounded-md border px-2 py-1 text-center"
							>В интерфейс</a
						>
					</div>
				</div>
			</div>

			<Sheet.Content class="min-w-[500px] overflow-auto" side="right">
				<Sheet.Header>
					<Sheet.Title>Изменения данных</Sheet.Title>
					<Sheet.Description>
						Внесите изменения в даных здесь. Нажмите «Сохранить», когда закончите.
					</Sheet.Description>
				</Sheet.Header>
				<div class="grid gap-4 py-4">
					{#each Object.keys(driverObjects) as driverObject}
						{#if !driverObjects[driverObject].placeholder}
							<div class="flex gap-2">
								<Checkbox bind:checked={currentDriver[driverObject as any]} />
								<Label for={driverObject} class="text-left"
									>{driverObjects[driverObject].label}</Label
								>
							</div>
						{:else}
							<div class="flex flex-col gap-2">
								<Label for={driverObject} class="text-left"
									>{driverObjects[driverObject].label}</Label
								>
								<Input
									disabled={driverObject == 'id'}
									id={driverObject}
									class="col-span-3"
									placeholder={driverObjects[driverObject].placeholder}
									bind:value={currentDriver[driverObject as any]}
								/>
							</div>
						{/if}
					{/each}
					<div class="flex w-full max-w-sm items-center gap-1.5">
						<Label for="picture">Фото</Label>
						<Input id="picture" type="file" on:change={handleFileChange} />
					</div>
				</div>
				<Sheet.Footer>
					<Button class="flex gap-1" disabled={isSaving} on:click={handleSave}
						>{#if isSaving}
							<LoaderCircle class="animate-spin" />
							Сохранение...
						{:else}
							Сохранить
						{/if}</Button
					>
					<Sheet.Close>
						<button bind:this={closeButton} style="display: none;">close</button>
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Sheet>

		<Dialog.Content class="sm:max-w-[825px]">
			<Dialog.Header>
				<Dialog.Title>Данные водителя</Dialog.Title>
			</Dialog.Header>
			<div class="flex gap-3 py-4">
				<img class="max-w-[240px]" src={currentDriver.picture} alt="" />
				<div class="flex flex-col">
					<p class="leading-7 [&:not(:first-child)]:mt-1">
						ID: {currentDriver.id}
					</p>
					{#each Object.keys(currentDriver) as driver}
						{#if currentDriver[driver] === false || currentDriver[driver] === true}
							<p class="leading-7 [&:not(:first-child)]:mt-1">
								{driverObjects[driver]?.label}: {currentDriver[driver] === true
									? 'ИМЕЮТСЯ'
									: 'НЕ ОБНАРУЖЕНО'}
							</p>
						{:else if driver !== 'picture' && driver !== 'id'}
							<p class="leading-7 [&:not(:first-child)]:mt-1">
								{driverObjects[driver]?.label}: {currentDriver[driver]}
							</p>
						{/if}
					{/each}
				</div>
			</div>
		</Dialog.Content>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Подверждения удаления</AlertDialog.Title>
				<AlertDialog.Description>
					После того, как вы нажмете «Удалить», данные водителя будут удалены навсегда и
					восстановить их будет невозможно.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Закрыть</AlertDialog.Cancel>
				<AlertDialog.Action on:click={handleDeleteDriver}>Удалить</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Dialog.Dialog>
<Toaster />
