<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $grades = Grade::with(['student', 'teacher', 'teacher.subject'])
            ->orderBy('id', 'desc')
            ->paginate($request->query('per_page', 10));

        return response()->json($grades);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || strtolower($user->role) !== 'nastavnik') {
            return response()->json(['message' => 'Samo nastavnici mogu da unose ocene.'], 403);
        }

        $teacher = $user->teacher;

        if (!$teacher) {
            return response()->json(['message' => 'Nastavnik nije pronadjen.'], 403);
        }

        $v = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'ocena' => 'required|integer|min:1|max:5',
            'datum' => 'nullable|date',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $grade = Grade::create([
            'student_id' => $request->student_id,
            'teacher_id' => $teacher->id,
            'ocena' => $request->ocena,
            'datum' => $request->datum ?? now()->toDateString(),
        ]);

        return response()->json($grade->load(['student', 'teacher', 'teacher.subject']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Grade $grade)
    {
        $grade->load(['student', 'teacher', 'teacher.subject']);
        return response()->json($grade);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function byStudent(Student $student)
    {
        $grades = $student->grades()->with('teacher.subject')->orderBy('datum', 'desc')->get();
        return response()->json([
            'student' => $student,
            'grades' => $grades,
        ]);
    }
}
