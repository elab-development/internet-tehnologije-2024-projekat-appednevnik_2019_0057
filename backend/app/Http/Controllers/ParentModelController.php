<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ParentModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $parents = ParentModel::with('students', 'user:id,name,email,role')
            ->orderBy('id')
            ->paginate($request->query('per_page', 10));

        return response()->json($parents);
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
    public function show(string $id)
    {
        $parent = ParentModel::with('students')->find($id);

        if (!$parent) {
            return response()->json(['message' => 'Roditelj nije pronađen.'], 404);
        }

        return response()->json($parent);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ParentModel $parent)
    {
        $v = Validator::make($request->all(), [
            'email'   => 'sometimes|email|max:255',
            'telefon' => 'sometimes|string|max:50',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        
        if ($request->filled('email')) {
            $parent->user()->update(['email' => $request->email]);
        }

        if ($request->filled('telefon')) {
            $parent->telefon = $request->telefon;
            $parent->save();
        }

        $parent->load(['students', 'user:id,name,email,role']);
        return response()->json([
            'message' => 'Podaci roditelja su uspešno ažurirani.',
            'parent' => $parent,
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
