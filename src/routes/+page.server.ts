import { supabase } from '$lib/supabase';

export async function load() {
	const { data } = await supabase.from('drivers').select('*');
	return {
		supabase: data?.reverse() ?? []
	};
}
