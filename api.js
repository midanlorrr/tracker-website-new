import { getURL, getKEY } from "./config.js";

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';  // from the CDN global
const supabase = createClient(getURL(), getKEY());

export async function testGet() {
    const { data, error } = await supabase.from('countdowns').select('title').eq('id', '93d7ddc2-2bae-4321-9535-acfc0899b596').single();
    console.log(data?.title, error)
};

export async function testPost() {
    const { data, error } = await supabase.from('countdowns')
        .insert([
        {
            title: 'Test Countdown',
            date: '2026-12-31T00:00:00'
        }
        ])
    console.log(data, error)
}