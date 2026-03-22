import { getURL, getKEY } from "./config.js";

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';  // from the CDN global
const supabase = createClient(getURL(), getKEY());

export async function loadData() {
    const { data, error } = await supabase.from('countdowns').select('*');
    if (error) console.log(error);
    return data;
};

export async function saveCountdownToDB(defaultObject) {
    const { title, due_date, type, mode } = defaultObject;
    const { data, error } = await supabase.from('countdowns')
        .insert([
            {
                title: title,
                due_date: due_date,
                type: type,
                mode: mode
            }
        ]).select().single();
    return data;
}

export async function updateCountdownToDB(id, updates) {
    const { data, error } = await supabase.from('countdowns').update(updates).eq('id', id);
}

export async function deleteCountdownFromDB(id) {
    const { data, error } = await supabase.from('countdowns').delete().eq('id', id);
}