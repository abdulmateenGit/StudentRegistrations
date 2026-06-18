import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const userSupabase = await createClient();

    const { data: userData, error: userError } = await userSupabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
    }

    const user = userData?.user;
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const insertPayload = {
      user_id: user.id,
      student_name: body.studentName,
      dob: body.dob,
      parent_name: body.parentName,
      parent_cnic: body.parentCnic,
      student_contact: body.studentContact,
      parent_contact: body.parentContact,
      class: body.class,
      registration_fee: body.registrationFee,
      registration_date: body.registrationDate,
      metadata: {
        timestamp: body.timestamp || new Date().toISOString(),
      },
    };

    const db = await createClient();
    const { data, error } = await db.from('registrations').insert([insertPayload]).select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
    }
    const userId = userData?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const id = body.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const updatePayload = {
      student_name: body.studentName,
      dob: body.dob,
      parent_name: body.parentName,
      parent_cnic: body.parentCnic,
      student_contact: body.studentContact,
      parent_contact: body.parentContact,
      class: body.class,
      registration_fee: body.registrationFee,
      registration_date: body.registrationDate,
      metadata: body.metadata ?? { updated_at: new Date().toISOString() },
    };

    const db = await createClient();
    const { data, error } = await db
      .from('registrations')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Registration not found or permission denied' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('API PUT error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
    }
    if (!userData?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const db = await createClient();
    const { data, error } = await db
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error('API GET error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
    }
    const userId = userData?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const db = await createClient();
    const { data, error } = await db
      .from('registrations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Registration not found or permission denied' }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error('API DELETE error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
