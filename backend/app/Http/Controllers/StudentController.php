<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
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
        $user = $request->user();
        if (!$user || strtolower($user->role) !== 'admin' && strtolower($user->role) !== 'nastavnik') {
            return response()->json(['message' => 'Zabranjen pristup.'], 403);
        }

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
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Niste prijavljeni.'], 401);
        }

        if (strtolower($user->role) === 'roditelj') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if (!$parent || $student->parent_model_id !== $parent->id) {
                return response()->json(['message' => 'Ne mozete menjati podatke ovog ucenika.'], 403);
            }
        } elseif (strtolower($user->role)  !== 'admin') {
            return response()->json(['message' => 'Nemate dozvolu za ovu akciju.'], 403);
        }

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
