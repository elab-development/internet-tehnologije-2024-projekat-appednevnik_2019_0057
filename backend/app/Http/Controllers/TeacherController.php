<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $teachers = Teacher::with(['subject', 'user:id,name,email,role'])
            ->orderBy('id')
            ->paginate($request->query('per_page', 10));

        return response()->json($teachers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        $teacher->load('subject', 'user:id,name,email,role');
        return response()->json($teacher);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
       $v = Validator::make($request->all(), [
            'email'   => 'nullable|email|unique:users,email,' . $teacher->user_id,
            'telefon' => 'nullable|string|max:30',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        if ($request->filled('email')) {
            $teacher->user()->update(['email' => $request->email]);
        }

        if ($request->filled('telefon')) {
            $teacher->telefon = $request->telefon;
            $teacher->save();
        }

        $teacher->load(['subject', 'user:id,name,email,role']);

        return response()->json([
            'message' => 'Podaci nastavnika su uspešno ažurirani.',
            'teacher' => $teacher,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
