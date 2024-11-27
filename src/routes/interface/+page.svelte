<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { Clock } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let employee = '';
	let isLoading = false;
	let driver: any = null;
	let vu = '';
	onMount(() => {
		employee = JSON.parse(localStorage.getItem('employee') || '');
	});

	const handleGetDriver = async () => {
		if (!vu) return;
		isLoading = true;
		try {
			const { data, error } = await supabase
				.from('drivers') // Укажите имя таблицы
				.select('*') // Укажите, какие поля выбрать (или * для всех)
				.eq('vu', vu)
				.single(); // Условие: id равен переданному значению
			driver = data;
			console.log(data);

			if (error) {
				alert('Ошибка');
			}
		} catch (error) {
			alert('Ошибка');
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex h-screen w-full flex-col items-center">
	<div class="flex w-full items-center justify-end bg-[#38277d] px-2">
		<img class="max-w-[30px]" src="/assets/fone.png" alt="" />
		<p class="text-neutral-400">{employee}</p>
	</div>
	<div class="w-full bg-[#523ab2]">
		<h1 class="scroll-m-20 text-center text-xl uppercase">
			главная новости отчет проверка водителей
		</h1>
	</div>
	<div class="flex min-h-10 w-full items-center justify-center">
		<span class="h-[1.2px] w-full bg-black"></span>
		<h4 class="text-x absolute bg-white px-1 uppercase">все новости</h4>
		<div class="absolute right-0 w-[540px]">
			<div class="relative z-10 flex w-full items-center">
				<input
					class="w-full rounded-sm border-[1.8px] border-[#523ab2] bg-white px-3 py-1 outline-none"
					type="text"
					placeholder="Введите номер ВУ"
					bind:value={vu}
				/>
				<button
					on:click={handleGetDriver}
					class="absolute right-1 z-10 rounded-full bg-[#523ab2] px-2 py-1 text-white">найти</button
				>
			</div>

			<div class="absolute w-full">
				<div class=" w-full border-b-[2px] border-[red]">
					<h1 class="text-xl">поиск по водителям</h1>
				</div>
				{#if driver !== null}
					<div class="mt-4 flex w-full gap-2 bg-white p-3 shadow-lg">
						<img class="max-h-[180px] max-w-[120px] object-cover" src={driver.picture} alt="" />
						<div class="w-[400px]">
							<div class="w-full bg-green-600 px-1">
								<h1 class="uppercase text-white">Действует</h1>
							</div>
							<div>
								<h3 class="text-x font-semibold">{driver.name}</h3>
								<p>{driver.driver_address}</p>
							</div>
							<div class="mt-2">
								<p>
									ВУ: <span class="text-blue-400"
										>{String(driver.vu)
											.split('')
											.map((el: string, idx: number) => (idx == 1 || idx == 3 ? el + ' ' : el))
											.join('')}</span
									>
									Дата выдачи:
									<span class="text-blue-400">{driver.date_of_issue}</span>
								</p>
								<p>
									Срок действия: <span class="text-blue-400">909923123</span> Категория
									<span class="text-blue-400">{driver.categoryes}</span>
								</p>
							</div>
							<div class="mx-4 mt-3 flex flex-col">
								<span
									class="font-semibold uppercase {driver.restrictions
										? 'text-[red]'
										: 'text-green-500'}"
									>ограничения: {driver.restrictions ? 'имеются' : 'не обнаружено'}</span
								>
								<span
									class="font-semibold uppercase {driver.search ? 'text-[red]' : 'text-green-500'}"
									>розыск: {driver.search ? 'имеются' : 'не обнаружено'}</span
								>
								<span
									class="font-semibold uppercase {driver.violations
										? 'text-[red]'
										: 'text-green-500'}"
									>нарушения: {driver.violations ? 'имеются' : 'не обнаружено'}</span
								>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="flex w-[50%] flex-col gap-4">
		<div class="flex flex-col">
			<div class="flex items-center gap-5">
				<p>05 ноября</p>
				<Clock class="max-h-4 max-w-4" />
				<span> 18:00</span>
			</div>
			<div class="flex w-full gap-3">
				<img
					class="max-w-[150px]"
					src="https://www.m24.ru/b/d/nBkSUhL2hFYgmM63JL6BvMKnxdDs95C-yyqYy7jLs2KQeXqLBmmcmzZh59JUtRPBsdaJqSfJd54qEr7t1mNwKSGK7WY=ji45VI_169hQQgQyP3aWbg.jpg"
					alt=""
				/>
				<p class="max-w-[200px] text-violet-700">
					МВД предупредило об ответственности за участие в незаконных акциях
				</p>
			</div>
		</div>
		<div class="flex flex-col">
			<div class="flex items-center gap-5">
				<p>01 ноября</p>
				<Clock class="max-h-4 max-w-4" />
				<span> 17:00</span>
			</div>
			<div class="flex w-full gap-3">
				<img
					class="max-w-[150px]"
					src="https://cdnn21.img.ria.ru/images/07e6/07/01/1799492249_0:0:3238:1822_1920x0_80_0_0_dbf82253e7417116f8e1e06f1b340148.jpg"
					alt=""
				/>
				<p class="max-w-[200px] text-violet-700">
					В России пока не планируют вводить штрафные баллы за нарушения ПДД
				</p>
			</div>
		</div>
		<div class="flex flex-col">
			<div class="flex items-center gap-5">
				<p>28 октября</p>
				<Clock class="max-h-4 max-w-4" />
				<span> 19:00</span>
			</div>
			<div class="flex w-full gap-3">
				<img
					class="max-w-[150px]"
					src="https://rg.ru/uploads/images/2024/07/03/ria_8672232hr_d48.jpg"
					alt=""
				/>
				<p class="max-w-[200px] text-violet-700">
					Из полномочий полиции в России уберут десятки составов правонарушений
				</p>
			</div>
		</div>
		<a class="w-14 rounded-sm border px-2 py-1" href="/">назад</a>
	</div>
</div>
{#if isLoading}
	<div class="absolute left-0 top-0 flex h-screen w-full justify-center">
		<span class="loader"></span>
	</div>
{/if}

<style>
	.loader {
		margin: auto;
		width: 48px;
		height: 48px;
		border: 8px dotted #523ab2;
		border-radius: 100%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 2s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
