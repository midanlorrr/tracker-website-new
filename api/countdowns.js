import { createClient } from '@supabase/supabase-js'

const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
    const { method } = req

    if (method === 'GET') {
        const { data, error } = await db.from('countdowns').select('*')
        console.log('server GET\n', data, ' END');
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
    }

    if (method === 'POST') {
        console.log([req.body]);
        const { data, error } = await db.from('countdowns').insert([req.body]).select().single();
        console.log('server POST\n', ' END');
        // if (error) return res.status(500).json(error);
        if (error) return console.log(error);
        return res.status(200).json(data);
    }

    if (method === 'PATCH') {
        const { id, ...updates } = req.body;
        const { data, error } = await db.from('countdowns').update(updates).eq('id', id);
        console.log('server PATCH\n', data, ' END');
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
    }

    if (method === 'DELETE') {
        const { id } = req.body;
        const { data, error } = await db.from('countdowns').delete().eq('id', id);
        console.log('server DELETE\n', data, ' END');
        if (error) return res.status(500).json(error)
        return res.status(200).json(data)
    }
}