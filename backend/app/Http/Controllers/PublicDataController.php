<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PublicDataController extends Controller
{
    public function holidays(Request $request)
    {
        $year    = $request->query('year', now()->year);
        $country = $request->query('country', 'RS');

        $url = "https://date.nager.at/api/v3/PublicHolidays/{$year}/{$country}";

        $resp = Http::timeout(10)
            ->withoutVerifying()
            ->get("https://date.nager.at/api/v3/PublicHolidays/{$year}/{$country}");

        if (!$resp->successful()) {
            return response()->json(['message' => 'Ne mogu da učitam praznike sa javnog servisa.'], 502);
        }

        $data = $resp->json() ?: [];

        $out = array_map(function ($x) {
            return [
                'localName' => $x['localName'] ?? ($x['name'] ?? ''),
                'name'      => $x['name']      ?? '',
                'date'      => $x['date']      ?? null,
            ];
        }, $data);

        return response()->json($out);
    }
}
