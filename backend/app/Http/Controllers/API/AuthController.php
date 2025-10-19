<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
            'telefon'  => 'nullable|string|max:50',

            'child_id' => 'required_if:role,roditelj|exists:students,id',

            'razred'   => 'required_if:role,ucenik|string|max:50',
            'parent_id' => 'nullable|integer|exists:parent_models,id',

            'subject_id' => 'required_if:role,nastavnik|exists:subjects,id',

        ], [
            'child_id.required_if' => 'Morate proslediti ID učenika za roditelja.',
            'razred.required_if' => 'Razred je obavezan za učenika.',
            'subject_id.required_if' => 'Morate proslediti predmet koji nastavnik predaje.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->role === 'roditelj') {
            $student = Student::find($request->child_id);
            if ($student && $student->parent_model_id) {
                return response()->json([
                    'errors' => ['child_id' => ['Ovaj učenik već ima dodeljenog roditelja.']]
                ], 422);
            }
        }
        $user = DB::transaction(function () use ($request) {

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);

            if ($user->role === 'roditelj') {
                $parent = ParentModel::create([
                    'user_id' => $user->id,
                    'telefon' => $request->telefon,
                ]);

                $student = Student::find($request->child_id);
                if (!$student || $student->parent_model_id) {
                    throw new \RuntimeException('Nevalidno stanje: učenik ne postoji ili već ima roditelja.');
                }

                $student->parent_model_id = $parent->id;
                $student->save();
            }

            if ($request->role === 'ucenik') {
                Student::create([
                    'user_id'         => $user->id,
                    'parent_model_id' => $request->parent_id,
                    'razred'          => $request->razred,
                    'telefon'         => $request->telefon,
                ]);
            }

            if ($user->role === 'nastavnik') {
                Teacher::create([
                    'user_id'    => $user->id,
                    'subject_id' => $request->subject_id,
                    'telefon'    => $request->telefon,
                ]);
            }

            return $user;
        });

        $token = $user->createToken('authenticationToken')->plainTextToken;

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Korisnik ne postoji!', 401]);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('authenticationToken')->plainTextToken;
        return response()->json([
            'message' => 'Dobrodošli ' . $user->name . '!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Uspešna odjava!']);
    }
}
