const SUPABASE_URL = "https://ggohaurqbsyamznzuuaf.supabase.co";

const SUPABASE_KEY = "sb_publishable_ZpHvrV-a_BmznhfbVupvxQ_b5NKYPYk";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadSettings() {

    const { data, error } = await supabaseClient
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}
