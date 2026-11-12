import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
	const { data, error } = await supabase
		.from("vehicles")
		.select("*");

	if (error) {
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		success: true,
		totalVehicles: data.length,
		vehicles: data,
	});
}
