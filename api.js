import { getURL, getKEY } from "./config.js";

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';  // from the CDN global
const supabase = createClient(getURL(), getKEY());

export async function testGet() {
    const { data, error } = await supabase.from('countdowns').select('*')
    console.log(data)
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