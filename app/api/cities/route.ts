import { NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'

export async function GET() {
  try {
    // In a real implementation, this would query Supabase for cities with vector data
    // For now, return static data
    const cities = [
      "New York",
      "London",
      "Tokyo",
      "Paris",
      "Sydney",
      "Berlin",
      "Rome",
      "Amsterdam",
      "Barcelona",
      "Singapore"
    ];

    return NextResponse.json({ cities })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}
