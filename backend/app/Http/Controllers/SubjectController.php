<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = $request->query('q', '');

        $subjects = Subject::query()
            ->when($q !== '', fn($qb) => $qb->where('naziv', 'like', "%{$q}%"))
            ->orderBy('id')
            ->paginate((int) $request->query('per_page', 10));

        return response()->json($subjects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || strtolower($user->role) !== 'admin') {
            return response()->json(['message' => 'Samo admin može da dodaje predmete.'], 403);
        }

        $v = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255|unique:subjects,naziv',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $subject = Subject::create(['naziv' => $request->naziv]);
        return response()->json($subject, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        return response()->json($subject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subject $subject)
    {
        $user = $request->user();
        if (!$user || strtolower($user->role) !== 'admin') {
            return response()->json(['message' => 'Samo admin može da menja predmete.'], 403);
        }

        $v = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255|unique:subjects,naziv,' . $subject->id,
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $subject->update([
            'naziv' => $request->naziv,
        ]);

        return response()->json($subject);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Subject $subject)
    {
        $user = $request->user();
        if (!$user || strtolower($user->role) !== 'admin') {
            return response()->json(['message' => 'Samo admin može da briše predmete.'], 403);
        }

        $subject->delete();
        return response()->json(['message' => 'Predmet obrisan.']);
    }
}
