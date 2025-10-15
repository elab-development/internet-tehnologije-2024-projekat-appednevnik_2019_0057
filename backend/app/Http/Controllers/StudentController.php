<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = $request->query('q');
        $perPage = $request->query('per_page', 10);

        $query = Student::with(['parent', 'grades.teacher.subject', 'user:id,name,email,role']);

        if ($q) {
            $query->where('ime', 'like', "%{$q}%")
                ->orWhere('razred', 'like', "%{$q}%");
        }

        $students = $query->orderBy('id')->paginate($perPage);

        return response()->json($students);
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
    public function show(Student $student)
    {
        $student->load([
            'parent',
            'grades.teacher.subject',
            'user:id,name,email,role',
        ]);

        return response()->json($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $v = Validator::make($request->all(), [
            'email'   => 'nullable|email|unique:users,email,' . $student->user_id,
            'telefon' => 'nullable|string|max:30',
        ]);
        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        if ($request->filled('email')) {
            $student->user()->update(['email' => $request->email]);
        }
        if ($request->filled('telefon')) {
            $student->telefon = $request->telefon;
            $student->save();
        }

        $student->load([
            'parent.user:id,name,email',
            'user:id,name,email,role',
            'grades.teacher.subject'
        ]);

        return response()->json([
            'message' => 'Podaci ucenika su sačuvani.',
            'student' => $student,
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
